import { useMemo } from 'react'
import { catalogProducts, useShop } from './shop'

export function useCatalog() {
  const sellerProducts = useShop((s) => s.sellerProducts)
  return useMemo(() => catalogProducts(sellerProducts), [sellerProducts])
}

export function useCartLines() {
  const cart = useShop((s) => s.cart)
  const catalog = useCatalog()
  return useMemo(() => {
    const lines = cart.flatMap((l) => {
      const product = catalog.find((p) => p.id === l.productId)
      return product ? [{ ...l, product }] : []
    })
    const subtotal = lines.reduce((a, l) => a + l.product.price * l.qty, 0)
    const beforeDiscount = lines.reduce((a, l) => a + (l.product.oldPrice ?? l.product.price) * l.qty, 0)
    const count = lines.reduce((a, l) => a + l.qty, 0)
    return { lines, subtotal, beforeDiscount, count }
  }, [cart, catalog])
}
