import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ChevronRight, Filter, Search, X } from 'lucide-react'
import { ProductCard, ProductGrid } from '../../components/ProductCard'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input, Select } from '../../components/ui/Field'
import { cn } from '../../components/ui/cn'
import { CATEGORIES, CATEGORY, SELLERS } from '../../data/catalog'
import { FREE_SHIPPING_FROM } from '../../lib/delivery'
import { discountPercent, normalize, plural } from '../../lib/format'
import { useCatalog } from '../../store/hooks'
import type { CategoryId, Product } from '../../types'

const SORTS = [
  ['pertinence', 'Pertinence'], ['prix-asc', 'Prix croissant'], ['prix-desc', 'Prix décroissant'], ['ventes', 'Meilleures ventes'],
  ['notes', 'Mieux notés'], ['nouveautes', 'Nouveautés'], ['reduction', 'Plus grosse réduction'],
] as const
const SORTERS: Record<string, (a: Product, b: Product) => number> = {
  'prix-asc': (a, b) => a.price - b.price,
  'prix-desc': (a, b) => b.price - a.price,
  ventes: (a, b) => b.sold - a.sold,
  notes: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  nouveautes: (a, b) => Number(!!b.tags.new) - Number(!!a.tags.new),
  reduction: (a, b) => discountPercent(b.price, b.oldPrice) - discountPercent(a.price, a.oldPrice),
}
const RANGES = [['', '100', 'Moins de 100 DH'], ['100', '300', '100 à 300 DH'], ['300', '700', '300 à 700 DH'], ['700', '', 'Plus de 700 DH']] as const

function matches(p: Product, q: string) {
  if (!q) return true
  const seller = SELLERS[p.sellerId]
  const hay = normalize(`${p.name} ${CATEGORY[p.category].name} ${seller.name} ${seller.city}`)
  // every word must appear; tolerate a trailing plural "s"
  return normalize(q).split(/\s+/).filter(Boolean).every((w) => hay.includes(w) || hay.includes(w.replace(/s$/, '')))
}

/** Filters live in the URL so a filtered catalog can be bookmarked or shared. */
export function Catalog() {
  const catalog = useCatalog()
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const f = {
    q: params.get('q') ?? '',
    cats: params.getAll('cat') as CategoryId[],
    min: params.get('min') ?? '',
    max: params.get('max') ?? '',
    promo: params.has('promo'),
    free: params.has('gratuit'),
    city: params.get('ville') ?? '',
    seller: params.get('vendeur') ?? '',
    sort: params.get('tri') ?? 'pertinence',
  }
  const update = (fn: (p: URLSearchParams) => void) => setParams((prev) => { const p = new URLSearchParams(prev); fn(p); return p }, { replace: true })
  const setParam = (k: string, v: string | null) => update((p) => (v ? p.set(k, v) : p.delete(k)))

  const results = useMemo(() => {
    const list = catalog.filter((p) =>
      matches(p, f.q) &&
      (!f.cats.length || f.cats.includes(p.category)) &&
      (f.min === '' || p.price >= +f.min) &&
      (f.max === '' || p.price <= +f.max) &&
      (!f.promo || !!p.oldPrice) &&
      (!f.free || p.price >= FREE_SHIPPING_FROM) &&
      (!f.city || SELLERS[p.sellerId].city === f.city) &&
      (!f.seller || p.sellerId === f.seller))
    const sorter = SORTERS[f.sort]
    return sorter ? [...list].sort(sorter) : list
  }, [catalog, params]) // eslint-disable-line react-hooks/exhaustive-deps

  const title = f.seller ? SELLERS[f.seller]?.name : f.promo ? 'Promotions' : f.cats.length === 1 ? CATEGORY[f.cats[0]].name : f.q ? `Résultats pour « ${f.q} »` : 'Tous les produits'
  const cities = [...new Set(Object.values(SELLERS).map((s) => s.city))].sort((a, b) => a.localeCompare(b, 'fr'))

  const chips: [string, string, () => void][] = []
  if (f.q) chips.push(['q', `« ${f.q} »`, () => setParam('q', null)])
  f.cats.forEach((c) => chips.push(['cat' + c, CATEGORY[c].name, () => update((p) => { p.delete('cat'); f.cats.filter((x) => x !== c).forEach((x) => p.append('cat', x)) })]))
  if (f.min || f.max) chips.push(['price', f.min && f.max ? `${f.min} – ${f.max} DH` : f.min ? `Dès ${f.min} DH` : `Jusqu’à ${f.max} DH`, () => update((p) => { p.delete('min'); p.delete('max') })])
  if (f.promo) chips.push(['promo', 'En promotion', () => setParam('promo', null)])
  if (f.free) chips.push(['free', 'Livraison gratuite', () => setParam('gratuit', null)])
  if (f.city) chips.push(['city', f.city, () => setParam('ville', null)])
  if (f.seller) chips.push(['seller', `Boutique : ${SELLERS[f.seller]?.name}`, () => setParam('vendeur', null)])
  const clearAll = () => setParams(f.sort !== 'pertinence' ? { tri: f.sort } : {}, { replace: true })

  const check = 'size-5 cursor-pointer accent-brand'
  const opt = 'flex cursor-pointer items-center gap-2.5 py-1 text-[14.5px]'
  const h3 = 'mb-2.5 font-sans text-sm font-bold'

  return (
    <div className="container-page">
      <nav className="flex flex-wrap items-center gap-1.5 pt-4.5 text-[13.5px] text-muted" aria-label="Fil d’Ariane">
        <Link to="/" className="hover:text-ink">Accueil</Link><ChevronRight className="size-4" /><span>Catalogue</span>
      </nav>
      <div className="grid items-start gap-6 pt-3.5 md:grid-cols-[260px_1fr]">
        <aside className={cn('grid gap-5 rounded-2xl border border-line bg-surface p-4.5 md:sticky md:top-32 md:grid', !filtersOpen && 'hidden')} aria-label="Filtres">
          <div>
            <h3 className={h3}>Mot-clé</h3>
            <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-3.5">
              <Search className="size-5 text-muted" />
              <input type="search" value={f.q} onChange={(e) => setParam('q', e.target.value)} placeholder="Rechercher…" aria-label="Mot-clé" className="min-w-0 flex-1 bg-transparent py-2 outline-none" />
            </div>
          </div>
          <div>
            <h3 className={h3}>Catégories</h3>
            {CATEGORIES.map((c) => (
              <label key={c.id} className={opt}>
                <input type="checkbox" className={check} checked={f.cats.includes(c.id)}
                  onChange={(e) => update((p) => { p.delete('cat'); (e.target.checked ? [...f.cats, c.id] : f.cats.filter((x) => x !== c.id)).forEach((x) => p.append('cat', x)) })} />
                {c.name}<span className="ml-auto text-[13px] text-muted">{catalog.filter((p) => p.category === c.id).length}</span>
              </label>
            ))}
          </div>
          <div>
            <h3 className={h3}>Prix (DH)</h3>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <Input type="number" min={0} inputMode="numeric" placeholder="Min" value={f.min} onChange={(e) => setParam('min', e.target.value)} aria-label="Prix minimum" className="py-2 tabular-nums" />
              <span className="text-muted">–</span>
              <Input type="number" min={0} inputMode="numeric" placeholder="Max" value={f.max} onChange={(e) => setParam('max', e.target.value)} aria-label="Prix maximum" className="py-2 tabular-nums" />
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {RANGES.map(([a, b, label]) => {
                const on = f.min === a && f.max === b
                return (
                  <button key={label} type="button" onClick={() => update((p) => { p.delete('min'); p.delete('max'); if (!on) { if (a) p.set('min', a); if (b) p.set('max', b) } })}
                    className={cn('rounded-full border px-3 py-1.5 text-sm font-medium', on ? 'border-ink bg-ink text-bg' : 'border-line bg-surface')}>{label}</button>
                )
              })}
            </div>
          </div>
          <div>
            <h3 className={h3}>Offres</h3>
            <label className={opt}><input type="checkbox" className={check} checked={f.promo} onChange={(e) => setParam('promo', e.target.checked ? '1' : null)} />En promotion</label>
            <label className={opt}><input type="checkbox" className={check} checked={f.free} onChange={(e) => setParam('gratuit', e.target.checked ? '1' : null)} />Livraison gratuite</label>
          </div>
          <div>
            <h3 className={h3}>Ville du vendeur</h3>
            <Select value={f.city} onChange={(e) => setParam('ville', e.target.value || null)} aria-label="Ville du vendeur">
              <option value="">Toutes les villes</option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>
          <Button variant="ghost" size="sm" onClick={clearAll}>Effacer les filtres</Button>
        </aside>

        <section className="min-w-0">
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-[22px] font-bold sm:text-[30px]">{title}</h1>
              <p className="text-muted tabular-nums">{plural(results.length, 'produit')}{f.seller && SELLERS[f.seller] ? ` · boutique à ${SELLERS[f.seller].city}` : ''}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen}><Filter className="size-4" />Filtres</Button>
              <Select value={f.sort} onChange={(e) => setParam('tri', e.target.value === 'pertinence' ? null : e.target.value)} aria-label="Trier par" className="w-auto py-2">
                {SORTS.map(([v, l]) => <option key={v} value={v}>Trier : {l}</option>)}
              </Select>
            </div>
          </div>
          {chips.length > 0 && (
            <div className="mb-3.5 flex flex-wrap gap-1.5">
              {chips.map(([k, label, remove]) => (
                <button key={k} type="button" onClick={remove} className="inline-flex items-center gap-1 rounded-full bg-brand-soft py-1 pr-2 pl-3 text-[13px] font-semibold text-brand">{label}<X className="size-4" /></button>
              ))}
            </div>
          )}
          {results.length ? (
            <ProductGrid>{results.map((p) => <ProductCard key={p.id} product={p} />)}</ProductGrid>
          ) : (
            <EmptyState icon={Search} title="Aucun produit ne correspond" actions={<Button onClick={clearAll}>Effacer les filtres</Button>}>
              Essayez un autre mot-clé, élargissez la fourchette de prix ou retirez un filtre.
            </EmptyState>
          )}
        </section>
      </div>
    </div>
  )
}
