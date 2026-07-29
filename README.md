# Pro Poli – výroční pixelová hra

Samostatná hra v čistém HTML, CSS a JavaScriptu. Funguje bez databáze a bez WordPressu, takže ji lze zdarma publikovat přes GitHub Pages.

## Co hra obsahuje

- pixelové postavy Mikuláša a Poli,
- heslo `2703`,
- výběr jednoho ze tří dárků,
- všechny dárky otevřou stejný dopis,
- animovanou obálku a milostné psaní,
- responzivní zobrazení na telefonu i počítači,
- volitelné drobné zvuky generované přímo prohlížečem.

## Úprava textu

Otevři soubor `assets/js/config.js`. Tam lze změnit:

- heslo,
- jména,
- celý text dopisu,
- podpis.

## Publikace na GitHub Pages

1. Na GitHubu vytvoř nový veřejný repozitář, například `pro-poli`.
2. Nahraj do něj celý obsah této složky tak, aby `index.html` byl přímo v kořeni repozitáře.
3. Otevři **Settings → Pages**.
4. V části **Build and deployment** vyber **Deploy from a branch**.
5. Vyber větev `main` a složku `/root`.
6. Po uložení bude stránka dostupná na adrese ve tvaru:

   `https://TVUJ-UCET.github.io/pro-poli/`

## Poznámka k heslu

Heslo je součástí JavaScriptu. Slouží jako romantický herní prvek, nikoli jako skutečné zabezpečení citlivého obsahu.
