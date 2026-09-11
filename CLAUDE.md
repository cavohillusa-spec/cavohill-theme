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

**Op 27-08-2026 is van dit protocol afgeweken** — de 53 nooit-bekeken producten gingen
mee live, alleen de 13 met een openstaande bevinding zijn tegengehouden. Die achterstand
is op 06-09-2026 ingelopen voor de producten die kandidaat waren voor de selectie van 50,
en dat leverde **zeven nieuwe merktekenvondsten** op: "SPORT" op een hielkraag, een
logobadge op een tong, "FASHION" in een gesp, een geweven label "COOL CHOICE" op een vest,
snaffle-bit-beslag op damesloafers, een embleem op een hielkap, en een geborduurd logo op
een jurk. Alle zeven staan nu op DRAFT. Zie `~/gmc-project/publicatieronde-06-09-2026.md`.

Wat dat weerlegt: de aanname dat de bevindingen zich tot schoenen beperken. Een vest en
een jurk droegen ze ook. De producten die nooit kandidaat waren (nu DRAFT) zijn nog steeds
niet bekeken.

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

Bijgewerkt 08-09-2026, gemeten tegen de live winkel — niet overgenomen uit een gesprek.

**De winkel staat op 50 actieve producten.** Op 06-09 teruggebracht van 81; de 31 die
eraf gingen staan op DRAFT, niet verwijderd. De catalogus telt sinds 08-09 **93**
producten: 50 actief, 43 draft, en de storefront toont er 50. Ze hebben alt-tekst op elk
beeld, een SKU op elke variant en nergens een `compareAtPrice`; `custom.gender` en
`custom.age_group` staan overal, maar zie de waarschuwing hieronder over
`google_product_category`. Grond en verantwoording
per uitgesloten product: `~/gmc-project/publicatieronde-06-09-2026.md`.

**Er wordt óók in de admin gewerkt — meet vóór je iets aanneemt.** Tijdens de ronde van
08-09 veranderde de catalogus onder handen: `womens-longline-quilted-puffer-jacket` (die
ACTIVE stond) is verwijderd en `womens-longline-hooded-winter-coat` is van DRAFT naar
ACTIVE gegaan. De twee restjes daarvan zijn op 11-09 dichtgezet:

- De verwijderde puffer jacket heeft nu een 301 naar `/collections/all`, gelijk aan elk
  eerder verwijderd product. De winkel telt daarmee **twintig** redirects.
- De winterjas staat nu ook op `google_product_category` `5598`, gelijk aan de drie
  andere jassen. "Alle 50 hebben die drie metafields" is daarmee weer waar — op 11-09
  nagemeten: nul actieve producten zonder `google_product_category`, `custom.gender` of
  `custom.age_group`.

**Alle veertien collecties staan op `MANUAL` met een handmatig gezette volgorde.** Ze
stonden op `BEST_SELLING`, wat op een winkel zonder bestellingen geen ordening is maar
een willekeurige volgorde. Let op: een smart collection accepteert hier gewoon
`collectionUpdate(sortOrder: MANUAL)` gevolgd door `collectionReorderProducts` — dat is
een async job, wacht op `job { done }` en meet daarna de storefront na.

**Het thema is gepubliceerd.** `cavohill-theme/main` is sinds 16-08 het enige thema op de
winkel en draait op MAIN. Het oude "Dawn"-thema met de verzonnen reviews-slider is
daarmee weg. Wie hier nog leest dat het thema niet gepubliceerd is: dat was tot 15-08 waar.

Ook afgerond sinds die notitie: de vijf verzonnen merknaam-handles en alle acht
SKU-prefixen zijn omgezet, de veterschoenen staan op US-maten, en de vier policies bestaan
in Settings > Policies. **Alt-tekst is compleet**: op 27-08 nagemeten over de hele
catalogus — 544 media, nul zonder alt-tekst. (Het getal 97 in oudere notities sloeg op de
tien oorspronkelijke producten, niet op de huidige catalogus.)

Openstaand op 27-08:

- **De adresafwijking is weg.** Het shopveld staat op `30 N Gould St Ste R` en het
  telefoonveld op `(917) 718-9438`; de omweg via regel 1 heeft gewerkt. De auto-beheerde
  checkout-privacypolicy rendert het adres nu volledig, gelijk aan de rest van de site.
  Op 06-09 nagemeten op zowel `/policies/privacy-policy` als `/pages/privacy-policy`.
  Eén schoonheidsfoutje blijft: het shopveld kent geen komma, dus de checkout toont
  `30 N Gould St Ste R` en het NAP-blok `30 N Gould St, Ste R`.
- **De annuleertermijn van 4 uur staat in de Shipping policy en Terms, niet in de refund
  policy** — terwijl een klant die wil annuleren daar als eerste kijkt. Geen tegenspraak,
  wel een vindbaarheidskwestie.
- **De beeldscan is af voor wat live staat, niet voor de rest.** De 50 actieve producten
  zijn op 06-09 beeld voor beeld nagelopen. De 44 op DRAFT zijn dat deels niet.

Afgehandeld op 08-09-2026 (backup van alles wat aangeraakt is:
`~/gmc-project/backup-ronde-08-09-2026.json`):

- **De valutategenspraak is weg.** Payment policy en Billing Terms dragen nu dezelfde
  sectie "Supported Currencies": alles in USD, geen checkout in een andere valuta, en de
  koers van een buitenlandse bank is die van de bánk. De alinea "Purchases can be made in
  currencies supported by Shopify" met het wisselkoersverhaal is geschrapt. De FAQ zei al
  het goede en is niet aangeraakt. **Let op: er bestaat geen checkout-Payment policy** —
  Shopify kent dat policytype niet, de Payment policy is uitsluitend
  `/pages/payment-policy`. Wie zoekt naar "de checkoutversie" van dit stuk zoekt naar iets
  dat niet bestaat.
- **De `<img>`- en `<style>`-restjes zijn weg**, uit zes producten en niet uit vier. Naast
  de vier met een `<img>` droegen `mens-classic-low-cut-lace-up-shoes` (actief) en
  `mens-relaxed-fit-cargo-shorts` (draft) een weesblok `.size-table`-CSS zónder `<img>`;
  die vielen buiten de oude telling omdat daar op `<img>` was gezocht. Vier van de vijf
  `<style>`-blokken stylden een klasse die in hun eigen body niet voorkwam. Bij
  `womens-off-shoulder-tiered-maxi-dress` bestond de `<div class="size-table">` wél, en
  die is uitgepakt tot een kale `<table>` — precies zoals de andere 43 tabellen, die hun
  opmaak van `.rte table` in `base.css` krijgen. Er is dus geen `.size-table`-CSS naar het
  thema verhuisd; die klasse werd nog maar door één product gebruikt.
- **`XXL` is overal `2XL`.** Achttien varianten over drie producten, via
  `productOptionUpdate` op de optiewaarde. **De SKU's zijn bewust ongemoeid gelaten** —
  Simprosys leest de SKU als MPN, en achttien MPN's omgooien vlak voor een GMC-indiening
  is precies de identifier-churn die je niet wilt. In de SKU-string staat dus nog `XXL`
  (`MaxiDress-Black/XXL-Ld6jTqMa`); dat is intern en komt nergens klantzichtbaar terug.
  In `womens-relaxed-boho-print-maxi-dress` stond `XXL` ook in de beschrijving, in de
  regel "Size range" én als tabelrij — allebei meegenomen.
- **Er is nog één privacypolicy in omloop.** `/policies/privacy-policy` (auto-beheerd) is
  canoniek en de footer wijst er nu heen. **Let op waar die footerlinks vandaan komen:**
  niet uit het navigatiemenu `hoofd` (titel POLICY), maar uit de `policy_link`-blokken in
  `sections/footer-group.json`. Het menu aanpassen verandert niets aan wat een klant ziet;
  dat menu staat nu voor de zekerheid ook goed, maar de regel die telt is de `url` in dat
  themabestand — en die gaat dus via commit + push, niet via de API.
  `/pages/privacy-policy` is verwijderd met een 301 naar de policy — de winkel heeft
  daarmee negentien redirects. De twee versies waren **niet** 100% identiek zoals eerder
  genoteerd: gerenderd verschilden ze op precies twee punten, de datum (27 vs 16 augustus)
  en de contactregel (`+1 917-718-9438` / `30 N Gould St Ste R` tegen `+1 917 718 9438` /
  `30 N Gould St, Ste R`). Inhoudelijk nul verschil. Dat de body van de checkoutversie via
  de API zo veel langer oogt komt doordat je daar de **ruwe Liquid** terugkrijgt, inclusief
  `{% if selling_to_europe %}`-blokken die hier nooit renderen — vergelijk dus altijd de
  gerenderde storefront, niet de policy-body.

**Nul `compareAtPrice`, catalogusbreed — hard nagemeten op 11-09-2026.** Aanleiding: Mees
overweegt "Enable Sale Price" in Simprosys aan te zetten voor een toekomstige sale. Gemeten
via `productVariants` (los van de per-product limiet van 100, dus geen variant gemist):
93 producten, 50 actief en 43 draft, **2.590 varianten**, nul met een `compareAtPrice` > 0
en nul met een lege-maar-gezette waarde (`""` of `0.00`) — alles staat op `null`. Die
schakelaar heeft daarmee op dit moment geen effect op de feed. Komt de sale er, dan pas
een compare-at zetten nadat de reguliere prijs een tijd heeft gestaan (stappenplan fase 6,
punt 34: echte prijshistorie, korting 5–90%), anders is het alsnog een kortingsclaim zonder
onderbouwing. Meet dit opnieuw na elke import — de vorige meting was van vóór de laatste
Moralea-import en telde daardoor minder varianten.

**Alle 50 actieve producten hebben `Color` én `Size` als optie — sinds 11-09.** Voor apparel
in de VS zijn `color` en `size` verplichte feedattributen en twee producten misten er één:
`womens-knee-high-boots` had alleen `Size` (nu `Color: Brown`, bevestigd op de foto en in
de beschrijving) en `womens-oversized-open-front-long-coat` had alleen `Color` (nu
`Size: One Size`, later diezelfde dag op verzoek van Mees uitgebreid naar **S t/m 3XL**).
Gezet via `productOptionsCreate` met `variantStrategy: LEAVE_AS_IS`; bij de laarzen zijn
de **SKU's ongemoeid**, dus die MPN's zijn niet veranderd. De jas staat nu op **36
varianten** (6 kleuren × S, M, L, XL, 2XL, 3XL): "One Size" is hernoemd naar `S` zodat de
zes bestaande variant-ID's bleven, hun SKU's kregen `/S` erin met dezelfde suffix
(`LongCoat-Beige/S-KjhAdjTe`), en de 30 nieuwe volgen dezelfde conventie met `2XL`, niet
`XXL`. Alles 88,95, `CONTINUE`, geen compare-at. Dat kon zonder identifier-zorg omdat er
nog nooit een feed is gesynct. Let op: de jas is een van de zes zonder maattabel in de
beschrijving — met zes maten hoort die er nu wel bij. Backups:
`~/gmc-project/backup-opties-jas-laarzen-11-09-2026.json` en
`backup-jas-voor-S-3XL-11-09-2026.json`.
Daarmee hoeft Simprosys geen uitzonderingsregel voor deze twee; de mapping
`color` → optie `Color`, `size` → optie `Size` dekt de hele catalogus.

Nieuw op 06-09, nog open:

- **Kiwi Sizing werkt sinds 11-09.** Mees heeft de charts per collectie in Kiwi gezet
  (dames XS–4XL, heren, schoenen op US-maat + voetlengte), maar de knop verscheen niet.
  Oorzaak: Kiwi kent geen `injectionSelector` en herkent het thema niet (`theme_store_id`
  is `null`), en het app-blok in `templates/product.json` stuurde
  `fallbackToBlockPosition: false` mee. Geen selector, geen herkend thema, geen fallback =
  geen knop. Fix: `"fallbackToBlockPosition": true` in de `settings` van het blok
  `kiwi_size_chart` — dat is de toggle "Custom size chart placement" in de editor. **De
  sleutel is camelCase**; Shopify stript bij het ophalen uit GitHub elke sleutel die het
  blokschema niet kent, dus een verkeerde sleutel verdwijnt stil. Vergelijk na een push
  altijd het themabestand via `themes { files }` met wat er in git staat.
  Nagemeten in headless Chromium, mobiel en desktop: knop tussen kleurswatches en
  maatknoppen (Kiwi Variant Selector heeft er een placeholder voor), modal met de juiste
  tabel per collectie, ook op de zes producten zonder `<table>` in de beschrijving.
  De handmatige tabellen in `~/gmc-project/kiwi-size-charts-plakken.md` zijn daarmee
  achterhaald als plakwerk; ze blijven de bron van de waarden.
- **"Stripe Identity" staat nog in de Billing Terms** als mogelijke verificatiedienst bij
  transacties met een hoger bedrag. Of die dienst werkelijk aanstaat is nooit nagegaan.
- **De About us gaat alleen over vrouwen** ("Designed for women who appreciate timeless
  style") terwijl er een volledige herenafdeling is. De Contact-pagina zegt wél "for men
  and women".
- **Geen barcodes.** Nul van de varianten heeft een GTIN. Voor een merkloos product met
  merk "Cavo Hill" wil GMC dan `identifier_exists: false` in de feed; dat moet in
  Simprosys staan, niet hier.

**De app heeft nu zestien scopes.** Op 27-08 uitgebreid van zes naar zestien. Daarmee is
de hele "dat kan niet via de API"-categorie uit oudere notities vervallen: policies,
redirects, publicaties, pagina's, thema's en markten zijn nu wél te lezen en te schrijven.
Wat er in zit: `read/write` op `products`, `files`, `inventory`, `content`,
`legal_policies`, `online_store_navigation`, `publications`, plus `read_themes` en
`read_markets`. Alleen `read_shipping` ontbreekt nog — daardoor is de claim "free
shipping" nog steeds niet tegen de werkelijke verzendzone te controleren.

Afgerond op 27-08 dankzij die scopes:

- **Drie checkoutpolicies weggeschreven**, niet twee: Shipping policy, Terms of service
  én Contact information. Die laatste had een e-mailadres in een `<a>` zonder `href` en
  een `<svg><use>` naar een pad dat hier niet bestaat — nul werkende contactopties in de
  checkout. Nu `mailto:` en `tel:`, allebei live geverifieerd. De drie bodies zijn
  byte-identiek aan `~/gmc-project/checkout-policies-plakken.md`; de vorige versies staan
  in `checkout-policies-backup-27-08-2026.json`.
- **Het adres staat overal gelijk** — `30 N Gould St, Ste R` op de Terms-pagina, de
  checkout-Terms, About us, Contact en in de footer. Punt 76 is daarmee rond aan de
  sitekant. Op shopniveau staat nog steeds alleen `30 N Gould St`, want daar bestaat geen
  mutatie voor.
- **De douaneclaim is geschrapt.** "You will not be charged customs duties or import
  fees on your order." is weg uit Terms artikel 7 (pagina én checkout) en uit de FAQ.
  Aanleiding: Elle Charleston, een vergelijkbare US-only winkel, belooft dit nergens —
  waar zij douane noemen is het een voorbehoud in de refund policy, en alleen bij
  retouren. Bij een winkel die uitsluitend binnen de VS verzendt roept de zin een vraag
  op die er anders niet is, en beantwoordt hem met een garantie die niemand kan
  afdwingen. Zie `~/gmc-project/douaneclaim-vergelijking-elle-charleston.md`; de vorige
  tekst staat in `backup-terms-faq-voor-douaneschrapping-27-08-2026.json`.
- **De privacypagina spiegelt nu de checkoutversie.** Beide staan op 16 augustus. De
  checkoutversie staat op **automatisch beheer** — daarom liep hij vooruit op de pagina
  van 9 februari, en daarom weigert `shopPolicyUpdate` hem: *"Automatic management for
  Privacy Policy must be turned off"*. Die schakelaar zit niet in de API. De body bevat
  Liquid (`{{ shop_name }}`, `{{ last_updated }}`), dus voor de pagina is de
  **gerenderde** versie overgenomen, niet de ruwe. Eén bewuste afwijking: het adres is
  met de hand op `Ste R` gezet, want de auto-beheerde versie haalt het uit het lege
  shopveld.
- **De twee "orthopedic"-producten zijn hernoemd**, met redirect. Ze kwamen uit batch 1
  en waren nooit door de medische-termen-opschoning van batch 2 gegaan.
  `womens-cushioned-orthopedic-flat-slip-on-shoes` heet nu
  `womens-cushioned-flat-slip-on-shoes` ("Women's Cushioned Flat Slip-On Shoes") en
  `womens-cushioned-orthopedic-loafers` heet `womens-cushioned-penny-loafers`
  ("Women's Cushioned Penny Loafers"). Ook "reducing pressure" en "light orthopedic wear"
  zijn uit de teksten. Backup: `~/gmc-project/backup-orthopedic-hernoemen-27-08-2026.json`.

  **Let op: hernoemen raakt vier plekken, niet één.** Titel en handle zijn het makkelijke
  deel; de term stond óók in de **alt-teksten** van alle veertien beelden en in de
  **bestandsnamen** op de CDN. Die laatste twee komen niet boven in een scan die alleen
  titel, beschrijving en tags leest — de eerste controle miste ze daardoor. Bestandsnamen
  zijn te wijzigen met `fileUpdate` (`filename` in `FileUpdateInput`), alt-tekst in
  dezelfde mutatie.

  Bijwerking om te kennen: na een bestandsnaamwijziging geeft de **oude** URL meteen 404,
  terwijl gecachete productpagina's er nog naar verwijzen. Dat gaf hier ongeveer twintig
  seconden gebroken beelden. Onschadelijk bij twee producten, maar doe dit niet in bulk
  op een druk moment.
- **De lege collectie `frontpage` is verwijderd**, met redirect naar `/collections/all`.
  Handmatige collectie, nul producten, en het thema verwees er nergens naar — de homepage
  draait op `women` en `men`. Stond wél in de sitemap, dus Google crawlde een lege
  categoriepagina. Zelfde behandeling als de vijf collecties van 24-08, punt 91. Backup:
  `~/gmc-project/backup-frontpage-collectie-27-08-2026.json`.
- **Omruilen staat nu in het beleid.** Aanleiding: het GMC-formulier declareert "Yes, I
  accept exchanges", terwijl de refund policy omruilen wél noemde in de intro maar nooit
  definieerde. Dat verschil tussen declaratie en gepubliceerd beleid is precies waar een
  reviewer op valt. De nieuwe sectie beschrijft omruilen bewust als **retour + nieuwe
  bestelling**: bij verzending rechtstreeks uit Ningbo is een echte omruiling twee
  rondreizen en dus vijf tot acht weken, wat we niet kunnen waarmaken. Retour + opnieuw
  bestellen is eerlijker én sneller voor de klant. Voor schade verandert niets — daar
  staat al gratis vervanging zonder terugsturen.
- **Vier tekstdefecten opgeruimd die de eindcontrole niet zag**, omdat ze niet over
  woorden gingen maar over opmaak:
  - `<li><p>` in de policy-editor van Shopify brak elke opsomming (bullet los, tekst
    eronder). Opgelost in `theme-brand.css`, zie het blok "Lijsten in beleidsteksten".
  - De Payment policy én Billing Terms noemden nog **30 dagen** terugbetaling nadat de
    refund policy op 7 werkdagen ging. Zelf veroorzaakt en zelf gevonden; beide
    gelijkgetrokken.
  - **Emoji** (📧 en 📞) in de Refund policy, Terms en FAQ — de enige op de hele site, en
    in headless rendering vallen ze weg als een gat. Overal vervangen door echte
    `mailto:`- en `tel:`-links.
  - In de FAQ stonden "Return & Exchange Policy" en "Contact page" **vet in plaats van
    als link**, en de eerste verwees naar een beleidsnaam die niet bestaat. Nu allebei
    werkende links.
- **De feed loopt via Simprosys, niet via het kanaal Google & YouTube.** Bevestigd door
  Mees op 27-08. Dat dat kanaal op nul producten staat is dus geen probleem en er hoeft
  niets op gepubliceerd te worden.
- **Het meldtermijn voor schade is van 30 naar 7 dagen gegaan**, pagina én checkout: "If
  your order arrives damaged or faulty… contact us within 7 days of delivery". De
  retourtermijn zelf blijft 30 dagen — dat zijn twee verschillende klokken en alleen de
  eerste is verkort.
- **De terugbetalingstermijn is van 30 dagen naar 7 werkdagen gegaan**, pagina én
  checkout. Startpunt is bewust de goedkeuring **op locatie**, niet de verzenddatum van
  de klant: de retour gaat naar de leverancier en die transporttijd is niet te
  garanderen. Daarmee staan we op dit punt beter dan Elle Charleston (10 werkdagen). Let
  op dat "approved" nu twee betekenissen heeft in dezelfde tekst — de goedkeuring van het
  retourverzoek (waarna de klant binnen 5 werkdagen moet versturen) en de goedkeuring op
  locatie. Niet tegenstrijdig, wel een woord om in de gaten te houden bij een herschrijving.
- **"Shipping is free on all orders" heeft het bestemmingsland gekregen** in Terms
  artikel 7, pagina én checkout: nu "within the United States", gelijk aan de Shipping
  policy. De zin klopt daarmee ook los geciteerd.
- **Zeven redirects erbij op 27-08**, waarmee de winkel er achttien heeft. De drie
  verwijderde producten en de lege `frontpage` wijzen naar `/collections/all`; de twee
  hernoemde producten wijzen naar hun nieuwe handle. De zevende was een ketting die de
  verwijdering zelf had gemaakt: `vextor-casual-panelled-low-top-mens-trainers` wees naar
  de sneakers, en die wezen daarna door. Platgeslagen naar één hop. Let op dat
  `productUpdate` met een nieuwe handle **geen** redirect aanmaakt — die moet je er zelf
  met `urlRedirectCreate` bij zetten.

Let op bij `shopPolicyUpdate`: `ShopPolicyInput` neemt **`type`**, niet `id` — een `id`
meegeven levert "Field is not defined on ShopPolicyInput" op.

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
