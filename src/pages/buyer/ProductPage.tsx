import { Fragment, useState } from "react"
import { Link, useNavigate, useParams } from 'react-router'
import { BadgeCheck, Banknote, ChevronRight, MapPin, PackageX, RotateCcw, ShoppingBag, Star, Truck, Zap } from 'lucide-react'
import { ProductCard, ProductGrid } from '../../components/ProductCard'
import { ProductImage } from '../../components/ProductImage'
import { Button, ButtonLink } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Pill } from '../../components/ui/Pill'
import { QtyStepper } from '../../components/ui/QtyStepper'
import { cn } from '../../components/ui/cn'
import { CATEGORY, CITIES, COLORS, MY_SELLER_ID, REVIEWS, SELLERS, SPECS } from '../../data/catalog'
import { deliveryWindow, FREE_SHIPPING_FROM, SHIPPING_STANDARD } from '../../lib/delivery'
import { discountPercent, formatCompact, formatDH, formatNumber, formatRating, initials } from '../../lib/format'
import { useCartLines, useCatalog } from '../../store/hooks'
import { findProduct, useShop } from '../../store/shop'
import { toast } from '../../store/toast'
import type { Product } from '../../types'

/** The product's own color comes first, then up to two catalog alternatives that differ enough to be visible. */
function colorOptions(p: Product): [string, number][] {
  if (p.sellerId === MY_SELLER_ID || !COLORS[p.category]) return []
  return [['Original', p.hue], ...COLORS[p.category]!.filter(([, h]) => Math.abs(h - p.hue) > 12).slice(0, 2)]
}

export function ProductPage() {
  const { id = '' } = useParams()
  const sellerProducts = useShop((s) => s.sellerProducts)
  const product = findProduct(id, sellerProducts)
  // key resets the local selection state when navigating between products
  return product ? <ProductView key={product.id} product={product} /> : (
    <div className="container-page py-10">
      <EmptyState icon={PackageX} title="Produit introuvable" actions={<ButtonLink to="/catalogue">Retour au catalogue</ButtonLink>}>Ce produit a peut-être été retiré par le vendeur.</EmptyState>
    </div>
  )
}

function ProductView({ product: p }: { product: Product }) {
  const navigate = useNavigate()
  const catalog = useCatalog()
  const { subtotal } = useCartLines()
  const { city, setCity, addToCart } = useShop()
  const [view, setView] = useState(0)
  const [colorIdx, setColorIdx] = useState(0)
  const [size, setSize] = useState<string | null>(null)
  const [sizeError, setSizeError] = useState(false)
  const [qty, setQty] = useState(1)

  const seller = SELLERS[p.sellerId]
  const d = discountPercent(p.price, p.oldPrice)
  const colors = colorOptions(p)
  const hue = colors[colorIdx]?.[1] ?? p.hue
  const freeShipping = subtotal + p.price * qty >= FREE_SHIPPING_FROM
  const related = catalog.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 6)
  const sellerCount = catalog.filter((x) => x.sellerId === p.sellerId).length
  const reviews = p.rating ? [REVIEWS[(p.id.length + p.price) % 4], REVIEWS[(p.price + 1) % 4]] : []
  const sizeLabel = p.art === 'babouche' ? 'Pointure' : 'Taille'

  const add = () => {
    if (p.sizes?.length && !size) { setSizeError(true); toast(`Choisissez une ${sizeLabel.toLowerCase()}`, 'error'); return false }
    addToCart({ productId: p.id, qty, hue, size: size ?? undefined, color: colorIdx ? colors[colorIdx][0] : undefined })
    toast(`${p.name} ajouté au panier`, 'success', { label: 'Voir le panier', run: () => navigate('/panier') })
    return true
  }

  return (
    <div className="container-page">
      <nav className="flex flex-wrap items-center gap-1.5 pt-4.5 text-[13.5px] text-muted" aria-label="Fil d’Ariane">
        <Link to="/" className="hover:text-ink">Accueil</Link><ChevronRight className="size-4" />
        <Link to={`/catalogue?cat=${p.category}`} className="hover:text-ink">{CATEGORY[p.category].name}</Link><ChevronRight className="size-4" />
        <span>{p.name}</span>
      </nav>

      <div className="grid items-start gap-5 pt-4 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-9">
        <div className="grid gap-3 md:sticky md:top-32 md:grid-cols-[76px_1fr]">
          <div className="order-2 grid grid-cols-4 content-start gap-2.5 md:order-none md:grid-cols-1">
            {[0, 1, 2, 3].map((v) => (
              <button key={v} type="button" onClick={() => setView(v)} aria-label={`Image ${v + 1}`} aria-pressed={view === v}
                className={cn('aspect-square overflow-hidden rounded-xl border-2', view === v ? 'border-ink' : 'border-transparent')}>
                <ProductImage art={p.art} hue={hue} image={p.image} view={v} />
              </button>
            ))}
          </div>
          <div className="relative aspect-square overflow-hidden rounded-[20px]">
            <ProductImage art={p.art} hue={hue} image={p.image} view={view} alt={p.name} />
            {d > 0 && <span className="absolute top-3 left-3 rounded-lg bg-deal px-2.5 py-1 text-sm font-bold text-white">-{d}%</span>}
          </div>
        </div>

        <div className="grid gap-4.5">
          <div className="grid gap-2">
            {p.tags.trend && <Pill tone="warn" className="justify-self-start"><Zap />Tendance au Maroc</Pill>}
            <h1 className="text-[26px] font-bold sm:text-[34px]">{p.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              {p.rating ? (
                <><span className="inline-flex items-center gap-1 font-semibold text-ink"><Star className="size-4 fill-saffron stroke-saffron" />{formatRating(p.rating)}</span>
                  <span>{formatNumber(p.reviews ?? 0)} avis</span><span>{formatCompact(p.sold)} vendus</span></>
              ) : <Pill>Nouveau sur Dukan</Pill>}
              <span className="inline-flex items-center gap-1"><MapPin className="size-4" />Expédié depuis {seller.city}</span>
            </div>
          </div>

          <div className={cn('grid gap-1 rounded-2xl px-4.5 py-4', d ? 'bg-deal-soft' : 'bg-surface-2')}>
            <div>
              <span className={cn('font-display text-4xl font-extrabold tracking-[-0.02em] tabular-nums', d && 'text-deal')}>{formatDH(p.price)}</span>
              {p.oldPrice && <s className="ml-2 text-base text-muted">{formatDH(p.oldPrice)}</s>}
            </div>
            {d ? <span className="text-sm font-semibold text-deal">Vous économisez {formatDH(p.oldPrice! - p.price)} · offre valable jusqu’au 31 octobre</span>
              : <span className="text-sm text-muted">Prix fixé par le vendeur</span>}
          </div>

          {colors.length > 0 && (
            <div>
              <h3 className="mb-2.5 font-sans text-sm font-bold">Couleur : <span className="font-medium text-muted">{colors[colorIdx][0]}</span></h3>
              <div className="flex flex-wrap gap-2.5">
                {colors.map(([label, h], i) => (
                  <button key={label} type="button" onClick={() => setColorIdx(i)} aria-label={label} aria-pressed={colorIdx === i}
                    className={cn('size-14 overflow-hidden rounded-xl border-2', colorIdx === i ? 'border-ink' : 'border-line')}>
                    <ProductImage art={p.art} hue={h} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {p.sizes?.length ? (
            <div>
              <h3 className="mb-2.5 font-sans text-sm font-bold">{sizeLabel} : <span className="font-medium text-muted">{size ?? 'à choisir'}</span></h3>
              <div className="flex flex-wrap gap-2.5">
                {p.sizes.map((s) => (
                  <button key={s} type="button" onClick={() => { setSize(s); setSizeError(false) }} aria-pressed={size === s}
                    className={cn('min-w-13 rounded-[10px] border-[1.5px] px-3 py-2 font-semibold', size === s ? 'border-ink bg-ink text-bg' : sizeError ? 'border-danger' : 'border-line bg-surface')}>{s}</button>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <h3 className="mb-2.5 font-sans text-sm font-bold">Quantité</h3>
            <div className="flex flex-wrap items-center gap-2.5">
              <QtyStepper value={qty} onChange={setQty} />
              <span className="text-[13.5px] text-muted">{p.stock != null ? `${p.stock} en stock` : 'En stock, expédié sous 24 h'}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button size="lg" className="flex-1" onClick={add} disabled={p.stock === 0}><ShoppingBag className="size-5" />{p.stock === 0 ? 'En rupture de stock' : 'Ajouter au panier'}</Button>
            <Button size="lg" variant="ghost" className="flex-1" onClick={() => add() && navigate('/panier')} disabled={p.stock === 0}>Acheter maintenant</Button>
          </div>

          <div className="grid gap-3 rounded-2xl border border-line bg-surface px-4.5 py-4 text-sm">
            <div className="flex gap-3"><Truck className="mt-0.5 size-5 flex-none text-brand" /><div>
              <b className="block">Livraison à{' '}
                <select value={city} onChange={(e) => { setCity(e.target.value); toast(`Livraison estimée pour ${e.target.value}`, 'info') }} aria-label="Ville de livraison" className="cursor-pointer bg-transparent font-bold text-brand">
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </b>
              Reçu {deliveryWindow(seller.city, city)} · {freeShipping ? 'Gratuite' : `${formatDH(SHIPPING_STANDARD)} (gratuite dès ${FREE_SHIPPING_FROM} DH)`}
            </div></div>
            <div className="flex gap-3"><Banknote className="mt-0.5 size-5 flex-none text-brand" /><div><b className="block">Paiement à la livraison</b>Payez en espèces au livreur, rien à régler en ligne.</div></div>
            <div className="flex gap-3"><RotateCcw className="mt-0.5 size-5 flex-none text-brand" /><div><b className="block">Retour gratuit sous 14 jours</b>Si le produit ne vous convient pas.</div></div>
          </div>

          <div className="rounded-2xl border border-line bg-surface px-4.5 py-4">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3.5">
              <span className="grid size-13 place-items-center rounded-[14px] font-display text-lg font-extrabold text-white" style={{ background: `hsl(${seller.hue} 50% 42%)` }}>{initials(seller.name)}</span>
              <div>
                <h3 className="flex items-center gap-1.5 text-[17px] font-bold">{seller.name}<BadgeCheck className="size-[18px] text-brand" aria-label="Vendeur vérifié" /></h3>
                <div className="flex items-center gap-1 text-[13.5px] text-muted"><MapPin className="size-3.5" />{seller.city} · sur Dukan depuis {seller.since}</div>
              </div>
              <ButtonLink to={`/catalogue?vendeur=${p.sellerId}`} variant="ghost" size="sm">Boutique</ButtonLink>
            </div>
            <div className="mt-3.5 grid grid-cols-3 gap-2 text-center text-[12.5px] text-muted">
              {[[formatRating(seller.rating), 'Note'], [String(sellerCount), 'Produits'], [seller.responseTime, 'Réponse']].map(([v, l]) => (
                <div key={l} className="rounded-[10px] bg-surface-2 p-2"><b className="block text-[15px] text-ink">{v}</b>{l}</div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface px-4.5 py-4">
            <h3 className="mb-2 text-lg font-bold">Description</h3>
            <p className="max-w-[65ch] text-muted">{p.description}</p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4.5 gap-y-2 text-sm">
              {[...SPECS[p.category], ["Vendeur", `${seller.name}, ${seller.city}`]].map(([k, v]) => <Fragment key={k}><dt className="text-muted">{k}</dt><dd className="font-medium">{v}</dd></Fragment>)}
            </dl>
            {reviews.length > 0 && (
              <>
                <h3 className="mt-4.5 text-lg font-bold">Avis clients</h3>
                {reviews.map(([name, rc, stars, text], i) => (
                  <div key={i} className="mt-3 border-t border-line pt-3 text-sm">
                    <span className="tracking-wider text-saffron" aria-label={`${stars} sur 5`}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span> <b>{name}</b> <span className="text-muted">· {rc}</span>
                    <p className="mt-1 text-muted">{text}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="py-7">
          <h2 className="mb-4 text-[22px] font-bold sm:text-[28px]">Vous aimerez aussi</h2>
          <ProductGrid>{related.map((x) => <ProductCard key={x.id} product={x} />)}</ProductGrid>
        </section>
      )}
    </div>
  )
}
