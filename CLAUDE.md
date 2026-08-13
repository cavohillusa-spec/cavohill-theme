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
- Verwijderd: het "Summer Sale Bundles"-blok (fake-urgency-copy: "one day only", "stock is limited"), de "LIMITED SUMMER SALE"-badge, de ongeconfigureerde bundelkorting-claim ("Buy 2 get 10%..."), en overclaims als "24/7"/"5 STAR" support zonder onderbouwing.

Check bij het inrichten van een nieuwe store altijd of promotietaal/kortingsclaims/urgentie ook daadwerkelijk klopt (echte einddatum, echte voorraadlimiet, echt geconfigureerde korting) — zie het GMC self-approval handvat voor de volledige achtergrond.

## Nieuwe store opzetten
1. Fork/dupliceer deze repo naar een eigen repo per store (Shopify's GitHub-koppeling is 1 repo/branch ↔ 1 store — deze basis kan niet direct aan meerdere stores tegelijk gekoppeld worden).
2. Verbind die nieuwe repo aan de Shopify-admin van de store (Online Store > Themes > Add theme > Connect from GitHub).
3. Vul Theme Settings > Company / GMC info (NAP) in.
4. Pas kleuren/fonts/stijl aan via Theme Settings, en documenteer die keuzes in een eigen `CLAUDE.md`-brief in de store-repo (zie archief hieronder voor het format).
5. Trek later verbeteringen uit deze basisrepo handmatig in via een `upstream`-remote (zie README.md, sectie "Staying up to date with Dawn changes" — zelfde principe, nu toegepast op THEMA-BANG als eigen upstream).

---

## Archief — Harbor Hudson merkbrief (voorbeeld, niet actief hier)
Deze store-specifieke brief stond eerder in dit bestand. Bewaard als voorbeeld/referentie voor het format van een store-`CLAUDE.md`; hoort thuis in Harbor Hudson's eigen repo, niet in deze gedeelde basis.

> ### Harbor Hudson — Thema-brief
> **Project:** Custom Shopify-thema voor Harbor Hudson, een fashion-webshop (Google dropshipping). Doelgroep: 50+. Stijl: clean en elegant, zoals Zara maar warmer en rustiger. Niet new-school, niet hyperig.
>
> **Kleuren:**
> - Warm bruin `#40260C` — knoppen, footer, accenten
> - Creme `#FAF6F0` — rustige secties
> - Wit `#FFFFFF` — hoofd-achtergrond
> - Inkt `#1A1A1A` — tekst (hoog contrast)
> - Gedempt `#6B6257` — secundaire tekst
> - Announcement-balk `#F6EDCF`
> - Sale-groen `#1E7A5A` — saleprijs
> - Oud-prijs rood `#B23A2E` — doorgestreepte prijs
>
> **Fonts:**
> - Koppen: Playfair Display
> - Body: Assistant
> - Body-tekst 17px voor goede leesbaarheid (50+), ruime regelafstand
>
> **Stijlprincipes:**
> - Producttitel altijd zwart
> - Veel witruimte, hoog contrast, gedempte kleuren
> - Geen felle tinten, geen drukke effecten; rust en leesbaarheid voorop
