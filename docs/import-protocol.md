# Importprotocol — producten van een andere winkel overnemen

Store-neutrale versie van een protocol dat bij Cavo Hill is uitgeschreven nadat elf
handmatig ingevoerde producten ongeveer een week aan correcties hadden gekost:
verzonnen merknamen in handles en SKU's, Britse spelling op een Amerikaanse winkel,
EU-maten, merktekens in foto's, en claims die de eigen fulfillment tegenspraken.

**De regel die boven alles gaat: een import die deze controles overslaat, importeert
precies dat werk opnieuw.** Volume is geen reden om de lat te verlagen — het is de
reden dat de lat mechanisch moet zijn.

Vul per store in wat hier tussen `<haakjes>` staat. De waarden horen in `store.yml`
(zie `scripts/gmc-audit/store.example.yml`), niet in dit bestand.

---

## 1. Foto's — per publicatieronde, niet de hele batch vooruit

**Scan alleen de producten die in de eerstvolgende ronde live gaan.** Niet honderd
producten doorlichten terwijl ze nog weken op DRAFT staan.

De reden zit in het soort risico. Een merkteken op een productfoto is een
**afkeuringsrisico op itemniveau** bij Google's beeldherkenning: het raakt dát
product. Dat is een andere categorie dan verzonnen reviewcijfers, tegenstrijdige
verzendbeloftes of korting zonder geconfigureerde korting — dat zijn **accountbrede**
risico's, en die behandel je wél vooraf en volledig.

Per ronde: bepaal de selectie → scan alléén die → fix of sla het product over → dan
pas publiceren. Houd bij wat je bekeken hebt, met de bevinding per product; een
product met een openstaande bevinding gaat niet mee in een ronde.

### Waar je naar kijkt

Handmatig kijken. Nooit afleiden uit bestandsnaam, titel of tag — die liegen precies
bij de producten waar het misgaat.

| Waar op letten | Waarom het aankomt |
|---|---|
| **Merkteken van een derde** — logo, swoosh, ingeperste letters, geweven label, badge | Direct afkeuringsgrond op itemniveau |
| **Herkenbaar silhouet van een bestaand merk** | Retouche lost dit *niet* op: het probleem is de vorm, niet een detail |
| **Marktplaats-crop** — tweede persoon, halve arm, afwijkende ratio | Verraadt dat het beeld niet van jou is |
| **Stijlbreuk met de set** — andere setting, ander licht | Een winkel die uit losse bronnen is geplakt leest als een dropship-etalage |
| **Tekst, prijssticker, kortingsbadge of SALE-overlay** | Blocker; directe feed-afkeuring |
| **Watermerk of leverancierslogo** | Idem |

Kies één bestaand beeld als **ijkpunt** — een neutrale packshot die je zeker weet dat
goed is — en houd elk nieuw beeld daar tegenaan.

**Wat AI hier wél mag doen:** de échte foto opschonen (achtergrond, vreemde arm,
merkteken). Nooit een product verzinnen dat niet in de doos zit. Zet het
generatiemodel op 2k en houd de resolutie gelijk over de hele catalogus.

**Alt-tekst op élk medium.** Formule die werkt:
`<product> in <kleur>, <front/side/back> view`, of `…, close-up of the <detail>`.

### Edited angles — variantbeelden

De belangrijkste oorzaak van misrepresentation-meldingen in fashion: dezelfde pose,
belichting en achtergrond over meerdere kleurvarianten, waarbij alleen de kleur
digitaal is aangepast.

Meet per product met meer dan één kleur:

1. Zijn de kleurbeelden identiek in pixelafmeting én binnen enkele procenten in
   bestandsgrootte? Dat is het goedkope signaal — PNG- en JPEG-headers geven de
   afmetingen zonder externe bibliotheken.
2. Bekijk de kandidaten daarna **visueel**: exact dezelfde houding, belichting,
   achtergrond, bijkleding en schaduw?

Oordeel in drie smaken: `N.V.T.` (één kleur), `SCHOON` (zichtbaar verschillende
opnames), `VERDACHT` (identieke opname, alleen hergekleurd). Bij `VERDACHT` helpt
retoucheren niet — er bestaat maar één opname. De enige echte route is per kleur een
eigen foto.

**Koppel elk kleurbeeld aan zijn variant.** Anders ziet een klant die "Purple" kiest
het standaardbeeld.

---

## 2. HTML-hygiëne — wissen, niet bewerken

**Maak de beschrijving eerst leeg in de HTML-view, sla op, en bouw hem daarna pas
opnieuw op.** Niet de bestaande tekst bewerken.

Waarom dat verschil uitmaakt: zichtbare tekst bewerken laat onzichtbare attributen en
metadata van de vorige site gewoon staan. Bij Cavo Hill zaten er in één
productbeschrijving 16× `data-start`, 16× `data-end` en 3× `data-is-`; op de
contactpagina stond bovendien een `<svg><use href="/cdn/assets/sprites-core-….svg">`
dat naar een pad wees dat op die storefront niet bestond. Visueel onzichtbaar, dus
niemand zag het — tot iemand ernaar zocht.

**Scan op:** `data-start`, `data-end`, `data-is-`, `sprites-core`, `<svg><use`,
losse `<meta>`-tags midden in de tekst, inline `style=`, `class=` met een prefix die
niet van het thema is, en elke `href`/`src` die niet naar `cdn.shopify.com` wijst.

**Externe media:** geen enkel beeld mag naar een niet-eigen domein linken. Hotlinks
naar het CDN van de bronwinkel komen vaak mee in de beschrijving, soms met de
merknaam van die winkel in de `alt`. Weg ermee; de foto's staan al in de galerij.
Haal ook `<style>`-blokken van de bron weg — dat is CSS van een andere winkel die je
in je eigen productpagina injecteert. Let op de bijwerking: klassen die door die CSS
werden opgemaakt renderen daarna kaal. Dat hoort in het thema, niet in de tekst.

**Ook `<a>`-tags zonder `href` opsporen.** Een e-mailadres in een link zonder href is
platte tekst die eruitziet als een link. Dat kost je een werkende contactoptie op de
pagina waar een reviewer er twee wil zien.

---

## 3. Attributen, spelling en maten — naar de standaard van de doelmarkt

| Veld | Eis |
|---|---|
| `vendor` | De eigen merknaam, overal gelijk — dit wordt `brand` in de feed |
| `productType` | **Volledige taxonomiestring**, niet een losse term. Dit wordt `product_type` |
| Productcategorie | Gezet, niet `null` |
| Optienamen en -waarden | In de spelling van de doelmarkt (`Color`/`Gray`, niet `Colour`/`Grey`) |
| Maten | Het maatsysteem van de doelmarkt, met `size_system` erbij |
| SKU | **Elke variant.** Patroon `<Prefix>-<Kleur>/<Maat>-<random>` |
| SKU-prefix | Beschrijvend. **Geen verzonnen merknaam, geen apostrof** |
| `barcode` | Leeg laten bij eigen-merkproducten — brand + MPN is een geldige identifier |
| `custom.gender`, `custom.age_group` | Gevuld |
| Handle | Beschrijvend, zonder verzonnen merknaam |

Drie dingen die je van tevoren moet weten:

1. **De SKU ís de MPN.** Een SKU-wijziging is voor Google een nieuwe artikelidentiteit.
   Doe dit vóór indiening, nooit erna — anders gooi je de itemhistorie weg.
2. **Een handle-wijziging via de API maakt géén redirect aan.** Dat doet alleen de
   admin-UI. Maak er zelf een `urlRedirect` bij.
3. **Handle en SKU zijn één beslissing.** Half doen levert een winkel op waar de URL
   schoon is en de feed nog de oude naam roept.

**Spelling.** Deze lijst is bij een US-store daadwerkelijk tegengekomen; scan er
letterlijk op in titel én beschrijving:

`trousers`→`pants` · `trainers`→`sneakers` · `colour`→`color` · `grey`→`gray` ·
`panelled`→`paneled` · `favourite`→`favorite` · `customise`→`customize` ·
`fulfil(ment)`→`fulfill(ment)` · `enquiries`→`inquiries` · `authorised`→`authorized` ·
`cancelled`→`canceled` · `centres`→`centers` · `travelling`→`traveling` ·
`rigours`→`rigors` · `dialled`→`dialed`

Gebruik de rechte apostrof `'`, niet de krul `’` — die laatste sluipt binnen via
tekstverwerkers en maakt van één titel de uitzondering.

**Triggerwoorden — blocker.** Geen `guarantee` (ook niet "money-back guarantee"),
geen `100%`, geen `best price`, geen `®`/`™`, geen promotekst in de titel, geen
merknaam van een derde. De volledige lijst staat in
`scripts/gmc-audit/trigger-words.mjs` en wordt door het auditscript gescand.

---

## 4. Claims tegen de eigen situatie

Dit is de sectie waar geïmporteerde tekst het vaakst botst: de bronwinkel heeft een
andere logistiek. **Elke feitelijke belofte in een geïmporteerde beschrijving wordt
verwijderd of vervangen door de waarde van déze store**, zoals vastgelegd in
`store.yml`.

Meteen schrappen als het in de brontekst staat:

- **Elke vervoerdersnaam**, tenzij je de hele keten kunt bevestigen. Bij directe
  verzending uit het buitenland is de laatste etappe niet te bevestigen.
- **Elke verwijzing naar een magazijn of "ships from <land>"** die niet klopt. Let op
  het onderscheid dat hier makkelijk misgaat: de **verzendzone** gaat over wie mag
  kopen, de **verzendoorsprong** over waar het pakket vandaan komt. Dat zijn twee
  verschillende velden en twee verschillende beloftes.
- **Same-day dispatch, 24h shipping, express** — spreekt een verwerkingstijd van
  meerdere dagen tegen.
- **Beoordelingscijfers, aantallen reviews, "X mensen kochten dit"** — tenzij er een
  echte reviewbron is.
- **Schaarste en urgentie** ("limited stock", "only 3 left") — tenzij de voorraad
  echt gekoppeld is.
- **Kortingsclaims** ("50% off", "was $X") — tenzij er een geconfigureerde korting
  met een echte einddatum achter zit.

De vier claimblokken in `sections/main-product.liquid` (`hh_rating`, `hh_usp`,
`hh_sale_badge`, `hh_urgency`) hebben lege defaults en een render-guard. Leeg = niet
getoond. Zo hoort het te blijven.

---

## 5. Overlap met de bronwinkel

Voor elk product dat óók op de bronwinkel verkocht wordt, moet het resultaat
aantoonbaar anders zijn. Twee winkels die hetzelfde artikel met identieke foto en
identieke tekst verkopen, lezen als één dropship-netwerk — precies het beeld dat een
handmatige review afstraft.

| Element | Eis |
|---|---|
| Hoofdfoto en galerij | Door de eigen retouche-pijplijn: andere achtergrond, andere uitsnede, andere schaduw |
| Beschrijving | **Herschrijven, niet herformuleren.** Andere opbouw, andere openingszin, eigen pasvorm- en materiaaltaal. Een gesynonimiseerde alinea telt niet |
| Titel | Mag afwijken; blijft beschrijvend, geen promotekst |
| Handle en SKU | Eigen conventie, dus per definitie anders |

**Wat níét mag:** het product zó anders beschrijven dat het niet meer klopt met wat
er in de doos zit. Onderscheidend zijn is het doel, misrepresentatie is de grens.

---

## 6. Afronding per product

- [ ] HTML-wipe gedaan vóór het opbouwen van de beschrijving
- [ ] Geen externe media, geen `<style>` van de bron, geen `<a>` zonder `href`
- [ ] Edited-angle-oordeel gegeven: N.V.T. / SCHOON / VERDACHT
- [ ] Kleurbeelden aan hun variant gekoppeld
- [ ] Foto's visueel gecontroleerd op merktekens, crops en stijlbreuk
- [ ] Retouche gedraaid waar nodig, op de vaste resolutie
- [ ] Alt-tekst op élk medium
- [ ] Attributen, maten, SKU's, handle, `productType`, spelling
- [ ] Claims gestript en vervangen door de waarden uit `store.yml`
- [ ] Bij overlap met de bronwinkel: foto én tekst aantoonbaar anders
- [ ] **Stale-reference-scan over het hele product**, niet alleen het veld dat je
      aanpaste
- [ ] Redirect aangemaakt als er een handle is gewijzigd
- [ ] Pas daarna op ACTIVE

Draai daarna `scripts/gmc-audit/audit.mjs` over de winkel: die vangt wat een
handmatige ronde structureel mist — claims die ergens anders nog blijven staan,
triggerwoorden, en beleidsteksten die op de pagina en in de checkout uit elkaar zijn
gelopen.
