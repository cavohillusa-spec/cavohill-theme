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
