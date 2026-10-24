import type { SellerOrder, SellerProduct } from '../types'

export const SEED_SELLER_PRODUCTS: SellerProduct[] = [
  { id: 'n1', name: 'Lanterne murale ajourée', category: 'decoration', price: 380, oldPrice: 450, art: 'lantern', hue: 48, stock: 12, status: 'published', source: 'manuel', description: 'Lanterne murale en métal ajouré, peinte à la main dans notre atelier de Marrakech.' },
  { id: 'n2', name: 'Coussin kilim 45 × 45', category: 'decoration', price: 190, art: 'cushion', hue: 350, stock: 7, status: 'published', source: 'manuel', description: 'Housse en kilim recyclé, chaque pièce est unique.' },
  { id: 'n3', name: 'Panier à pain en doum', category: 'maison', price: 95, art: 'basket', hue: 40, stock: 0, status: 'published', source: 'instagram', description: 'Corbeille tressée en feuilles de palmier doum.' },
  { id: 'n4', name: 'Miroir rond cadre zellige', category: 'decoration', price: 520, oldPrice: 640, art: 'mirror', hue: 168, stock: 4, status: 'published', source: 'manuel', description: 'Miroir rond, cadre en mosaïque zellige posée à la main.' },
  { id: 'n5', name: 'Plateau en cuivre martelé', category: 'maison', price: 260, art: 'plate', hue: 28, stock: 9, status: 'published', source: 'fichier', description: 'Plateau à thé en cuivre martelé, diamètre 40 cm.' },
  { id: 'n6', name: 'Bougeoir en verre teinté', category: 'decoration', price: 120, art: 'candle', hue: 200, stock: 15, status: 'draft', source: 'manuel', description: 'Photophore en verre soufflé teinté.' },
  { id: 'n7', name: 'Pouf en kilim', category: 'decoration', price: 480, art: 'pouf', hue: 350, stock: 3, status: 'draft', source: 'instagram', description: 'Pouf en kilim et cuir, livré non rembourré.' },
]

export const SEED_ORDERS: SellerOrder[] = [
  { no: 'DK-48213', customer: 'Salma B.', city: 'Casablanca', item: 'Lanterne murale ajourée', total: 380, status: 'À préparer', date: 'Aujourd’hui' },
  { no: 'DK-48190', customer: 'Mehdi A.', city: 'Rabat', item: 'Coussin kilim 45 × 45 (×2)', total: 380, status: 'À préparer', date: 'Aujourd’hui' },
  { no: 'DK-48102', customer: 'Hiba E.', city: 'Tanger', item: 'Miroir rond cadre zellige', total: 520, status: 'Expédiée', date: 'Hier' },
  { no: 'DK-47988', customer: 'Omar T.', city: 'Fès', item: 'Plateau en cuivre martelé', total: 260, status: 'Expédiée', date: '22 oct.' },
  { no: 'DK-47851', customer: 'Nadia K.', city: 'Agadir', item: 'Lanterne murale ajourée', total: 380, status: 'Livrée', date: '21 oct.' },
  { no: 'DK-47790', customer: 'Rachid L.', city: 'Marrakech', item: 'Panier à pain en doum (×3)', total: 285, status: 'Livrée', date: '20 oct.' },
]

/** Daily sales in DH over the last 30 days (fictional). */
export const SALES_30_DAYS = [420, 610, 380, 760, 890, 540, 1220, 980, 640, 720, 1100, 870, 560, 930, 1480, 1320, 700, 820, 1050, 1390, 980, 760, 1240, 1610, 1180, 940, 1350, 1720, 1460, 1280]
