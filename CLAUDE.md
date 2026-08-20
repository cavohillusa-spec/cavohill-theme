# Cavo Hill — thema-brief

## Project
Shopify-thema voor **Cavo Hill**, een Amerikaanse fashion-webshop. Gebouwd op
[THEMA-BANG](https://github.com/meesdix/THEMA-BANG), dat als `upstream`-remote is
gekoppeld. Deze repo is store-specifiek: merkkeuzes horen hier, niet in de basis.

Juridische entiteit: **Novelle House LLC**. Cavo Hill is een merk van die entiteit — de
DBA-regel in het NAP-blok maakt dat expliciet, want een reviewer die twee losse namen ziet
zonder verband gaat vragen stellen.

## Belangrijkste regel
ALLES mobiel-first. Eerst mobiel perfect, dan pas desktop. Overgenomen uit de basis en
hier onverkort van kracht.

## Merk

**Kleuren** — het bruin `#40260C` dat via de fork uit Harbor Hudson meekwam is op
14-08-2026 vervangen; het was nooit voor Cavo Hill gekozen.

| Rol | Hex |
|---|---|
| Accent — knoppen, footer, announcement-balk | Diepe teal `#1F4B47` |
| Creme — rustige secties | `#FAF6F0` |
| Announcement-creme | `#F6EDCF` |
| Wit — hoofdachtergrond | `#FFFFFF` |
| Inkt — tekst | `#1A1A1A` |
| Gedempt — secundaire tekst | `#6B6257` |
| Sale-groen | `#1E7A5A` |

Teal op wit haalt 9,7:1 contrast — ruim boven AAA. Let op dat het sale-groen dicht bij de
teal ligt in tint; als dat bij visueel nalopen vlak oogt, verschuift het **sale-groen**,
niet de teal.

**Fonts**: koppen Playfair Display, body Assistant, beide op scale 115 voor leesbaarheid.

**Waar de kleuren staan**: `config/settings_data.json` (acht accentvelden in
`current.color_schemes` én dezelfde acht in `presets.Dawn`, zodat een reset het bruin niet
terughaalt) en `assets/harbor-hudson.css`. Die CSS heet nog naar de vorige store en de
variabele heet nog `--hh-brown` terwijl er teal in zit — bewust, want hernoemen laat elke
toekomstige merge met upstream op zestien regels conflicteren. `--hh-brown` verwijst naar
`--hh-accent`.

## Hoe deze winkel werkelijk werkt

Dit is de context die het langst onduidelijk was en die de meeste teksten raakt:

- **Fulfillment: rechtstreeks vanuit China.** Leverancier is Dayone Fulfillment Co., Ltd.
  in Ningbo. Producten gaan van de leverancier naar de klant; er is geen eigen magazijn.
- **Verzendzone: alleen de VS.** Dat gaat over wíe mag kopen, niet over waar het pakket
  vandaan komt. Die twee zijn eerder door elkaar gehaald en dat kostte een halve dag.
- **Levertijd**: 1–3 werkdagen verwerking, 6–12 werkdagen transit, 7–15 totaal.
- **Geen douanekosten voor de klant** — in een jaar nooit voorgekomen, bevestigd door
  Mees.
- **Noem geen vervoerder.** Bij directe verzending uit China is de laatste etappe niet te
  bevestigen. "Free shipping" wel, "Free shipping with USPS" niet.
- **Markt**: USA (regio US), valuta USD, `taxesIncluded: false`, geen staten geregistreerd
  dus 0% sales tax.
- **Shopify-locatie**: `Supplier Location`, Ningbo, China. Dat veld voedt de
  douaneberekening en moet de werkelijke verzendoorsprong zijn. Een locatie in de VS zou
  fysieke nexus in Wyoming creëren — niet doen.

## Claims

De basisregel uit THEMA-BANG geldt hier dubbel: **elke feitelijke belofte staat standaard
leeg en wordt bewust ingevuld.** Wat er nu staat en waarom het mag:

| Claim | Onderbouwing |
|---|---|
| "Free shipping" | Verzendzone US rekent $ 0,00, geverifieerd |
| "30-day returns" | Retourbeleid beschrijft 30 dagen. **Niet** "guarantee" — dat is een blocker-triggerwoord |
| "1–3 business days" verwerking | Gelijk in Terms, Shipping Policy, FAQ en productpagina |
| "6–12 business days" transit / "7–15" totaal | Gelijk in Terms artikel 7, Shipping Policy en de productpagina-FAQ |
| "We reply within 1–2 business days" | Toegevoegd 15-08. Haalbaar bij een e-mailpostvak dat ma-vr wordt gelezen; **de enige claim in deze tabel die op een voornemen rust en niet op een gemeten instelling** |

Vier blokken in `sections/main-product.liquid` — `hh_rating`, `hh_urgency`,
`hh_sale_badge`, `hh_usp` — bestaan wel maar hebben lege schema-defaults en een
render-guard. Leeg = niet getoond. Vul ze alleen als de belofte voor déze store waar is.

Dat gold op 14-08 alleen voor `hh_usp`. De andere drie hadden nog ingevulde defaults
(`4.7` / `3.172+`, "LIMITED SUMMER SALE", "Limited pairs available…") én geen guard, dus
een vers toegevoegd blok toonde meteen een verzonnen cijfer. Op 15-08 rechtgezet: alle
vier hebben nu een lege default en een `!= blank`-guard. Wie hier een blok toevoegt en
niets invult, publiceert niets.

## Werkwijze

- **Toon eerst, schrijf daarna** bij klantzichtbare of juridische tekst. Tags, attributen
  en collectiekoppelingen mogen direct.
- **Scan het hele bestand op verouderde verwijzingen** na elke wijziging, niet alleen de
  regel die je aanpast. Een waarde die vanochtend klopte kan 's middags de tegenovergestelde
  waarheid zijn — dat is hier letterlijk gebeurd met de verzendoorsprong.
- **Bronclaims apart van geverifieerde feiten.** Kun je iets niet hard bevestigen, zeg dat.
- **Meet vóór en ná** bij instellingen die aan meerdere systemen hangen (belasting,
  duties, feed). Nulmeting van de storefrontprijs is de goedkoopste vangrail die er is.
- **Deze repo is GitHub-gekoppeld aan Shopify op branch `main`.** Wijzigingen gaan via
  commit + push, niet via de Admin API — een directe API-write werkt tegen die koppeling in.
  Shopify pusht zelf terug bij theme-editor-wijzigingen, dus altijd eerst `git fetch`.

## Beeldscan op merktekens — per publicatieronde, niet vooruit

Herzien op 20-08-2026. **Scan alleen de producten die in de eerstvolgende publicatieronde
meegaan.** De 76 geïmporteerde producten worden níét in één keer doorgelicht terwijl ze nog
weken op DRAFT staan.

Merkbeeld op een productfoto is een **afkeuringsrisico op itemniveau** bij Google's eigen
beeldherkenning: het raakt dát product, niet het account. Dat is een andere categorie dan
wat hierboven onder Claims staat — verzonnen reviewcijfers, tegenstrijdige
verzendbeloftes, korting zonder geconfigureerde korting — want dát zijn accountbrede
risico's, en die behandelen we wél volledig en vooraf.

Per ronde: bepaal de selectie → scan alléén die → fix of sla het product over → dan pas
publiceren. De volledige werkwijze staat in `~/gmc-project/import-moralea.md` §1; wat er al
bekeken is in `~/gmc-project/moralea-import/beeldscan-notes.md` (producten 1 t/m 23 van
batch 2, negen bevindingen open, 53 producten bewust nog niet bekeken).

Wie hier komt met het plan "eerst de hele beeldscan afmaken": dat is bewust losgelaten.

## Waar dingen staan

- **NAP-gegevens**: Theme Settings > Company / GMC info, opgeslagen in
  `config/settings_data.json` als `gmc_*`. Eén bron; footer, About us en Contact renderen
  hem via `snippets/nap-block.liquid`.
- **Auditscript**: `scripts/gmc-audit/` — vergelijkt voornemen (`store.yml`) met de live
  Shopify-config. Vereist een admin-token in de shell. Het ingevulde voornemen voor deze
  winkel staat bewust buiten de repo: `~/gmc-project/store-cavohill.yml`.
- **GMC-handvat**: `~/gmc-project/GMC-handvat-cavohill.md` — de volledige checklist met
  status per punt.
- **Actielijst admin**: `~/gmc-project/actielijst-admin.md` — alles wat níét in deze repo
  kan, in volgorde van uitvoering.
- **Fotoplan**: `~/gmc-project/fotoplan-cavohill.md` — welke foto op welke plek hoort,
  met de prompt erbij.

## Belangrijk om te weten bij het oppakken

Dit thema is op 14-08-2026 nog **niet gepubliceerd**. Live draait een ander thema dat
"Dawn" heet maar dat niet is. Alles in deze repo — NAP, gecorrigeerde verzendteksten,
herstelde homepage-links, teal — wordt pas zichtbaar na publicatie.

Openstaand op het moment van schrijven (bijgewerkt 15-08-2026):

- **Alles wat buiten deze repo ligt.** De thema-kant is af; wat rest zit in de
  Shopify-admin en in het live Dawn-thema. De volledige lijst met volgorde staat in
  `~/gmc-project/actielijst-admin.md`.
- **Handles en SKU's** dragen verzonnen merknamen (`Caprize-`, `Loxen-`, `Vextor-`,
  `Trekstr-`, `Veldro-`, `Kargen-`, `Verlaine-`, `Tierlova-`). Handle en SKU zijn één
  beslissing, niet twee. Voorgestelde mapping inclusief redirects staat in de actielijst;
  uitvoeren wijzigt live URL's en feed-links, dus dat gebeurt bewust en in één keer.
- **Productfoto's**: 1 van de 11 is schoon, de rest draagt risico op leveranciers- of
  merkbeeld. Het volledige plan — welke foto waar hoort en met welke prompt — staat in
  `~/gmc-project/fotoplan-cavohill.md`.

De banner-kwestie is weg: "BIGGEST PRE-SUMMER SALE / Up to 50% Off — Limited Stock" is op
15-08 vervangen door "THE SUMMER EDIT" met de twee geverifieerde beloftes eronder. Er staat
nu nergens meer een kortingsclaim zonder geconfigureerde korting.
