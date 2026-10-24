import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { Heart, Plus, Star, Truck } from 'lucide-react'
import { SELLERS } from '../data/catalog'
import { FREE_SHIPPING_FROM } from '../lib/delivery'
import { discountPercent, formatCompact, formatDH, formatRating } from '../lib/format'
import { useShop } from '../store/shop'
import { toast } from '../store/toast'
import type { Product } from '../types'
import { ProductImage } from './ProductImage'
import { cn } from './ui/cn'

interface Props {
  product: Product
  /** Ranking badge for "Tendances au Maroc". */
  rank?: { position: number; city: string }
  /** Percentage sold, for flash sales. */
  flashSold?: number
}

export function ProductCard({ product: p, rank, flashSold }: Props) {
  const navigate = useNavigate()
  const fav = useShop((s) => s.favorites.includes(p.id))
  const toggleFavorite = useShop((s) => s.toggleFavorite)
  const addToCart = useShop((s) => s.addToCart)
  const d = discountPercent(p.price, p.oldPrice)
  const seller = SELLERS[p.sellerId]
  const href = `/produit/${p.id}`

  const quickAdd = () => {
    if (p.sizes?.length) {
      navigate(href)
      toast('Choisissez une taille avant d’ajouter au panier', 'info')
      return
    }
    addToCart({ productId: p.id, qty: 1, hue: p.hue })
    toast(`${p.name} ajouté au panier`, 'success', { label: 'Voir le panier', run: () => navigate('/panier') })
  }

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:-translate-y-0.5 hover:shadow-card">
      <Link to={href} className="relative block aspect-square overflow-hidden bg-surface-2" aria-label={p.name}>
        <ProductImage art={p.art} hue={p.hue} image={p.image} className="transition duration-500 group-hover:scale-[1.04]" />
        {d > 0 && <span className="absolute top-2.5 left-2.5 rounded-md bg-deal px-2 py-0.5 text-[12.5px] font-bold text-white">-{d}%</span>}
        {rank ? (
          <span className="absolute bottom-2.5 left-2.5 rounded-md bg-ink px-2 py-0.5 text-xs font-bold text-bg">N°{rank.position} · {rank.city}</span>
        ) : p.tags.new ? (
          <span className="absolute bottom-2.5 left-2.5 rounded-md bg-surface px-2 py-0.5 text-[11.5px] font-bold tracking-wide">NOUVEAU</span>
        ) : null}
      </Link>
      <button type="button" onClick={() => toast(toggleFavorite(p.id) ? 'Ajouté à vos favoris' : 'Retiré de vos favoris', 'info')}
        aria-pressed={fav} aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        className={cn('absolute top-2.5 right-2.5 grid size-[34px] place-items-center rounded-full bg-white/90', fav ? 'text-deal' : 'text-neutral-800')}>
        <Heart className={cn('size-[18px]', fav && 'fill-current')} />
      </button>
      <div className="grid flex-1 content-start gap-1.5 p-3 pr-12">
        <Link to={href} className="line-clamp-2 min-h-[2.6em] text-[14.5px] leading-tight font-medium">{p.name}</Link>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className={cn('font-display text-[19px] font-extrabold tabular-nums', d > 0 && 'text-deal')}>{formatDH(p.price)}</span>
          {p.oldPrice && <s className="text-[13px] text-muted">{formatDH(p.oldPrice)}</s>}
        </div>
        {flashSold != null ? (
          <div>
            <div className="h-1.5 overflow-hidden rounded-full bg-deal-soft"><i className="block h-full rounded-full bg-deal" style={{ width: `${flashSold}%` }} /></div>
            <div className="mt-1 text-xs font-semibold text-deal">{flashSold}% vendus</div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-[12.5px] text-muted">
              {p.rating ? (
                <><span className="inline-flex items-center gap-1 font-semibold text-ink"><Star className="size-3.5 fill-saffron stroke-saffron" />{formatRating(p.rating)}</span><span>{formatCompact(p.sold)} vendus</span></>
              ) : <span className="rounded-full bg-brand-soft px-2 py-px font-semibold text-brand">Nouveau vendeur</span>}
            </div>
            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ok">
              <Truck className="size-[15px]" />{p.price >= FREE_SHIPPING_FROM ? 'Livraison gratuite' : 'Livraison 24–72 h'}
              <span className="font-medium text-muted">· {seller.city}</span>
            </div>
          </>
        )}
      </div>
      <button type="button" onClick={quickAdd} aria-label={`Ajouter ${p.name} au panier`}
        className="absolute right-2.5 bottom-3 grid size-9 place-items-center rounded-full border-[1.5px] border-ink bg-surface hover:bg-ink hover:text-bg">
        <Plus className="size-[18px]" />
      </button>
    </article>
  )
}

export function ProductGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] sm:gap-4">{children}</div>
}

export function ProductRail({ children }: { children: ReactNode }) {
  return <div className="grid snap-x snap-mandatory auto-cols-[minmax(150px,46%)] grid-flow-col gap-3 overflow-x-auto pb-1.5 sm:auto-cols-[minmax(178px,1fr)] [&>*]:snap-start">{children}</div>
}
