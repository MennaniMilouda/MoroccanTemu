import type { ArtType, Category, CategoryId, Product, Seller } from '../types'

export const CATEGORIES: Category[] = [
  { id: 'mode', name: 'Mode', art: 'caftan', hue: 340 },
  { id: 'accessoires', name: 'Accessoires', art: 'bag', hue: 28 },
  { id: 'maison', name: 'Maison', art: 'teapot', hue: 200 },
  { id: 'beaute', name: 'Beauté', art: 'bottle', hue: 36 },
  { id: 'electronique', name: 'Électronique', art: 'headphones', hue: 232 },
  { id: 'decoration', name: 'Décoration', art: 'lantern', hue: 42 },
]

export const CATEGORY = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CategoryId, Category>

/** Illustration used when a product is created without a specific visual. */
export const CATEGORY_ART: Record<CategoryId, ArtType> = {
  mode: 'textile',
  accessoires: 'bag',
  maison: 'jar',
  beaute: 'bottle',
  electronique: 'speaker',
  decoration: 'cushion',
}

export const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Safi', 'El Jadida']

export const MY_SELLER_ID = 'nour'

export const SELLERS: Record<string, Seller> = {
  fes: { id: 'fes', name: 'Atelier Fès Cuir', city: 'Fès', rating: 4.8, since: 2019, responseTime: '< 2 h', hue: 28 },
  argan: { id: 'argan', name: 'Dar Argan Souss', city: 'Agadir', rating: 4.9, since: 2020, responseTime: '< 1 h', hue: 38 },
  tech: { id: 'tech', name: 'Tanger Tech Store', city: 'Tanger', rating: 4.6, since: 2021, responseTime: '< 3 h', hue: 232 },
  casa: { id: 'casa', name: 'Casa Mode Studio', city: 'Casablanca', rating: 4.7, since: 2018, responseTime: '< 2 h', hue: 340 },
  zellige: { id: 'zellige', name: 'Maison Zellige', city: 'Marrakech', rating: 4.9, since: 2017, responseTime: '< 1 h', hue: 165 },
  safi: { id: 'safi', name: 'Poterie de Safi', city: 'Safi', rating: 4.7, since: 2022, responseTime: '< 4 h', hue: 200 },
  rabat: { id: 'rabat', name: 'Rabat Concept', city: 'Rabat', rating: 4.8, since: 2020, responseTime: '< 2 h', hue: 15 },
  nour: { id: 'nour', name: 'Atelier Nour', city: 'Marrakech', rating: 4.9, since: 2023, responseTime: '< 1 h', hue: 250 },
}

/** Color variants offered per category: [label, hue]. */
export const COLORS: Partial<Record<CategoryId, [string, number][]>> = {
  mode: [['Grenat', 345], ['Émeraude', 155], ['Bleu nuit', 228]],
  accessoires: [['Camel', 28], ['Cognac', 14], ['Olive', 80]],
  maison: [['Classique', 200], ['Turquoise', 180], ['Safran', 40]],
  decoration: [['Laiton', 42], ['Indigo', 232], ['Terre', 15]],
  electronique: [['Bleu', 232], ['Graphite', 220], ['Sable', 36]],
}

export const SPECS: Record<CategoryId, [string, string][]> = {
  mode: [['Matière', 'Tissu naturel, selon modèle'], ['Fabrication', 'Maroc, atelier partenaire'], ['Entretien', 'Lavage à la main conseillé']],
  accessoires: [['Fabrication', 'Maroc'], ['Garantie', '6 mois'], ['Emballage', 'Pochette cadeau offerte']],
  maison: [['Fabrication', 'Artisanat marocain'], ['Contact alimentaire', 'Oui'], ['Entretien', 'Lavage à la main']],
  beaute: [['Origine', 'Maroc'], ['Conservation', 'Au sec, à l’abri de la lumière'], ['Certification', 'Bio ou naturel selon produit']],
  electronique: [['Garantie', '12 mois au Maroc'], ['Câble', 'USB-C inclus'], ['Service après-vente', 'Tanger, Casablanca']],
  decoration: [['Fabrication', 'Fait main au Maroc'], ['Pièce', 'Légères variations possibles'], ['Emballage', 'Protégé pour le transport']],
}

export const REVIEWS: [string, string, number, string][] = [
  ['Salma', 'Casablanca', 5, 'Conforme aux photos, bien emballé. Livré en 2 jours.'],
  ['Youssef', 'Rabat', 4, 'Bonne qualité pour le prix. Le livreur a appelé avant de passer.'],
  ['Imane', 'Tanger', 5, 'Deuxième commande chez ce vendeur, toujours aussi sérieux.'],
  ['Karim', 'Marrakech', 5, 'Très beau travail, on sent que c’est fait main.'],
]

type Row = [string, string, CategoryId, number, number | null, ArtType, number, string, number, number, number, Product['tags'], string, string[]?]

const ROWS: Row[] = [
  ['p1', 'Caftan en satin brodé main', 'mode', 890, 1290, 'caftan', 345, 'casa', 4.8, 312, 1240, { trend: true }, 'Caftan fluide en satin duchesse, broderie sfifa faite main sur le plastron et les manches. Coupé à Casablanca, idéal pour les fêtes et les mariages.', ['S', 'M', 'L', 'XL']],
  ['p2', 'Djellaba en lin légère', 'mode', 459, 590, 'caftan', 32, 'rabat', 4.7, 118, 560, { new: true }, 'Djellaba en lin lavé, capuche traditionnelle et boutons en passementerie. Respirante pour l’été.', ['S', 'M', 'L', 'XL']],
  ['p3', 'Babouches brodées en cuir', 'mode', 179, 260, 'babouche', 42, 'fes', 4.9, 904, 3820, { trend: true, flash: true }, 'Babouches en cuir de chèvre tanné à Fès, broderie au fil de soie. Semelle cousue, confortables dès le premier jour.', ['37', '38', '39', '40', '41', '42']],
  ['p4', 'Foulard en soie de Fès', 'mode', 149, 220, 'textile', 330, 'fes', 4.6, 201, 780, { new: true }, 'Foulard tissé sur métier traditionnel, finitions à franges. 180 × 70 cm.'],
  ['p5', 'Fouta de plage tissée main', 'mode', 119, 160, 'textile', 190, 'rabat', 4.7, 356, 1490, { flash: true }, 'Fouta en coton tissé à Chefchaouen. Légère, absorbante, sèche vite. 100 × 180 cm.'],
  ['p6', 'Sac seau en cuir camel', 'accessoires', 390, 590, 'bag', 28, 'fes', 4.8, 486, 2105, { trend: true, flash: true }, 'Sac seau en cuir pleine fleur, doublure en coton, fermeture aimantée. Cousu main dans la médina de Fès.'],
  ['p7', 'Boucles d’oreilles amazighes dorées', 'accessoires', 129, 199, 'earrings', 10, 'zellige', 4.9, 640, 2870, { trend: true }, 'Laiton doré à l’or fin et pierres colorées, inspirées des bijoux de l’Anti-Atlas.'],
  ['p8', 'Lunettes de soleil polarisées', 'accessoires', 199, 299, 'sunglasses', 20, 'casa', 4.5, 233, 1320, { new: true }, 'Verres polarisés UV400, monture en acétate. Étui et chiffonnette inclus.'],
  ['p9', 'Pochette en raphia brodée', 'accessoires', 159, null, 'bag', 45, 'zellige', 4.7, 98, 410, { new: true }, 'Pochette en raphia tressé, pompons en laine, fermeture zippée.'],
  ['p10', 'Montre classique bracelet cuir', 'accessoires', 349, 499, 'watch', 25, 'casa', 4.6, 174, 690, {}, 'Mouvement quartz, verre minéral, étanche 3 ATM. Bracelet en cuir interchangeable.'],
  ['p11', 'Théière berrad en métal argenté', 'maison', 249, 349, 'teapot', 205, 'zellige', 4.9, 1210, 5300, { trend: true }, 'Théière traditionnelle ciselée à la main, 1 litre. Le cadeau qui fait toujours plaisir.'],
  ['p12', 'Tajine en terre cuite peint', 'maison', 189, 249, 'tajine', 18, 'safi', 4.7, 422, 1610, { flash: true }, 'Tajine de cuisson et de service, émaillé à l’intérieur. Diamètre 30 cm.'],
  ['p13', 'Service de 6 verres beldi', 'maison', 139, null, 'teaglass', 12, 'zellige', 4.8, 530, 2460, {}, 'Verres à thé en verre soufflé, décor doré. Lavage à la main conseillé.'],
  ['p14', 'Panier en osier à pompons', 'maison', 169, 230, 'basket', 330, 'rabat', 4.6, 140, 520, { new: true }, 'Panier tressé en feuilles de palmier doum, anses en cuir, pompons en laine.'],
  ['p15', 'Assiette de Safi peinte main', 'maison', 99, 140, 'plate', 205, 'safi', 4.8, 288, 1120, {}, 'Céramique de Safi, motif étoile peint au pinceau. Diamètre 28 cm.'],
  ['p16', 'Huile d’argan pure bio 100 ml', 'beaute', 120, 180, 'bottle', 36, 'argan', 4.9, 2140, 9800, { trend: true, flash: true }, 'Huile d’argan pressée à froid par une coopérative féminine de la région d’Agadir. Certifiée bio.'],
  ['p17', 'Savon noir à l’eucalyptus', 'beaute', 59, 79, 'jar', 120, 'argan', 4.8, 980, 4300, {}, 'Savon noir beldi à l’huile d’olive et à l’eucalyptus, pour le hammam. Pot de 250 g.'],
  ['p18', 'Ghassoul de l’Atlas 250 g', 'beaute', 49, null, 'jar', 22, 'argan', 4.7, 412, 1980, { new: true }, 'Argile naturelle du Moyen Atlas, pour masque visage et soin des cheveux.'],
  ['p19', 'Eau de rose de Kelâa M’Gouna', 'beaute', 69, 95, 'bottle', 345, 'argan', 4.8, 760, 3510, { trend: true }, 'Eau florale distillée à partir des roses de la vallée du Dadès. 200 ml.'],
  ['p20', 'Écouteurs sans fil à réduction de bruit', 'electronique', 449, 699, 'headphones', 232, 'tech', 4.6, 1530, 6120, { trend: true, flash: true }, 'Réduction de bruit active, 30 h d’autonomie, charge rapide USB-C. Garantie 1 an au Maroc.'],
  ['p21', 'Montre connectée sport', 'electronique', 399, 599, 'smartwatch', 258, 'tech', 4.5, 890, 3400, { new: true }, 'Suivi du sommeil, fréquence cardiaque, GPS intégré. Écran AMOLED.'],
  ['p22', 'Enceinte Bluetooth étanche', 'electronique', 279, 390, 'speaker', 190, 'tech', 4.6, 610, 2210, {}, 'Son 360°, étanche IPX7, 12 h d’autonomie.'],
  ['p23', 'Smartphone 128 Go reconditionné', 'electronique', 1990, 2490, 'phone', 252, 'tech', 4.4, 310, 840, { trend: true }, 'Reconditionné et testé à Tanger, batterie > 90 %. Garantie 12 mois, chargeur inclus.'],
  ['p24', 'Coque smartphone motif zellige', 'electronique', 79, 120, 'phonecase', 165, 'casa', 4.7, 420, 2990, { new: true }, 'Coque antichoc en silicone, motif étoile zellige.'],
  ['p25', 'Lanterne en laiton ciselé', 'decoration', 450, 620, 'lantern', 42, 'zellige', 4.9, 388, 1270, { trend: true }, 'Lanterne ajourée à la main à Marrakech, jeux d’ombres étoilées. Hauteur 45 cm.'],
  ['p26', 'Tapis Beni Ouarain 120 × 180', 'decoration', 1490, 1990, 'rug', 30, 'zellige', 4.9, 172, 410, { trend: true }, 'Tapis en laine noué main dans le Moyen Atlas, motif losanges. Pièce unique.'],
  ['p27', 'Miroir arche en bois sculpté', 'decoration', 590, 790, 'mirror', 35, 'rabat', 4.7, 96, 260, { new: true }, 'Miroir en bois de cèdre, cloutage en laiton. 60 × 90 cm.'],
  ['p28', 'Pouf en cuir brodé', 'decoration', 520, 690, 'pouf', 25, 'fes', 4.8, 304, 1180, { flash: true }, 'Pouf en cuir de chèvre, broderie au fil de soie. Livré non rembourré, diamètre 50 cm.'],
  ['p29', 'Coussin berbère tissé', 'decoration', 159, 220, 'cushion', 15, 'rabat', 4.6, 210, 880, { new: true }, 'Housse de coussin en laine et coton tissée main. 45 × 45 cm.'],
  ['p30', 'Bougie parfumée fleur d’oranger', 'decoration', 89, null, 'candle', 35, 'rabat', 4.7, 245, 1340, { new: true }, 'Cire végétale, parfum fleur d’oranger et néroli. 40 h de combustion.'],
]

export const PRODUCTS: Product[] = ROWS.map(([id, name, category, price, oldPrice, art, hue, sellerId, rating, reviews, sold, tags, description, sizes]) => ({
  id, name, category, price, oldPrice, art, hue, sellerId, rating, reviews, sold, tags, description, sizes,
}))
