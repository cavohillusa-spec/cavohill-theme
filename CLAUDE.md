# Harbor Hudson — Thema-brief

## Project
Custom Shopify-thema voor Harbor Hudson, een fashion-webshop (Google dropshipping), gebouwd op de gratis Dawn-basis. Doelgroep: 50+. Stijl: clean en elegant, zoals Zara maar warmer en rustiger. Niet new-school, niet hyperig.

## Belangrijkste regel
ALLES moet mobiel-first zijn. Eerst mobiel perfect, dan pas desktop. Dit is de hoogste prioriteit.

## Kleuren
- Warm bruin `#40260C` — knoppen, footer, accenten
- Creme `#FAF6F0` — rustige secties
- Wit `#FFFFFF` — hoofd-achtergrond
- Inkt `#1A1A1A` — tekst (hoog contrast)
- Gedempt `#6B6257` — secundaire tekst
- Announcement-balk `#F6EDCF`
- Sale-groen `#1E7A5A` — saleprijs
- Oud-prijs rood `#B23A2E` — doorgestreepte prijs

## Fonts
- Koppen: Playfair Display
- Body: Assistant
- Body-tekst 17px voor goede leesbaarheid (50+), ruime regelafstand

## Stijlprincipes
- Producttitel altijd zwart
- Veel witruimte, hoog contrast, gedempte kleuren
- Geen felle tinten, geen drukke effecten; rust en leesbaarheid voorop

## Werkwijze
- Werk sectie voor sectie, netjes en simpel
- Leg kort in het Nederlands uit wat je doet, zodat ik het leer

## GMC-bedrijfsgegevens (NAP) — per store invullen
Dit is een all-round basisthema: de GMC-vereiste bedrijfsgegevens (naam, adres, telefoon, e-mail, uren, reactietijd, registratienummer) staan **leeg** in het thema en worden per store ingevuld via:

**Theme Settings > Company / GMC info (NAP)**

Eén bron, overal consistent (NAP-consistentie is zelf een GMC-vereiste):
- **Footer** (`sections/hh-footer.liquid`) rendert het automatisch via `snippets/nap-block.liquid`.
- **About us**: wijs de Shopify-pagina toe aan het template `page.about-us` (Admin > Pages > About us > Theme template). Toont pagina-content + het NAP-blok onderaan.
- **Contact**: `templates/page.contact.json` toont het formulier + het NAP-blok eronder (dekt ook "reactietijd vermeld").
- Overal elders: voeg de sectie **"Company / GMC info (NAP)"** toe via de theme-editor.
- **Structured data**: `snippets/organization-schema.liquid` zendt automatisch Organization/PostalAddress JSON-LD uit zodra naam + straat zijn ingevuld (uit te zetten via de toggle in dezelfde instellingen-groep).

Leeg veld = nergens getoond, geen placeholders op de live site. Vul minimaal naam + straat/plaats/land + e-mail + telefoon in vóór je een store indient voor GMC-review.
