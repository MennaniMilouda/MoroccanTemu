import { Navigate } from 'react-router'
import { Banknote, Box, Check, Truck } from 'lucide-react'
import { ProductImage } from '../../components/ProductImage'
import { ButtonLink } from '../../components/ui/Button'
import { cn } from '../../components/ui/cn'
import { deliveryWindow } from '../../lib/delivery'
import { formatDH } from '../../lib/format'
import { useShop } from '../../store/shop'

export function Confirmation() {
  const o = useShop((s) => s.lastOrder)
  if (!o) return <Navigate to="/" replace />
  const timeline = [[Check, 'Commande reçue', true], [Box, 'Préparation par le vendeur', false], [Truck, `En route vers ${o.city}`, false], [Banknote, 'Livrée et payée', false]] as const
  const row = 'flex flex-wrap justify-between gap-2.5 text-[14.5px]'
  return (
    <div className="container-page">
      <div className="mx-auto grid max-w-3xl gap-5 pt-8">
        <div className="grid justify-items-center gap-3 text-center">
          <span className="grid size-19 animate-pop place-items-center rounded-full bg-ok text-white"><Check className="size-9.5" strokeWidth={2.6} /></span>
          <h1 className="text-[26px] font-bold sm:text-4xl">Merci {o.name.split(' ')[0]}, votre commande est confirmée</h1>
          <p className="text-muted">Commande <b className="text-ink tabular-nums">{o.no}</b> · Le vendeur vous appellera au {o.phone} pour confirmer la livraison.</p>
        </div>
        <ol className="grid grid-cols-2 gap-y-3.5 rounded-2xl border border-line bg-surface p-4.5 sm:grid-cols-4">
          {timeline.map(([Icon, label, on]) => (
            <li key={label} className={cn('grid justify-items-center gap-1.5 text-center text-[13px]', on ? 'font-semibold text-ink' : 'text-muted')}>
              <i className={cn('grid size-7.5 place-items-center rounded-full', on ? 'bg-ok text-white' : 'bg-surface-2')}><Icon className="size-4" /></i>{label}
            </li>
          ))}
        </ol>
        <div className="grid gap-3 rounded-2xl border border-line bg-surface px-4.5 py-4">
          <div className={row}><span className="text-muted">Livraison</span><span>{o.address}, {o.city} · {o.express ? 'Express 24 h' : `Standard, ${deliveryWindow('Fès', o.city)}`}</span></div>
          <div className={row}><span className="text-muted">Paiement</span><span>À la livraison, en espèces</span></div>
          <div className="grid gap-2.5 border-t border-line pt-3">
            {o.lines.map((l, i) => (
              <div key={i} className="grid grid-cols-[52px_1fr_auto] items-center gap-2.5 text-[13.5px]">
                <span className="relative size-13 overflow-hidden rounded-[9px]"><ProductImage art={l.art} hue={l.hue} image={l.image} /><span className="absolute top-0 right-0 rounded-bl-lg bg-ink px-1.5 text-[11px] font-bold text-bg">×{l.qty}</span></span>
                <span>{l.name}</span><b className="tabular-nums">{formatDH(l.price * l.qty)}</b>
              </div>
            ))}
          </div>
          <div className="flex justify-between gap-2.5 border-t border-line pt-3 font-display text-lg font-extrabold"><span>Total à payer à la livraison</span><span className="tabular-nums">{formatDH(o.total)}</span></div>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          <ButtonLink to="/">Continuer mes achats</ButtonLink>
          <ButtonLink to="/vendeur" variant="ghost">Voir la commande côté vendeur</ButtonLink>
        </div>
      </div>
    </div>
  )
}
