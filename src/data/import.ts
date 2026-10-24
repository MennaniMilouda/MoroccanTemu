import type { ImportCandidate } from '../types'

/** Fictional Instagram posts the simulated analysis "detects". Captions may contain <b> highlights. */
export const INSTAGRAM_POOL: Omit<ImportCandidate, 'selected'>[] = [
  { name: 'Sac seau en cuir camel', price: 390, category: 'accessoires', art: 'bag', hue: 28, caption: 'Nouveau ✨ Sac seau en cuir camel, cousu main. <b>390dh</b>, livraison partout au Maroc. DM pour commander', likes: 412, priceSource: 'caption' },
  { name: 'Babouches brodées', price: 180, category: 'mode', art: 'babouche', hue: 42, caption: 'Nos babouches brodées sont de retour, pointures 37 à 41. Prix en DM', likes: 268, priceSource: 'estimated' },
  { name: 'Coussin berbère', price: 220, category: 'decoration', art: 'cushion', hue: 15, caption: 'Coussins tissés main dans l’Atlas, 45×45. <b>220 DH</b> la housse', likes: 189, priceSource: 'caption' },
  { name: 'Lanterne en laiton', price: 450, category: 'decoration', art: 'lantern', hue: 42, caption: 'Le soir dans l’atelier… Lanterne laiton ciselé <b>450dh</b> 🌙', likes: 534, priceSource: 'caption' },
  { name: 'Caftan satin vert', price: 890, category: 'mode', art: 'caftan', hue: 155, caption: 'Caftan satin émeraude, broderie sfifa. Sur commande, toutes tailles. <b>890 dh</b>', likes: 877, priceSource: 'caption' },
  { name: 'Huile d’argan 100 ml', price: 120, category: 'beaute', art: 'bottle', hue: 36, caption: 'Huile d’argan pure de notre coopérative. Disponible en 50 et 100 ml', likes: 156, priceSource: 'estimated' },
  { name: 'Tapis berbère mini', price: 1200, category: 'decoration', art: 'rug', hue: 30, caption: 'Petit tapis Beni Ouarain 80×120, pièce unique. <b>1200dh</b> à saisir', likes: 620, priceSource: 'caption' },
  { name: 'Boucles d’oreilles dorées', price: 95, category: 'accessoires', art: 'earrings', hue: 350, caption: 'Boucles amazighes revisitées, plusieurs couleurs. <b>95dh</b> la paire', likes: 301, priceSource: 'caption' },
  { name: 'Bougie fleur d’oranger', price: 85, category: 'decoration', art: 'candle', hue: 35, caption: 'Bougie parfumée fleur d’oranger, coulée à la main. Prix spécial ce mois-ci', likes: 144, priceSource: 'estimated' },
  { name: 'Théière ciselée', price: 260, category: 'maison', art: 'teapot', hue: 205, caption: 'Théière ciselée 1 L, idéale pour offrir. <b>260 dh</b>', likes: 233, priceSource: 'caption' },
]

export const SAMPLE_CSV = `nom;prix;categorie;stock
Plateau en cuivre gravé;290;maison;6
Coussin en lin brodé;175;decoration;12
Sac cabas en palmier;140;accessoires;20
Savon à l'huile d'olive;45;beaute;40
Écharpe en laine tissée;210;mode;8`
