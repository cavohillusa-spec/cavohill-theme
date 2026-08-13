#!/usr/bin/env node
/**
 * GMC-audit — vergelijkt het VOORNEMEN (store.yml) met de WERKELIJKHEID
 * (live Shopify-config) en genereert een handvat-rapport.
 *
 *   node scripts/gmc-audit/audit.mjs path/to/store.yml [> rapport.md]
 *
 * Waarom twee lagen: het is niet genoeg dat iemand bevestigt "wij doen gratis
 * verzending". Op 13-08-2026 stond dat bevestigd én stonden er € 19,95
 * verzendkosten in de checkout. Een claim telt hier pas als "Voldoet" wanneer
 * voornemen en live config allebei hetzelfde zeggen. Wijken ze af, dan is dat
 * automatisch een Blocker — nooit "handmatig controleren".
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseYaml } from './mini-yaml.mjs';
import { fetchStoreState } from './shopify.mjs';
import { scanText, contentStrings } from './trigger-words.mjs';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Categorieën waarvoor dit script is gebouwd en getest. */
const SUPPORTED_CATEGORIES = ['apparel'];

let results = [];
export const resetResults = () => (results = []);
export const getResults = () => results;
const add = (point, title, status, evidence, action = '') =>
  results.push({ point, title, status, evidence, action });

const digits = (s) => String(s ?? '').replace(/\D/g, '');
const txt = (s) => String(s ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- guard ----

export function guardCategory(cfg) {
  const cat = cfg?.store?.category;
  if (!cat) {
    console.error('FOUT: store.yml mist `store.category`. Vul in: ' + SUPPORTED_CATEGORIES.join(', '));
    process.exit(2);
  }
  if (!SUPPORTED_CATEGORIES.includes(cat)) {
    console.error(
      `\nGESTOPT — categorie "${cat}" valt buiten dit script.\n\n` +
        `Dit script is gebouwd en getest voor: ${SUPPORTED_CATEGORIES.join(', ')}.\n` +
        `Categorieën als supplements, health, medical, financial en adult vallen onder\n` +
        `Google's restricted-products-beleid: een ander regime met eigen eisen rond\n` +
        `gezondheidsclaims, ingrediënten en certificering. Die zitten NIET in deze\n` +
        `checklist en worden hier dus ook niet gecontroleerd.\n\n` +
        `Een "grotendeels groen" rapport zou daar misleidend zijn. Bouw voor zo'n\n` +
        `store een eigen checklist in plaats van deze te hergebruiken.\n`
    );
    process.exit(3);
  }
}

// -------------------------------------------------------------- checks ----

export function checkIdentity(cfg, s) {
  const want = cfg.identity ?? {};
  const addr = s.shop.shopAddress ?? {};

  const email = s.shop.contactEmail ?? '';
  if (/@gmail\.|@hotmail\.|@outlook\.|@yahoo\./i.test(email)) {
    add(6, 'E-mail is geen gratis provider', 'Voldoet niet',
      `\`contactEmail\` = ${email}`, 'Domein-e-mail instellen in Settings > Store details');
  } else if (want.email && email.toLowerCase() !== String(want.email).toLowerCase()) {
    add(6, 'E-mail is geen gratis provider', 'Voldoet niet',
      `Live: ${email} — store.yml: ${want.email}`, 'Gelijktrekken');
  } else {
    add(6, 'E-mail is geen gratis provider', 'Voldoet', `\`contactEmail\` = ${email}`);
  }

  if (!addr.phone) {
    add(7, 'Zakelijk telefoonnummer', 'Voldoet niet', '`shopAddress.phone` is leeg',
      'Invullen in Settings > Store details (niet via API mogelijk)');
  } else if (want.phone && digits(addr.phone) !== digits(want.phone)) {
    add(7, 'Zakelijk telefoonnummer', 'Voldoet niet',
      `Live: ${addr.phone} — store.yml: ${want.phone}`, 'Gelijktrekken');
  } else {
    add(7, 'Zakelijk telefoonnummer', 'Voldoet', addr.phone);
  }

  const wa = want.address ?? {};
  const mismatch = [];
  if (wa.line1 && wa.line1 !== addr.address1) mismatch.push(`straat: "${addr.address1}" vs "${wa.line1}"`);
  if (wa.line2 && wa.line2 !== addr.address2) mismatch.push(`toevoeging: "${addr.address2 || '(leeg)'}" vs "${wa.line2}"`);
  if (wa.zip && wa.zip !== addr.zip) mismatch.push(`postcode: "${addr.zip}" vs "${wa.zip}"`);
  add(8, 'Zakelijk adres compleet', mismatch.length ? 'Voldoet niet' : 'Voldoet',
    mismatch.length ? mismatch.join('; ') : `${addr.address1} ${addr.address2 || ''}, ${addr.city} ${addr.provinceCode} ${addr.zip}`,
    mismatch.length ? 'Settings > Store details' : '');

  if (want.legal_name) {
    add(73, 'Juridische naam bij het adres',
      addr.company === want.legal_name ? 'Voldoet' : 'Voldoet niet',
      `\`shopAddress.company\` = "${addr.company || '(leeg)'}" — verwacht "${want.legal_name}"`,
      addr.company === want.legal_name ? '' : 'Settings > Store details');
  }

  add(14, 'Niet password-protected',
    s.onlineStore?.passwordProtection?.enabled ? 'Voldoet niet' : 'Voldoet',
    `passwordProtection = ${s.onlineStore?.passwordProtection?.enabled}`);
  add(5, 'HTTPS + SSL', s.shop.primaryDomain?.sslEnabled ? 'Voldoet' : 'Voldoet niet',
    `sslEnabled = ${s.shop.primaryDomain?.sslEnabled}`);
}

export function checkNapConsistency(cfg, s) {
  const want = cfg.identity ?? {};
  if (!want.phone) return;
  const wantD = digits(want.phone);
  const afwijkend = [];
  for (const p of s.pages.nodes) {
    for (const m of txt(p.body).matchAll(/\+\s*\d[\d\s().-]{7,}/g)) {
      const d = digits(m[0]);
      if (d && d !== wantD) afwijkend.push(`${p.handle}: "${m[0].trim()}" (${d.length} cijfers)`);
    }
  }
  add(76, 'NAP-consistentie — telefoon op alle pagina\'s',
    afwijkend.length ? 'Voldoet niet' : 'Voldoet',
    afwijkend.length ? afwijkend.join('; ') : `Alle vermeldingen komen uit op ${wantD}`,
    afwijkend.length ? 'Nummers gelijktrekken' : '');
}

export function checkPolicies(s) {
  const aanwezig = new Set(s.shop.shopPolicies.map((p) => p.type));
  const nodig = ['REFUND_POLICY', 'SHIPPING_POLICY', 'TERMS_OF_SERVICE', 'PRIVACY_POLICY'];
  const mist = nodig.filter((t) => !aanwezig.has(t));
  add(92, 'Policies in Settings > Policies (checkout linkt hiernaar)',
    mist.length ? 'Voldoet niet' : 'Voldoet',
    mist.length ? `Ontbreekt: ${mist.join(', ')}` : 'Alle vier aanwezig',
    mist.length ? 'Handmatig invullen — write_legal_policies is admin-only' : '');
}

/** DE TWEE-LAGEN-CHECK: verzendbelofte versus echte tarieven. */
export function checkShipping(cfg, s) {
  const want = cfg.commerce?.shipping ?? {};
  const zones = [];
  for (const prof of s.deliveryProfiles.nodes) {
    for (const lg of prof.profileLocationGroups) {
      for (const z of lg.locationGroupZones.nodes) {
        zones.push({
          naam: z.zone.name,
          landen: z.zone.countries.map((c) => c.code.countryCode),
          tarieven: z.methodDefinitions.nodes
            .filter((m) => m.active && m.rateProvider?.price)
            .map((m) => ({ bedrag: Number(m.rateProvider.price.amount), valuta: m.rateProvider.price.currencyCode })),
        });
      }
    }
  }

  // laag 1 vs laag 2 — landen
  const wantLanden = (cfg.commerce?.target_countries ?? []).map(String);
  const liveLanden = s.shop.shipsToCountries ?? [];
  if (wantLanden.length) {
    const extra = liveLanden.filter((c) => !wantLanden.includes(c));
    add(106, 'Verzendlanden = doelmarkt',
      extra.length ? 'Voldoet niet' : 'Voldoet',
      extra.length
        ? `store.yml wil ${wantLanden.join(', ')}; live verzendt de winkel ook naar ${extra.join(', ')}`
        : `${liveLanden.join(', ')}`,
      extra.length ? 'Zones beperken, óf de teksten aanpassen aan de werkelijkheid' : '');
  }

  // laag 1 vs laag 2 — de gratis-verzending-belofte
  const model = want.cost_model; // free_all | free_in_target | rate_per_zone
  if (model === 'free_all' || model === 'free_in_target') {
    const betaald = zones.flatMap((z) =>
      z.tarieven.filter((t) => t.bedrag > 0).map((t) => `${z.naam}: ${t.valuta} ${t.bedrag}`)
    );
    add(99, 'Verzendbelofte = werkelijke tarieven',
      betaald.length ? 'Voldoet niet' : 'Voldoet',
      betaald.length
        ? `store.yml zegt "${model}", maar de checkout rekent: ${betaald.join(', ')}`
        : 'Alle actieve tarieven staan op 0',
      betaald.length ? 'BLOCKER: belofte en checkout spreken elkaar tegen' : '');
  } else if (model === 'rate_per_zone') {
    add(99, 'Verzendbelofte = werkelijke tarieven', 'Handmatig controleren',
      `store.yml zegt "rate_per_zone" — controleer of de site nergens gratis verzending belooft`);
  }

  // valuta
  const valutas = [...new Set(zones.flatMap((z) => z.tarieven.map((t) => t.valuta)))];
  const vreemd = valutas.filter((v) => v !== s.shop.currencyCode);
  if (vreemd.length) {
    add(77, 'Verzendtarieven in winkelvaluta', 'Voldoet niet',
      `Winkel is ${s.shop.currencyCode}, tarieven staan in ${vreemd.join(', ')}`, 'Tarieven omzetten');
  }
}

export function checkTax(cfg, s) {
  const heft = cfg.commerce?.charges_sales_tax;
  if (heft === false) {
    add(78, 'Prijs sluit sales tax uit', 'N.v.t.',
      `store.yml: geen sales tax geheven. Bij 0% is prijs site = feed = checkout, ongeacht \`taxesIncluded\` (nu ${s.shop.taxesIncluded})`);
  } else if (heft === true) {
    add(78, 'Prijs sluit sales tax uit', s.shop.taxesIncluded ? 'Voldoet niet' : 'Voldoet',
      `\`taxesIncluded\` = ${s.shop.taxesIncluded}`,
      s.shop.taxesIncluded ? 'Zet om naar exclusief (Settings > Belastingen)' : '');
  }
}

export function checkCatalog(s) {
  const leeg = s.collections.nodes.filter((c) => c.productsCount.count === 0);
  add(31, 'Collectiepagina niet leeg', leeg.length ? 'Voldoet niet' : 'Voldoet',
    leeg.length ? `${leeg.length} van ${s.collections.nodes.length} collecties zijn leeg: ${leeg.map((c) => c.handle).join(', ')}` : 'Alle collecties gevuld',
    leeg.length ? 'Vullen of verwijderen' : '');

  const metCompare = s.products.nodes.filter((p) => p.variants.nodes.some((v) => v.compareAtPrice));
  add(90, 'Compare-at / sale-strepen uit tot goedkeuring',
    metCompare.length ? 'Voldoet niet' : 'Voldoet',
    metCompare.length ? `${metCompare.length} producten met compareAtPrice` : 'Geen enkele variant heeft compareAtPrice');

  const zonderSku = s.products.nodes.filter((p) => p.variants.nodes.some((v) => !v.sku));
  add(105, 'identifier_exists / SKU aanwezig', zonderSku.length ? 'Risico' : 'Voldoet',
    zonderSku.length ? `${zonderSku.length} producten met varianten zonder SKU` : 'Alle bekeken varianten hebben een SKU');
}

export function checkTriggerWords(s) {
  const treffers = [];
  const zoek = (bron, tekst) => {
    for (const t of scanText(tekst)) treffers.push({ bron, ...t });
  };
  for (const p of s.pages.nodes) zoek(`pagina/${p.handle}`, txt(p.body));
  for (const p of s.products.nodes) zoek(`product/${p.handle}`, p.title);

  // Thema-bestanden: alleen klantzichtbare strings scannen, niet de hele bron.
  // Anders levert een blok-ID als "usp_guarantee" of een CSS-breedte van 100%
  // een treffer op die nooit een klant bereikt.
  const scanJson = (bron, tekst) => {
    try {
      const zonderHeader = tekst.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '');
      for (const [pad2, waarde] of contentStrings(JSON.parse(zonderHeader))) {
        zoek(`${bron} (${pad2})`, waarde);
      }
    } catch {}
  };

  const walk = (dir, prefix) => {
    for (const naam of readdirSync(dir)) {
      const pad = join(dir, naam);
      if (statSync(pad).isDirectory()) continue;
      const bron = `${prefix}/${naam}`;
      if (naam.endsWith('.json')) {
        scanJson(bron, readFileSync(pad, 'utf8'));
      } else if (naam.endsWith('.liquid')) {
        // in Liquid staan klantzichtbare defaults in het schema-blok
        const m = readFileSync(pad, 'utf8').match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema/);
        if (m) scanJson(`${bron} (schema)`, m[1]);
      }
    }
  };
  for (const map of ['templates', 'sections', 'snippets']) {
    try { walk(join(REPO, map), map); } catch {}
  }

  const blockers = treffers.filter((t) => t.level === 'blocker');
  add(26, 'Geen verboden/risicovolle woorden',
    blockers.length ? 'Voldoet niet' : treffers.length ? 'Risico' : 'Voldoet',
    treffers.length
      ? treffers.map((t) => `${t.bron}: "${t.term}" (${t.level})`).join('; ')
      : 'Geen triggerwoorden gevonden',
    blockers.length ? 'Blocker-woorden herformuleren' : '');
}

// -------------------------------------------------------------- rapport ----

export function rapport(cfg, s) {
  const telling = results.reduce((acc, r) => ((acc[r.status] = (acc[r.status] ?? 0) + 1), acc), {});
  const nu = process.env.AUDIT_DATE ?? new Date().toISOString().slice(0, 10);

  const regels = [
    `# GMC-audit — ${cfg.store?.name ?? s.shop.name}`,
    '',
    `| | |`,
    `|---|---|`,
    `| Domein | ${s.shop.primaryDomain?.host} |`,
    `| Categorie | ${cfg.store?.category} |`,
    `| Doelland | ${(cfg.commerce?.target_countries ?? []).join(', ') || '—'} |`,
    `| Valuta | ${s.shop.currencyCode} |`,
    `| Gegenereerd | ${nu} |`,
    '',
    '> Automatisch gegenereerd. Niet met de hand bijwerken — draai het script opnieuw.',
    '> Punten die hier niet in staan vereisen een oog of een browser en blijven handwerk.',
    '',
    '## Telling',
    '',
    '| Status | Aantal |',
    '|---|---|',
    ...Object.entries(telling).map(([k, v]) => `| ${k} | ${v} |`),
    '',
    '## Bevindingen',
    '',
    '| # | Punt | Status | Bewijs | Actie |',
    '|---|---|---|---|---|',
    ...results
      .sort((a, b) => a.point - b.point)
      .map((r) => `| ${r.point} | ${r.title} | ${r.status === 'Voldoet' ? r.status : `**${r.status}**`} | ${r.evidence} | ${r.action} |`),
    '',
  ];
  return regels.join('\n');
}

// ----------------------------------------------------------------- main ----

const aangeroepen = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (!aangeroepen) {
  // geimporteerd als module (tests) - niets uitvoeren
} else {
const pad = process.argv[2];
if (!pad) {
  console.error('Gebruik: node scripts/gmc-audit/audit.mjs <store.yml>');
  process.exit(1);
}

const cfg = parseYaml(readFileSync(pad, 'utf8'));
guardCategory(cfg);

const state = await fetchStoreState();
checkIdentity(cfg, state);
checkNapConsistency(cfg, state);
checkPolicies(state);
checkShipping(cfg, state);
checkTax(cfg, state);
checkCatalog(state);
checkTriggerWords(state);

console.log(rapport(cfg, state));
}
