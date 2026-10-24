# Dukan : contexte du projet

Document de référence à donner à Claude (instructions ou connaissances d’un projet claude.ai, ou `CLAUDE.md` dans le code). Les lignes marquées **[à confirmer]** sont des hypothèses de travail, pas des décisions.

## En une phrase

Dukan est une marketplace marocaine, inspirée de Temu sans la copier, où les vendeurs marocains présentent leurs produits et où les acheteurs les découvrent, les comparent et les commandent.

## Ce qui rend Dukan différent

Beaucoup de vendeurs marocains vendent déjà sur Instagram (et WhatsApp), avec des prix « en DM ». Dukan leur permet d’**importer leurs produits depuis leur compte Instagram** ou depuis un fichier, au lieu de tout ressaisir. Le vendeur colle le lien de son compte, Dukan détecte photos, noms et prix, le vendeur vérifie puis publie.

## Le marché

- **Pays** : Maroc. Villes prioritaires : Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir.
- **Langues** : français pour l’interface ; darija et arabe à prévoir **[à confirmer]**.
- **Monnaie** : dirham marocain, écrit « DH » (ex. 1 290 DH).
- **Paiement** : surtout **paiement à la livraison** (espèces). La carte bancaire vient plus tard.
- **Habitudes** : achat depuis le téléphone, confiance construite par les avis, le contact direct avec le vendeur et la possibilité de payer en recevant.

## Les deux publics

**Acheteurs**
- 18–40 ans, urbains, sur mobile, sensibles au prix et aux promotions **[à confirmer]**.
- Attentes : prix bas et visibles, délais de livraison clairs, retours simples, vendeurs fiables.

**Vendeurs**
- Artisans, petites boutiques et revendeurs, souvent déjà actifs sur Instagram.
- Douleurs : temps passé à répondre aux DM, catalogue éparpillé, pas de boutique en ligne, gestion du stock à la main.
- Attentes : mise en ligne rapide, commandes centralisées, visibilité au-delà de leurs abonnés.

## Catégories

Mode, accessoires, maison, beauté, électronique, décoration. Points forts locaux : artisanat (cuir de Fès, céramique de Safi, lanternes de Marrakech), cosmétique naturelle (argan, ghassoul, savon noir).

## Modèle économique **[à confirmer]**

Pistes : commission sur chaque vente, abonnement vendeur pour plus de visibilité, mise en avant payante (ventes flash, tendances), frais de livraison.

## Concurrents et alternatives

- Vente directe sur Instagram, Facebook et WhatsApp (l’alternative principale des vendeurs).
- Marketplaces présentes au Maroc : Jumia, Avito (petites annonces).
- Plateformes internationales à bas prix : Temu, AliExpress, Shein.

## Identité de marque

- **Nom** : Dukan (« boutique » en darija).
- **Couleurs** : bleu Majorelle (actions), safran (promotions, mises en avant), fond neutre légèrement bleuté.
- **Typographies** : Bricolage Grotesque (titres), Figtree (texte).
- **Ton** : simple, chaleureux, direct, jamais condescendant. On écrit comme on parle à un client en boutique.
- **Motif** : étoile à huit branches inspirée du zellige.

## Où en est le projet

- Un **prototype frontend** existe (React, TypeScript, Tailwind) : https://github.com/MennaniMilouda/MoroccanTemu
- Acheteur : accueil, catalogue avec filtres, fiche produit, panier, commande avec paiement à la livraison.
- Vendeur : tableau de bord, gestion des produits (prix, stock, publication), import depuis Instagram ou un fichier CSV.
- **Tout est simulé** : données fictives, aucun backend, aucune connexion réelle à Instagram, aucun paiement.
- Phase actuelle : **brainstorming et tests utilisateurs** pour valider le concept.

## Questions encore ouvertes

1. Combien Dukan prend-il sur chaque vente, et qui paie la livraison ?
2. Qui livre : un partenaire (Amana, transporteurs locaux) ou les vendeurs eux-mêmes ?
3. Comment vérifier les vendeurs (identité, registre de commerce, auto-entrepreneur) ?
4. Comment importer réellement depuis Instagram (API Instagram Graph, comptes professionnels uniquement) ?
5. Faut-il commencer par une niche (artisanat, beauté) ou rester généraliste ?

## Comment Claude doit travailler sur ce projet

- Répondre en français, utiliser les DH et des exemples marocains.
- Distinguer clairement ce qui est **vérifié** de ce qui est **hypothèse**.
- Pour les chiffres de marché, citer une source ou dire que le chiffre est à vérifier.
- Penser aux deux publics à la fois : une décision pour les acheteurs a souvent un effet sur les vendeurs.
- Rester concret : proposer des actions testables rapidement plutôt que des plans abstraits.
