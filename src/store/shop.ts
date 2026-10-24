import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MY_SELLER_ID, PRODUCTS } from '../data/catalog'
import { SEED_ORDERS, SEED_SELLER_PRODUCTS } from '../data/seller'
import type { CartLine, PlacedOrder, Product, SellerOrder, SellerProduct } from '../types'

interface ShopState {
  cart: CartLine[]
  favorites: string[]
  city: string
  sellerProducts: SellerProduct[]
  orders: SellerOrder[]
  lastOrder: PlacedOrder | null
  nextId: number

  addToCart: (line: Omit<CartLine, 'key'>) => void
  setQty: (key: string, qty: number) => void
  removeLine: (key: string) => CartLine | undefined
  restoreLine: (line: CartLine, index: number) => void
  clearCart: () => void
  toggleFavorite: (id: string) => boolean
  setCity: (city: string) => void

  addSellerProducts: (items: Omit<SellerProduct, 'id'>[]) => SellerProduct[]
  updateSellerProduct: (id: string, patch: Partial<SellerProduct>) => void
  setStatus: (ids: string[], status: SellerProduct['status']) => void
  deleteSellerProduct: (id: string) => void
  placeOrder: (order: PlacedOrder, sellerOrder: SellerOrder | null, stockUpdates: [string, number][]) => void
  reset: () => void
}

const initial = () => ({
  cart: [] as CartLine[],
  favorites: [] as string[],
  city: 'Casablanca',
  sellerProducts: structuredClone(SEED_SELLER_PRODUCTS),
  orders: structuredClone(SEED_ORDERS),
  lastOrder: null as PlacedOrder | null,
  nextId: 100,
})

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      ...initial(),

      addToCart: (line) => {
        const key = [line.productId, line.color ?? '', line.size ?? ''].join('|')
        set((s) => {
          const existing = s.cart.find((l) => l.key === key)
          return {
            cart: existing
              ? s.cart.map((l) => (l.key === key ? { ...l, qty: Math.min(10, l.qty + line.qty) } : l))
              : [...s.cart, { ...line, key }],
          }
        })
      },
      setQty: (key, qty) => set((s) => ({ cart: s.cart.map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(10, qty)) } : l)) })),
      removeLine: (key) => {
        const line = get().cart.find((l) => l.key === key)
        set((s) => ({ cart: s.cart.filter((l) => l.key !== key) }))
        return line
      },
      restoreLine: (line, index) => set((s) => {
        const cart = [...s.cart]
        cart.splice(index, 0, line)
        return { cart }
      }),
      clearCart: () => set({ cart: [] }),
      toggleFavorite: (id) => {
        const on = !get().favorites.includes(id)
        set((s) => ({ favorites: on ? [...s.favorites, id] : s.favorites.filter((f) => f !== id) }))
        return on
      },
      setCity: (city) => set({ city }),

      addSellerProducts: (items) => {
        let next = get().nextId
        const created = items.map((item) => ({ ...item, id: 'n' + next++ }))
        set((s) => ({ sellerProducts: [...created, ...s.sellerProducts], nextId: next }))
        return created
      },
      updateSellerProduct: (id, patch) => set((s) => ({ sellerProducts: s.sellerProducts.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      setStatus: (ids, status) => set((s) => ({ sellerProducts: s.sellerProducts.map((p) => (ids.includes(p.id) ? { ...p, status } : p)) })),
      deleteSellerProduct: (id) => set((s) => ({
        sellerProducts: s.sellerProducts.filter((p) => p.id !== id),
        cart: s.cart.filter((l) => l.productId !== id),
      })),
      placeOrder: (order, sellerOrder, stockUpdates) => set((s) => ({
        lastOrder: order,
        cart: [],
        city: order.city,
        orders: sellerOrder ? [sellerOrder, ...s.orders] : s.orders,
        sellerProducts: s.sellerProducts.map((p) => {
          const u = stockUpdates.find(([id]) => id === p.id)
          return u ? { ...p, stock: Math.max(0, p.stock - u[1]) } : p
        }),
      })),
      reset: () => set(initial()),
    }),
    { name: 'dukan-v1' },
  ),
)

/** A published seller product, shaped like a catalog product for the buyer side. */
export const toCatalogProduct = (p: SellerProduct): Product => ({
  ...p, sellerId: MY_SELLER_ID, sold: 0, tags: { new: true },
})

export function catalogProducts(sellerProducts: SellerProduct[]): Product[] {
  return [...PRODUCTS, ...sellerProducts.filter((p) => p.status === 'published').map(toCatalogProduct)]
}

export function findProduct(id: string, sellerProducts: SellerProduct[]): Product | undefined {
  const own = sellerProducts.find((p) => p.id === id)
  return own ? toCatalogProduct(own) : PRODUCTS.find((p) => p.id === id)
}

export type DisplayStatus = 'draft' | 'published' | 'out'
export const displayStatus = (p: SellerProduct): DisplayStatus =>
  p.status === 'draft' ? 'draft' : p.stock <= 0 ? 'out' : 'published'
