/**
 * Verboden/risicovolle woorden uit handvat-punt 26 (Editorial requirements 6150244).
 *
 * Twee niveaus:
 *  - blocker : woorden die Google's editorial policy expliciet afkeurt
 *  - warn    : woorden die per geval kloppen kunnen zijn, maar bewijs vereisen
 *
 * Bewust NIET hier: gezondheids- en ziekteclaims. Die vallen onder het
 * restricted-products-beleid, een ander regime met eigen eisen. Stores in die
 * categorie horen niet door dit script gecontroleerd te worden — zie de
 * category-guard in audit.mjs.
 */

export const TRIGGER_WORDS = [
  // --- blocker -------------------------------------------------------------
  { term: 'guarantee', level: 'blocker', why: 'Editorial: absolute garantie-claim. Gebruik "returns" of "refund policy".' },
  { term: 'guaranteed', level: 'blocker', why: 'Zie "guarantee".' },
  // "100%" en "#1" komen constant voor in CSS (breedtes) en hex-kleuren, dus
  // alleen flaggen in combinatie met een claimwoord erachter.
  { pattern: /100\s*%\s*(satisfaction|guarantee|guaranteed|free|safe|natural|effective|authentic)/i,
    term: '100% + claimwoord', level: 'blocker', why: 'Absolute claim; vrijwel nooit hard te maken.' },
  { pattern: /#\s*1\s+(in|for|brand|choice|seller|rated)\b/i,
    term: '#1 + superlatief', level: 'blocker', why: 'Superlatief zonder bron.' },
  { term: 'risk-free', level: 'blocker', why: 'Absolute claim zonder onderbouwing.' },
  { term: 'no risk', level: 'blocker', why: 'Absolute claim zonder onderbouwing.' },
  { term: 'best price', level: 'blocker', why: 'Superlatief zonder verifieerbare vergelijking.' },
  { term: 'lowest price', level: 'blocker', why: 'Superlatief zonder verifieerbare vergelijking.' },
  { term: 'cheapest', level: 'blocker', why: 'Superlatief zonder verifieerbare vergelijking.' },
  { term: 'number one', level: 'blocker', why: 'Superlatief zonder bron.' },

  // --- warn ----------------------------------------------------------------
  { term: 'free shipping', level: 'warn', why: 'Moet exact overeenkomen met de verzendtarieven in Shopify.' },
  { term: 'free delivery', level: 'warn', why: 'Zie "free shipping".' },
  { term: 'limited stock', level: 'warn', why: 'Alleen toegestaan bij echte voorraadkoppeling.' },
  { term: 'limited time', level: 'warn', why: 'Alleen met een echte einddatum.' },
  { term: 'one day only', level: 'warn', why: 'Alleen met een echte einddatum.' },
  { term: 'today only', level: 'warn', why: 'Alleen met een echte einddatum.' },
  { term: 'selling fast', level: 'warn', why: 'Ongefundeerde urgentie.' },
  { term: 'hurry', level: 'warn', why: 'Ongefundeerde urgentie.' },
  { term: '24/7', level: 'warn', why: 'Alleen als er daadwerkelijk 24/7 support is.' },
  { term: 'instant', level: 'warn', why: 'Zelden letterlijk waar bij fysieke levering.' },
  { term: 'lifetime', level: 'warn', why: 'Vereist een expliciet nagekomen toezegging.' },
];

/** Scan een tekst; geeft de gevonden triggers terug. */
export function scanText(text) {
  if (!text) return [];
  const s = String(text);
  const lower = s.toLowerCase();
  return TRIGGER_WORDS.filter(({ term, pattern }) =>
    pattern ? pattern.test(s) : lower.includes(term.toLowerCase())
  );
}

/**
 * Sleutels waarvan de waarde klantzichtbaar wordt. Alleen déze scannen we in
 * JSON-templates en schema-blokken — anders levert een blok-ID als
 * "usp_guarantee" een treffer op die niemand ooit ziet.
 */
export const CONTENT_KEYS = new Set([
  'text', 'title', 'heading', 'subheading', 'content', 'label',
  'default', 'link_text', 'button_label', 'top_subheading', 'info',
]);

/** Loopt een geparste JSON-structuur af en levert [pad, tekst]-paren op. */
export function* contentStrings(node, pad = '') {
  if (node === null || typeof node !== 'object') return;
  for (const [k, v] of Object.entries(node)) {
    const p = pad ? `${pad}.${k}` : k;
    if (typeof v === 'string') {
      if (CONTENT_KEYS.has(k)) yield [p, v];
    } else {
      yield* contentStrings(v, p);
    }
  }
}
