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
terughaalt) en `assets/theme-brand.css`, in het `:root`-blok bovenaan.

Dat bestand heette tot 24-08-2026 `harbor-hudson.css`, met een variabele `--hh-brown`
waar teal in zat. Dat was bewust: hernoemen zou elke merge met upstream op zestien
regels laten conflicteren. Dat argument is omgekeerd toen de basis zelf werd
opgeschoond — daar heet het nu `theme-brand.css` met `--brand-accent`, dus mee bewegen
is nu juist de manier om die conflicten te vermijden. De rolnamen komen van de basis,
de waarden zijn van deze store.

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
batch 2).

Wie hier komt met het plan "eerst de hele beeldscan afmaken": dat is bewust losgelaten.

**Op 27-08-2026 is van dit protocol afgeweken.** Mees koos ervoor de 53 nooit-bekeken
producten mee te publiceren; alleen de 13 met een openstaande bevinding zijn
tegengehouden. De beeldscan van 24 t/m 77 staat dus nog open, nu achteraf in plaats van
vooraf. Zie `~/gmc-project/publicatieronde-27-08-2026.md`.

**Aanname die niet klopte:** de notitie hieronder ging ervan uit dat het merkteken alleen
in de extra beelden zat en het hoofdbeeld schoon was. Bij beide onderzochte producten zat
het merkteken óók in het hoofdbeeld, want het zit op het kledingstuk zelf. Leid nooit uit
"het hoofdbeeld is schoon" af dat de rest te repareren is — kijk elk beeld apart na.

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

Bijgewerkt 27-08-2026, gemeten tegen de live winkel — niet overgenomen uit een gesprek.

**Het thema is gepubliceerd.** `cavohill-theme/main` is sinds 16-08 het enige thema op de
winkel en draait op MAIN. Het oude "Dawn"-thema met de verzonnen reviews-slider is
daarmee weg. Wie hier nog leest dat het thema niet gepubliceerd is: dat was tot 15-08 waar.

Ook afgerond sinds die notitie: de vijf verzonnen merknaam-handles en alle acht
SKU-prefixen zijn omgezet, de veterschoenen staan op US-maten, en de vier policies bestaan
in Settings > Policies. **Alt-tekst is compleet**: op 27-08 nagemeten over de hele
catalogus — 544 media, nul zonder alt-tekst. (Het getal 97 in oudere notities sloeg op de
tien oorspronkelijke producten, niet op de huidige catalogus.)

Openstaand op 27-08:

- **Twee checkoutpolicies wachten op Mees.** `shopPolicyUpdate` vereist de scope
  `write_legal_policies`, en die zit in geen van beide apps op deze winkel. De
  kant-en-klare teksten staan in `~/gmc-project/checkout-policies-plakken.md`: de
  Shipping policy (mist nog het bestemmingsland) en de Terms (adresnotatie). Zolang dat
  niet gebeurd is, staan er twee versies van dezelfde tekst op de winkel — de pagina
  klopt, de checkoutversie niet.
- **Store details.** Adresregel 2 (`Ste R`) en het telefoonveld zijn nog leeg op
  shopniveau, terwijl het NAP-blok ze wél toont. Niet via de API te zetten.
- **`gmc_registration_number` is leeg** — het Wyoming filing-nummer van Novelle House
  LLC. Het enige NAP-veld dat nog niets rendert.
- **De douaneclaim** ("You will not be charged customs duties or import fees") staat nog
  in Terms artikel 7 en in de FAQ. Bewust onaangeroerd tot Mees beslist: het is de enige
  belofte op de site die over het handelen van een derde partij gaat.
- **Drie redirects ontbreken.** De drie verwijderde producten (zie hieronder) hebben geen
  redirect; `urlRedirectCreate` vereist `write_online_store_navigation` en die scope zit
  niet in de app. Met de hand in Settings > Navigation > URL redirects, de exacte paden
  staan in `~/gmc-project/verwijderde-producten-merkteken.md`.
- **De beeldscan van producten 24 t/m 77 staat open** — die 53 zijn op 27-08 gepubliceerd
  zonder visuele controle, zie de paragraaf hierboven.

Afgerond op 27-08-2026:

- **De drie galerijen met een merkteken zijn opgelost door verwijdering.** De cargobroek
  (Nike-swoosh) ging op 26-08, de sneakers (merkletters op de hiellip, plus een
  Duits-legertrainer-silhouet dat niet te retoucheren is) en de joggers (geweven label +
  logobadge) op 27-08. Alle drie met volledige backup van product en beelden in
  `~/gmc-project/`; de verantwoording staat in `verwijderde-producten-merkteken.md`.
- **73 producten gepubliceerd.** De catalogus staat nu op **94 producten: 81 actief, 13
  draft**, en de storefront toont er 81 — admin en storefront zijn gelijk. De 13 die
  DRAFT blijven zijn precies de producten met een openstaande beeldscanbevinding; ze
  staan met reden opgesomd in `~/gmc-project/publicatieronde-27-08-2026.md`.

**Publiceren kost twee velden, niet één.** `productUpdate(status: ACTIVE)` alleen laat de
storefront 404 geven: het product zit dan nog niet in het Online Store-kanaal en
`publishedAt` is `null`. `publishablePublish` kan hier niet — de app mist
`read/write_publications`. Wat wel werkt is `productUpdate(input: {id, publishedAt})`.
Meet altijd de storefront zelf na; de `productsCount` in de admin stond hier 73 producten
naast de werkelijkheid.

De banner-kwestie is weg: "BIGGEST PRE-SUMMER SALE / Up to 50% Off — Limited Stock" is op
15-08 vervangen door "THE SUMMER EDIT" met de twee geverifieerde beloftes eronder. Er staat
nu nergens meer een kortingsclaim zonder geconfigureerde korting.

## Kiwi Variant Selector

De app `kiwi-variant-selector` verbergt de eigen variant picker van het thema (beide
fieldsets krijgen `display: none` via JS) en rendert zijn eigen kleurswatches en
maatknoppen. De picker in `snippets/product-variant-picker.liquid` en de bijbehorende CSS
onder "Kleur als fotoswatches" en "Maat als rechthoekige knoppen" staan er dus nog wel,
maar zijn op de productpagina niet zichtbaar. Verwijder ze niet zonder eerst de app uit te
zetten.

Kiwi kwam binnen met Shopify-defaults: zwart `#121212` als gekozen staat en radius 999px
op de maten — precies de ronde capsules die dit thema bewust had weggehaald. Het blok
"Kiwi Variant Selector op het merk" onderaan `assets/theme-brand.css` trekt dat recht.
Dat blok heeft overal `!important` nodig omdat Kiwi zijn kleuren als inline `style` zet.

**Dat is een vangnet, geen eindstation.** De waarden horen in het Kiwi-dashboard; ze staan
klaar in `~/gmc-project/kiwi-variant-selector-waarden.md`. Zijn ze daar gezet, dan kan het
CSS-blok weg.

Let op bij rem-waarden in dit thema: `theme.liquid` zet de root op
`calc(var(--font-body-scale) * 62.5%)` en de body-scale staat op 115, dus **1rem ≈ 11,5px,
niet 10px**. De comments bij de maatknoppen noemen 44px terwijl 4.4rem hier ~50px is.
