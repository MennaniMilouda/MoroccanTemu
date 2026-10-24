export type CategoryId = 'mode' | 'accessoires' | 'maison' | 'beaute' | 'electronique' | 'decoration'

export type ArtType =
  | 'bag' | 'babouche' | 'caftan' | 'textile' | 'earrings' | 'sunglasses' | 'watch' | 'smartwatch'
  | 'phone' | 'phonecase' | 'headphones' | 'speaker' | 'teapot' | 'teaglass' | 'tajine' | 'plate'
  | 'basket' | 'bottle' | 'jar' | 'candle' | 'lantern' | 'rug' | 'mirror' | 'cushion' | 'pouf'

export interface Category {
  id: CategoryId
  name: string
  art: ArtType
  hue: number
}

export interface Seller {
  id: string
  name: string
  city: string
  rating: number
  since: number
  responseTime: string
  hue: number
}

/** Shared visual fields. `image` takes priority over the illustrated `art` once real photos exist. */
export interface Visual {
  art: ArtType
  hue: number
  image?: string
}

export interface Product extends Visual {
  id: string
  name: string
  category: CategoryId
  price: number
  oldPrice?: number | null
  sellerId: string
  rating?: number
  reviews?: number
  sold: number
  tags: { trend?: boolean; new?: boolean; flash?: boolean }
  description: string
  sizes?: string[]
  stock?: number
}

export type ProductStatus = 'draft' | 'published'
export type ProductSource = 'manuel' | 'instagram' | 'fichier'

export interface SellerProduct extends Visual {
  id: string
  name: string
  category: CategoryId
  price: number
  oldPrice?: number | null
  stock: number
  status: ProductStatus
  source: ProductSource
  description: string
}

export interface CartLine {
  key: string
  productId: string
  qty: number
  color?: string
  size?: string
  hue: number
}

export type OrderStatus = 'À préparer' | 'Expédiée' | 'Livrée'

export interface SellerOrder {
  no: string
  customer: string
  city: string
  item: string
  total: number
  status: OrderStatus
  date: string
  fromPrototype?: boolean
}

export interface PlacedOrder {
  no: string
  name: string
  phone: string
  address: string
  city: string
  express: boolean
  total: number
  lines: { name: string; price: number; qty: number; art: ArtType; hue: number; image?: string }[]
}

/** A product proposed by an import (Instagram or file) before the seller confirms it. */
export interface ImportCandidate extends Visual {
  name: string
  price: number
  category: CategoryId
  caption: string
  likes?: number
  priceSource: 'caption' | 'estimated'
  stock?: number
  selected: boolean
}
