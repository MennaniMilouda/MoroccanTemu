import { shippingCost } from '../../lib/delivery'
import { formatDH } from '../../lib/format'
import { useCartLines } from '../../store/hooks'

export function OrderSummary({ express }: { express: boolean }) {
  const { subtotal, beforeDiscount } = useCartLines()
  const ship = shippingCost(subtotal, express)
  const row = 'flex justify-between gap-2.5 text-[14.5px]'
  return (
    <div className="grid gap-2.5">
      <div className={row}><span>Sous-total</span><span className="tabular-nums">{formatDH(beforeDiscount)}</span></div>
      {beforeDiscount > subtotal && <div className={`${row} text-deal`}><span>Réductions</span><span className="tabular-nums">−{formatDH(beforeDiscount - subtotal)}</span></div>}
      <div className={row}><span>Livraison{express ? ' express' : ''}</span><span className="tabular-nums">{ship ? formatDH(ship) : 'Gratuite'}</span></div>
      <div className="flex justify-between gap-2.5 border-t border-line pt-3 font-display text-lg font-extrabold"><span>Total</span><span className="tabular-nums">{formatDH(subtotal + ship)}</span></div>
    </div>
  )
}
