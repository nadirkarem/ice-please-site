# Ice Please, maquette du site (FR / EN / AR)

Aperçu en ligne : **https://nadirkarem.github.io/ice-please-site/**

Maquette de refonte du site d'Ice Please Morocco (FAAB & CO), glaçons premium et clear ice pour les professionnels de la boisson. Ce n'est pas le site officiel : les textes reprennent le site actuel, les visuels de synthèse (vidéo, sphère dans un verre de whisky) sont des illustrations, et la page est en `noindex`.

Site statique en HTML, CSS et JavaScript, construit avec [Vite](https://vite.dev). Aucun framework, aucune base de données. Français à la racine, anglais sous `/en/`, arabe sous `/ar/` (mise en page inversée).

## Lancer en local

```bash
npm install --legacy-peer-deps
npm run dev      # http://127.0.0.1:5190
npm run build    # génère dist/ (42 pages)
```

Pour tester la construction sous un sous-dossier, comme sur GitHub Pages :

```bash
BASE_PATH=/ice-please-site npm run build
BASE_PATH=/ice-please-site npx vite preview
```

## Où modifier quoi

| Pour changer… | Fichier |
|---|---|
| un texte (FR, EN, AR) | `content/fr.json`, `content/en.json`, `content/ar.json` (mêmes clés) |
| téléphone, e-mail, Instagram, indexation | `content/site.json` |
| la structure d'une page | `scripts/lib/pages.mjs` |
| l'en-tête, le pied de page, le `<head>` | `scripts/lib/layout.mjs` |
| les adresses des pages | `scripts/lib/routes.mjs` |
| le design | `src/style.css` |
| le comportement (menu, transitions de page, givre, récit, formulaires) | `src/main.js` |

## Mise en ligne

Chaque envoi sur la branche `main` reconstruit le site et le publie sur GitHub Pages (`.github/workflows/pages.yml`).
