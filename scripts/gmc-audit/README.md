# GMC-audit

Vergelijkt het **voornemen** (`store.yml`) met de **werkelijkheid** (live
Shopify-config) en genereert een handvat-rapport.

```bash
export SHOPIFY_STORE_DOMAIN=xxx.myshopify.com
export SHOPIFY_ADMIN_TOKEN=shpat_...
node scripts/gmc-audit/audit.mjs pad/naar/store.yml > rapport.md
```

Het token hoort in je shell of een `.env` buiten de repo. **Nooit committen,
nooit in een chat plakken.**

## Waarom twee lagen

Op 13-08-2026 stond bevestigd dat Cavo Hill gratis verzending bood. Dat stond
ook zo op drie pagina's. En tóch rekende de checkout € 19,95 voor Amerikaanse
klanten, omdat de VS in een "International"-zone zat die niemand had bekeken.

Een bevestiging in een vragenlijst is dus geen bewijs. Elke claim wordt hier
tegen de live config gehouden:

| Claim in `store.yml` | Wordt vergeleken met |
|---|---|
| `shipping.cost_model: free_all` / `free_in_target` | actieve tarieven in alle verzendzones |
| `target_countries` | `shop.shipsToCountries` |
| `charges_sales_tax` | `shop.taxesIncluded` |
| `identity.email` / `phone` / `address` / `legal_name` | `shop.contactEmail`, `shopAddress.*` |
| `identity.phone` | élk telefoonnummer in élke paginatekst |
| `claims.*` op `false` | de bijbehorende zinnen in élke pagina- en policytekst |
| `commerce.returns.window_days` / `refund_processing_days` | de tekst van het retourbeleid |
| `pricing.compare_at_prices_active: false` | `compareAtPrice` op de varianten |

Het claims-blok werkt omgekeerd aan de rest: staat een belofte op `false`, dan
zoekt het script of die tóch ergens beloofd wordt. Zo blijft een claim niet
staan omdat niemand eraan dacht — precies hoe de Azië-tekst in de Terms
maandenlang overleefde.

Een claim die je leeg laat wordt "Handmatig controleren", nooit stilzwijgend
goedgekeurd.

Wijken voornemen en werkelijkheid af, dan is dat **Voldoet niet** — nooit
"handmatig controleren". Een mismatch is een feit, geen twijfelgeval.

## Categorie-guard

Het script weigert te draaien buiten de categorieën in `SUPPORTED_CATEGORIES`
(nu: `apparel`). Supplements, health, medical, financial en adult vallen onder
Google's restricted-products-beleid — een ander regime met eigen eisen rond
gezondheidsclaims, ingrediënten en certificering. Die punten zitten niet in deze
checklist.

Zonder guard zou het script daar een grotendeels groen rapport produceren, en
dat is gevaarlijker dan geen rapport.

## Twee checks die uit de praktijk komen

**Storefronttaal (punt 85).** Vergelijkt de primaire taal uit `shopLocales` met de
taal die bij `commerce.target_countries` hoort, en controleert of die taal
gepubliceerd is.

Kijk hierbij níét naar `shopPolicies[].title`. De Admin API geeft die titels terug in
de taal van het **adminaccount**: een Nederlandse eigenaar ziet "Privacybeleid" en
`?locale=nl` in de URL, terwijl de storefront gewoon "Privacy policy" toont. Op
24-08-2026 is dat bijna als bevinding gerapporteerd voor een winkel waar niets aan de
hand was. `shopLocales` is de enige betrouwbare bron.

**Beleid op twee plekken (punt 92).** De footer linkt meestal `/pages/<handle>`, de
checkout linkt altijd `/policies/<type>`. Zolang die gelijk zijn is dat onschuldig;
bij de eerste tekstwijziging lopen ze uit elkaar. Precies dat gebeurde bij Cavo Hill:
de pagina kreeg het bestemmingsland erbij, de checkoutversie niet, omdat
`shopPolicyUpdate` de scope `write_legal_policies` vereist die de app niet had.

De check vergelijkt shipping, refund en terms zin voor zin, maar rapporteert alleen
zinnen die een **belofte** dragen — een getal, bedrag, termijn, "free", "return".
Een extra introzin op de pagina is dus geen bevinding; "free shipping on all orders"
tegenover "free shipping on all orders within the United States" wel.

## Triggerwoorden

`trigger-words.mjs` bevat de lijst uit handvat-punt 26, gesplitst in `blocker`
(editorial policy keurt af) en `warn` (kan kloppen, maar vraagt bewijs).

De scan kijkt alleen naar **klantzichtbare** strings: waarden van
`text`/`heading`/`title`/`content`/`label`/`default` in JSON-templates en in
`{% schema %}`-blokken. Niet naar de ruwe bron — anders levert een blok-ID als
`usp_guarantee` of een CSS-breedte van `100%` treffers op die nooit iemand ziet.

`100%` en `#1` worden alleen geflagd in combinatie met een claimwoord erachter,
om diezelfde reden.

## Wat het niet doet

Alles wat een oog of browser vereist: pagespeed, malware, mobiele bruikbaarheid,
beeldkwaliteit, of een About us-tekst persoonlijk genoeg is. Die punten blijven
handwerk en horen dat ook te blijven.

## Testen zonder store

De check-functies zijn los importeerbaar; `audit.mjs` voert niets uit als het
als module geladen wordt. Zo zijn de tweelagen-checks te testen tegen een mock
zonder een echte winkel aan te raken.
