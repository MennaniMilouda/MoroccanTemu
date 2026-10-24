import { Link, useNavigate } from 'react-router'
import { ArrowRight, Banknote, ChevronRight, ShoppingBag, Trash2 } from 'lucide-react'
import { ProductImage } from '../../components/ProductImage'
import { ButtonLink } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { QtyStepper } from '../../components/ui/QtyStepper'
import { SELLERS } from '../../data/catalog'
import { FREE_SHIPPING_FROM } from '../../lib/delivery'
import { formatDH, plural } from '../../lib/format'
import { useCartLines } from '../../store/hooks'
import { useShop } from '../../store/shop'
import { toast } from '../../store/toast'
import { OrderSummary } from './OrderSummary'

export function Cart() {
  const { lines, subtotal, count } = useCartLines()
  const { setQty, removeLine, restoreLine } = useShop()
  const navigate = useNavigate()
  const left = Math.max(0, FREE_SHIPPING_FROM - subtotal)

  if (!lines.length) return (
    <div className="container-page py-8">
      <EmptyState icon={ShoppingBag} title="Votre panier est vide" actions={<ButtonLink to="/catalogue">Parcourir le catalogue</ButtonLink>}>
        Ajoutez des produits depuis le catalogue, ils apparaîtront ici.
      </EmptyState>
    </div>
  )

  const remove = (key: string) => {
    const index = useShop.getState().cart.findIndex((l) => l.key === key)
    const line = removeLine(key)
    if (line) toast('Article retiré du panier', 'info', { label: 'Annuler', run: () => restoreLine(line, index) })
  }

  return (
    <div className="container-page">
      <nav className="flex items-center gap-1.5 pt-4.5 text-[13.5px] text-muted" aria-label="Fil d’Ariane"><Link to="/" className="hover:text-ink">Accueil</Link><ChevronRight className="size-4" /><span>Panier</span></nav>
      <div className="grid items-start gap-6 pt-4 lg:grid-cols-[minmax(0,1fr)_370px]">
        <section className="rounded-2xl border border-line bg-surface px-4.5 py-4">
          <h1 className="mb-1 text-[26px] font-bold">Mon panier <span className="font-sans text-base font-medium text-muted">({plural(count, 'article')})</span></h1>
          {lines.map((l) => (
            <div key={l.key} className="grid grid-cols-[76px_1fr] items-start gap-3.5 border-b border-line py-4 last:border-0 sm:grid-cols-[96px_1fr_auto]">
              <Link to={`/produit/${l.product.id}`} className="aspect-square overflow-hidden rounded-xl"><ProductImage art={l.product.art} hue={l.hue} image={l.product.image} /></Link>
              <div className="min-w-0">
                <h3 className="font-sans text-[15px] font-semibold">{l.product.name}</h3>
                <div className="text-[13px] text-muted">
                  {[l.color, l.size && `Taille ${l.size}`].filter(Boolean).join(' · ') || 'Modèle unique'} · {SELLERS[l.product.sellerId].name}, {SELLERS[l.product.sellerId].city}
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                  <QtyStepper value={l.qty} onChange={(q) => setQty(l.key, q)} />
                  <button type="button" onClick={() => remove(l.key)} className="inline-flex items-center gap-1.5 p-1 text-[13.5px] text-muted hover:text-danger"><Trash2 className="size-4" />Supprimer</button>
                </div>
              </div>
              <div className="col-start-2 flex items-baseline gap-2 sm:col-start-auto sm:grid sm:text-right">
                <span className="font-display text-[19px] font-extrabold tabular-nums">{formatDH(l.product.price * l.qty)}</span>
                {l.product.oldPrice && <s className="text-[13px] text-muted tabular-nums">{formatDH(l.product.oldPrice * l.qty)}</s>}
              </div>
            </div>
          ))}
        </section>
        <aside className="grid gap-3 lg:sticky lg:top-32">
          <div className="grid gap-3 rounded-2xl border border-line bg-surface px-4.5 py-4">
            <h2 className="text-xl font-bold">Récapitulatif</h2>
            <OrderSummary express={false} />
            <div className="grid gap-1.5 rounded-xl bg-ok-soft px-3 py-2.5 text-[13.5px] font-semibold text-ok">
              {left ? `Plus que ${formatDH(left)} pour la livraison gratuite` : 'Livraison gratuite débloquée'}
              <div className="h-1.5 overflow-hidden rounded-full bg-white/55"><i className="block h-full rounded-full bg-ok" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100)}%` }} /></div>
            </div>
            <button type="button" onClick={() => navigate('/commande')} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-on-brand hover:bg-brand-strong">Passer la commande <ArrowRight className="size-5" /></button>
            <p className="flex items-center justify-center gap-1.5 text-[13px] text-muted"><Banknote className="size-4" />Paiement à la livraison, aucun paiement en ligne</p>
          </div>
          <ButtonLink to="/catalogue" variant="ghost">Continuer mes achats</ButtonLink>
        </aside>
      </div>
    </div>
  )
}
