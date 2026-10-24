# Dukan

Prototype frontend d’une marketplace marocaine. Les vendeurs y présentent leurs produits, les acheteurs les découvrent, les comparent et les commandent. Le point fort du concept : un vendeur importe son catalogue depuis son compte Instagram ou un fichier, au lieu de tout ressaisir.

> **Prototype.** Toutes les données sont fictives. Il n’y a ni backend, ni paiement, ni livraison réelle, ni connexion à Instagram : l’analyse d’un compte est simulée.

## Lancer le projet

Node 20 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # vérifie les types puis génère dist/
npm run preview    # sert la version générée
```

## Parcours disponibles

| Espace | Page | URL |
| --- | --- | --- |
| Acheteur | Accueil | `/` |
| | Catalogue, recherche, filtres, tri | `/catalogue` |
| | Fiche produit | `/produit/:id` |
| | Panier | `/panier` |
| | Commande, puis confirmation | `/commande` |
| Vendeur | Tableau de bord | `/vendeur` |
| | Gestion des produits | `/vendeur/produits?onglet=brouillons` |
| | Import Instagram ou fichier | `/vendeur/importer?methode=instagram` |

Les filtres du catalogue sont dans l’URL : un lien comme `/catalogue?cat=beaute&max=100` peut être partagé.

Pour tester l’import Instagram :

- `instagram.com/atelier.nour` (ou tout autre nom de compte) : des produits sont « détectés » ;
- un nom contenant `vide` : aucun produit trouvé ;
- `facebook.com/…` ou un lien de publication : message d’erreur.

L’import par fichier lit un vrai CSV (`nom;prix;categorie;stock`). Un fichier d’exemple est proposé dans la page.

Les changements (panier, commandes, produits du vendeur) sont gardés dans le `localStorage` du navigateur. Le lien « Réinitialiser le prototype », en bas de page, remet tout à zéro.

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com), avec les couleurs définies comme variables CSS dans `src/index.css` (mode sombre automatique)
- [React Router 7](https://reactrouter.com) pour la navigation
- [Zustand](https://zustand.docs.pmnd.rs) pour l’état, persisté dans le navigateur
- [Lucide](https://lucide.dev) pour les icônes

## Organisation du code

```
src/
  data/          données fictives : catalogue, vendeurs, commandes, publications Instagram
  lib/           fonctions pures : prix en DH, délais de livraison, lecture CSV, analyse simulée d’Instagram
  store/         état global (panier, produits du vendeur, commandes, notifications)
  components/
    ui/          boutons, champs, fenêtres, notifications…
    layout/      en-têtes, pied de page, navigation mobile
    seller/      fenêtres de l’espace vendeur (méthodes d’import, fiche produit)
    ProductCard.tsx, ProductImage.tsx
  pages/
    buyer/       accueil, catalogue, fiche produit, panier, commande
    seller/      tableau de bord, produits, import
```

## Images produits

Le prototype n’utilise pas de photos : chaque produit est une illustration SVG générée (`src/lib/art.ts`), avec une couleur par variante. Pour passer à de vraies photos, renseignez le champ `image` d’un produit (URL) : `ProductImage` l’affiche à la place de l’illustration.

## Brancher un vrai backend plus tard

Les points d’entrée à remplacer sont isolés :

- `src/data/*` → appels à une API catalogue ;
- `src/lib/instagram.ts` → `simulateInstagramAnalysis` deviendrait un appel à l’API Instagram Graph (compte professionnel requis) ;
- `src/store/shop.ts` → les actions (`placeOrder`, `addSellerProducts`…) appelleraient l’API au lieu de modifier l’état local.
