# THEMA-BANG — All-round basisthema

## Project
Herbruikbare Shopify-thema-basis, gebouwd op de gratis Dawn-basis, bedoeld om per store te forken/dupliceren en daarna custom te maken (kleuren, fonts, stijl, doelgroep). Deze repo zelf blijft store-neutraal — merkspecifieke keuzes horen in de repo van de individuele store, niet hier.

## Belangrijkste regel
ALLES moet mobiel-first zijn. Eerst mobiel perfect, dan pas desktop. Dit geldt voor elke store die op deze basis draait.

## Werkwijze
- Werk sectie voor sectie, netjes en simpel.
- Leg kort in het Nederlands uit wat je doet, zodat het leerbaar blijft.
- Verander geen kleuren/fonts/merktekst hier in de basis — dat hoort in de store-specifieke repo (zie "Nieuwe store opzetten" hieronder).

## GMC-bedrijfsgegevens (NAP) — per store invullen
De GMC-vereiste bedrijfsgegevens (naam, adres, telefoon, e-mail, uren, reactietijd, registratienummer) staan **leeg** in het thema en worden per store ingevuld via:

**Theme Settings > Company / GMC info (NAP)**

Eén bron, overal consistent (NAP-consistentie is zelf een GMC-vereiste):
- **Footer** (`sections/hh-footer.liquid`) rendert het automatisch via `snippets/nap-block.liquid`.
- **About us**: wijs de Shopify-pagina toe aan het template `page.about-us` (Admin > Pages > About us > Theme template). Toont pagina-content + het NAP-blok onderaan.
- **Contact**: `templates/page.contact.json` toont het formulier + het NAP-blok eronder (dekt ook "reactietijd vermeld").
- Overal elders: voeg de sectie **"Company / GMC info (NAP)"** toe via de theme-editor.
- **Structured data**: `snippets/organization-schema.liquid` zendt automatisch Organization/PostalAddress JSON-LD uit zodra naam + straat zijn ingevuld (uit te zetten via de toggle in dezelfde instellingen-groep).

Leeg veld = nergens getoond, geen placeholders op de live site. Vul minimaal naam + straat/plaats/land + e-mail + telefoon in vóór je een store indient voor GMC-review.

## GMC-hardening — bewust uit de standaard-templates gehaald
De standaard `templates/product.json` bevatte defaults die tegen Google's misrepresentation-beleid ingaan (fake social proof, ongekoppelde urgentie, ongeconfigureerde kortingsclaims). Deze zijn verwijderd uit de standaard-output, maar blijven als blok-type beschikbaar in de editor voor bewust, eerlijk gebruik:
- `hh_rating` — los ingetypt sterrenaantal/reviewcount zonder echte reviews-app. Gebruik alleen met een echte reviews-app-koppeling.
- `hh_urgency` — los urgentie-zinnetje zonder voorraadkoppeling. Gebruik alleen als de tekst een verifieerbaar feit beschrijft.
- `hh_sale_badge` — kortingsbadge. Gebruik alleen als er een echte, geconfigureerde korting met een echte einddatum achter zit.
- `hh_usp` — USP-regel. Elke belofte hierin (verzending, retour, garantie) moet voor die store waar zijn.

Uit de **standaard-output** (`templates/product.json`, `templates/index.json`) zijn weg: het "Summer Sale Bundles"-blok (fake-urgency-copy: "one day only", "stock is limited"), de ongeconfigureerde bundelkorting-claim ("Buy 2 get 10%..."), en overclaims als "24/7"/"5 STAR" support zonder onderbouwing.

Let op het onderscheid — het is drie verschillende dingen:

| Wat | Status |
|---|---|
| Blok-**types** `hh_rating`, `hh_urgency`, `hh_sale_badge`, `hh_usp` | **Bestaan nog** in `sections/main-product.liquid`, bewust, voor eerlijk gebruik per store |
| Die blokken in de standaard-**output** | **Niet aanwezig** — geen enkele staat in de meegeleverde `templates/*.json` |
| De **schema-defaults** van die blokken | **Leeg**, met een `info`-regel die uitlegt wanneer je hem wél invult |

Die laatste rij is de reden dat dit onderscheid ertoe doet. Zolang een blok een default als `"LIMITED SUMMER SALE"` of `"Free shipping with USPS"` in het schema heeft staan, komt de claim voorgevuld terug zodra iemand het blok in de editor toevoegt — ook al is hij uit de output gehaald. Een claim uit de output halen is dus niet genoeg; de default moet óók weg.

Het scherpste voorbeeld was `hh_rating`: dat blok kwam voorgevuld met **4,7 sterren uit "3.172+" beoordelingen**. Wie het blok toevoegde kreeg dus verzonnen social proof zonder daar zelf iets voor in te tikken. Beide defaults zijn nu leeg (`rating_value` op `0`).

Elk van de vier blokken rendert niets als het niet bewust is ingevuld — `hh_usp`, `hh_sale_badge` en `hh_urgency` bij een leeg tekstveld, `hh_rating` bij cijfer `0`. Zonder die guards bleef er anders een lege badge, een los gekleurd bolletje of een rij van nul sterren staan.

Check bij het inrichten van een nieuwe store altijd of promotietaal/kortingsclaims/urgentie ook daadwerkelijk klopt (echte einddatum, echte voorraadlimiet, echt geconfigureerde korting) — zie het GMC self-approval handvat voor de volledige achtergrond.

## Nieuwe store opzetten
1. Fork/dupliceer deze repo naar een eigen repo per store (Shopify's GitHub-koppeling is 1 repo/branch ↔ 1 store — deze basis kan niet direct aan meerdere stores tegelijk gekoppeld worden).
2. Verbind die nieuwe repo aan de Shopify-admin van de store (Online Store > Themes > Add theme > Connect from GitHub).
3. Vul Theme Settings > Company / GMC info (NAP) in.
4. Pas kleuren/fonts/stijl aan via Theme Settings, en documenteer die keuzes in een eigen `CLAUDE.md`-brief in de store-repo (zie archief hieronder voor het format).
5. Trek later verbeteringen uit deze basisrepo handmatig in via een `upstream`-remote (zie README.md, sectie "Staying up to date with Dawn changes" — zelfde principe, nu toegepast op THEMA-BANG als eigen upstream).

## GMC-traject per store — vaste volgorde

Deze volgorde is de uitkomst van het Cavo Hill-traject (13-08-2026). Hij bestaat
omdat we het toen andersom deden: eerst het thema, en pas laat bleek dat het
zwaartepunt bij winkelinstellingen lag.

1. **Vragenlijst invullen.** Kopieer `scripts/gmc-audit/store.example.yml`, vul
   hem in vóór er iets gebouwd wordt. Niets heeft een standaardwaarde: leeg
   blijven is beter dan een aangenomen waarde.
2. **Admin-acties in één sessie.** Deze kan géén API doen — Shopify staat geen
   `shopUpdate` toe, in geen enkele scope:
   - Settings > Store details: klantenservice-e-mail (domein, geen Gmail),
     eigenaars-e-mail, telefoon, adresregel 2, bedrijfsnaam bij het adres
   - Settings > Policies: refund, shipping, terms of service
3. **Eén schrijfronde.** NAP-velden, verzendzones, paginateksten en claims —
   allemaal in één keer, niet verspreid.
4. **Auditscript draaien.** `scripts/gmc-audit/` — zie de README daar.
5. **Alleen visuele checks blijven over.** Pagespeed, malware, mobiel,
   beeldkwaliteit, test-checkout.

### Producten importeren uit een andere winkel

`docs/import-protocol.md` — de controle die elk geïmporteerd product doorloopt vóór
het op ACTIVE gaat: beeldscan per publicatieronde, HTML-wipe in plaats van bewerken,
edited angles, attributen en spelling naar de doelmarkt, claims tegen de eigen
`store.yml`, en wat er moet verschillen als hetzelfde artikel ook op de bronwinkel
staat. Uitgeschreven bij Cavo Hill nadat elf handmatig ingevoerde producten een week
aan correcties hadden gekost.

### Vaste werkafspraken

- **Claims horen niet in de basis.** Elke feitelijke belofte — gratis verzending,
  retourtermijn, levertijd — staat standaard **leeg** en wordt per store bewust
  ingevuld. Leeg = niet tonen, zelfde patroon als het NAP-blok. De basis mag
  nooit een belofte doen die per store waar moet zijn.
- **Toon eerst, schrijf daarna** bij klantzichtbare of juridische tekst. Ook als
  het lezen geautomatiseerd is.
- **Scan het hele bestand op verouderde verwijzingen** na elke wijziging aan een
  document of pagina, niet alleen de regel die je aanpast. Op 13-08 verouderden
  zo zes regels stil in het auditdocument.
- **Bronclaims apart houden van geverifieerde feiten.** Kun je iets niet hard
  bevestigen, zeg dat dan expliciet in plaats van het over te nemen.
- **Genereer het auditrapport, onderhoud het niet met de hand.** Dat is precies
  waarom het script bestaat.

---

## Naamgeving — waarom sommige namen wél en andere niet zijn omgezet

Deze basis droeg tot 24-08-2026 nog Harbor Hudson met zich mee: de bestandsnamen
`harbor-hudson.css` en `harbor-hudson-gallery.js`, een `:root`-palet met hun warme
bruin `#40260c` als accent, en hun volledige merkbrief in dit bestand. Dat ging in
tegen de regel die drie alinea's hierboven staat — merkkeuzes horen in de store-repo.
Weg nu, en bewust op dit moment: er is één fork (Cavo Hill), dus het kostte één
conflictronde. Bij twee forks was het er twee geweest.

**Wat is omgezet:**

| Was | Is |
|---|---|
| `assets/harbor-hudson.css` | `assets/theme-brand.css` |
| `assets/harbor-hudson-gallery.js` | `assets/product-gallery.js` |
| `--hh-brown`, `--hh-cream`, `--hh-muted`, … | `--brand-accent`, `--brand-surface`, `--brand-muted`, … |
| Accent `#40260c`, creme `#faf6f0`, gedempt `#6b6257` | `#1a1a1a`, `#f5f5f4`, `#6b6b6b` |

De nieuwe kleurwaarden zijn **plaatshouders, geen ontwerp**: neutraal grijs/inkt, zo
generiek dat je ziet dat er nog niets gekozen is. Elke store overschrijft ze in de eigen
`theme-brand.css` en in Theme Settings. Sale-groen en oud-prijs-rood zijn wél blijven
staan: dat zijn functionele kleuren, geen merkkeuze.

**Wat bewust nog `hh-` heet:** de CSS-klassen (`hh-urgency`, `hh-sale-badge`, …), de
sectie `sections/hh-footer.liquid` met `assets/hh-footer.css`, en de bloktypes
`hh_rating`, `hh_usp`, `hh_sale_badge`, `hh_urgency`.

Die zijn niet zomaar tekst maar **identifiers waar opgeslagen data aan hangt**. Een
bloktype en een sectiebestandsnaam staan letterlijk in `templates/*.json` en in
`sections/*-group.json` van élke store die op deze basis draait, en in de
themasettings die Shopify zelf bijhoudt. Hernoemen betekent: basis én elke fork in
dezelfde handeling om, en bij een gepubliceerd thema is dat een wijziging die je in de
live winkel terugziet. Dat is een aparte, bewuste operatie — geen bijvangst van het
opruimen van een merknaam.

Voor een nieuwe fork maakt het niets uit: `hh` staat nergens meer voor, en de
letters komen niet op de storefront terecht.

## Een store-CLAUDE.md schrijven

Het format staat niet meer als voorbeeld in dit bestand — de brief van Harbor Hudson
hoort in Harbor Hudson's eigen repo. Kijk voor een ingevuld voorbeeld naar
`cavohill-theme/CLAUDE.md`: merk (kleuren met rol en hex, fonts), hoe de winkel
werkelijk werkt (fulfillment, verzendzone, levertijd), welke claims mogen en waarom,
waar dingen staan, en wat er open staat. Zet er alleen in wat niet uit de code te
lezen is.
