import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Box, FileSpreadsheet, Instagram, Minus, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react'
import { ProductImage } from '../../components/ProductImage'
import { Button, IconButton } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal } from '../../components/ui/Modal'
import { Pill } from '../../components/ui/Pill'
import { Switch } from '../../components/ui/Switch'
import { cn } from '../../components/ui/cn'
import { CATEGORY } from '../../data/catalog'
import { formatDH, normalize, plural } from '../../lib/format'
import { useSellerUi } from '../../store/sellerUi'
import { displayStatus, useShop, type DisplayStatus } from '../../store/shop'
import { toast } from '../../store/toast'
import type { SellerProduct } from '../../types'
import { STATUS_LABEL, STATUS_TONE } from './status'

const TABS: [string, string, DisplayStatus | null][] = [['tous', 'Tous', null], ['publies', 'Publiés', 'published'], ['brouillons', 'Brouillons', 'draft'], ['rupture', 'En rupture', 'out']]

/** Commits on blur or Enter so typing "1290" doesn't save "1", "12", "129" along the way. */
function PriceInput({ product }: { product: SellerProduct }) {
  const update = useShop((s) => s.updateSellerProduct)
  const [value, setValue] = useState(String(product.price))
  useEffect(() => { setValue(String(product.price)) }, [product.price])
  const commit = () => {
    const v = Math.round(Number(value))
    if (v === product.price) return
    if (!(v > 0)) { setValue(String(product.price)); toast('Le prix doit être supérieur à 0 DH', 'error'); return }
    update(product.id, { price: v, oldPrice: product.oldPrice && product.oldPrice > v ? product.oldPrice : null })
    toast(`Prix mis à jour : ${formatDH(v)}`)
  }
  return (
    <div className="flex max-w-32 items-center overflow-hidden rounded-[9px] border border-line bg-surface focus-within:border-brand focus-within:ring-3 focus-within:ring-brand-soft">
      <input type="number" min={1} inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} aria-label={`Prix de ${product.name}`}
        className="w-full min-w-0 bg-transparent py-2 pr-1 pl-2.5 font-semibold tabular-nums outline-none" />
      <span className="pr-2.5 text-[13px] font-semibold text-muted">DH</span>
    </div>
  )
}

function StockInput({ product }: { product: SellerProduct }) {
  const update = useShop((s) => s.updateSellerProduct)
  const setStock = (n: number) => {
    const stock = Math.max(0, n)
    update(product.id, { stock })
    if (stock === 0 && product.stock > 0) toast('Stock à 0 : le produit passe en rupture', 'error')
  }
  const btn = 'grid h-9 w-8 place-items-center bg-surface-2 disabled:opacity-40'
  return (
    <div className="inline-flex items-center overflow-hidden rounded-[9px] border border-line">
      <button type="button" className={btn} onClick={() => setStock(product.stock - 1)} disabled={product.stock <= 0} aria-label="Retirer une unité"><Minus className="size-[15px]" /></button>
      <input type="number" min={0} value={product.stock} onChange={(e) => setStock(parseInt(e.target.value) || 0)} aria-label={`Stock de ${product.name}`}
        className="h-9 w-11.5 bg-surface text-center font-semibold tabular-nums outline-none" />
      <button type="button" className={btn} onClick={() => setStock(product.stock + 1)} aria-label="Ajouter une unité"><Plus className="size-[15px]" /></button>
    </div>
  )
}

export function Products() {
  const { sellerProducts, setStatus, deleteSellerProduct } = useShop()
  const { openMethods, openForm } = useSellerUi()
  const [params, setParams] = useSearchParams()
  const tab = TABS.find(([k]) => k === params.get('onglet')) ?? TABS[0]
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [toDelete, setToDelete] = useState<SellerProduct | null>(null)

  const count = (s: DisplayStatus | null) => sellerProducts.filter((p) => !s || displayStatus(p) === s).length
  const list = sellerProducts.filter((p) => (!tab[2] || displayStatus(p) === tab[2]) && (!q || normalize(p.name).includes(normalize(q))))
  const sel = selected.filter((id) => list.some((p) => p.id === id))

  const togglePublish = (p: SellerProduct, on: boolean) => {
    setStatus([p.id], on ? 'published' : 'draft')
    const undo = { label: 'Annuler', run: () => setStatus([p.id], on ? 'draft' : 'published') }
    if (on && p.stock <= 0) toast(`« ${p.name} » est publié mais en rupture de stock`, 'error', undo)
    else toast(on ? `« ${p.name} » est en ligne` : `« ${p.name} » est retiré de la boutique`, on ? 'success' : 'info', undo)
  }
  const bulk = (status: SellerProduct['status']) => {
    setStatus(sel, status)
    toast(status === 'published' ? `${plural(sel.length, 'produit publié', 'produits publiés')}` : `${plural(sel.length, 'produit retiré', 'produits retirés')} de la boutique`, status === 'published' ? 'success' : 'info')
    setSelected([])
  }

  const source = (p: SellerProduct) =>
    p.source === 'instagram' ? <Pill tone="instagram"><Instagram />Instagram</Pill>
      : p.source === 'fichier' ? <Pill tone="draft"><FileSpreadsheet />Fichier</Pill> : null

  const cols = 'lg:grid-cols-[28px_56px_minmax(0,2.2fr)_130px_128px_160px_190px]'
  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3.5">
        <div>
          <h1 className="text-[26px] font-bold sm:text-[34px]">Mes produits</h1>
          <p className="mt-1 text-muted">Modifiez les prix et les stocks directement dans la liste. Les changements sont enregistrés automatiquement.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => openForm()}><Plus className="size-5" />Ajouter un produit</Button>
          <Button onClick={openMethods}><Upload className="size-5" />Importer mes produits</Button>
        </div>
      </div>

      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <div className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-surface-2 p-1" role="tablist">
          {TABS.map(([key, label, status]) => (
            <button key={key} type="button" role="tab" aria-selected={tab[0] === key} onClick={() => { setParams(key === 'tous' ? {} : { onglet: key }); setSelected([]) }}
              className={cn('rounded-full px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap', tab[0] === key ? 'bg-surface text-ink shadow-sm' : 'text-muted')}>
              {label}<span className="ml-1 text-xs opacity-75 tabular-nums">{count(status)}</span>
            </button>
          ))}
        </div>
        <div className="flex max-w-[340px] min-w-44 flex-1 items-center gap-2 rounded-full border border-line bg-surface px-3.5">
          <Search className="size-5 text-muted" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un produit" aria-label="Rechercher dans mes produits" className="min-w-0 flex-1 bg-transparent py-2 outline-none" />
        </div>
        {sel.length > 0 && (
          <div className="flex items-center gap-2.5 rounded-full bg-ink py-2 pr-2 pl-4 text-sm font-semibold text-bg">
            {plural(sel.length, 'sélectionné')}
            <Button variant="saffron" size="sm" onClick={() => bulk('published')}>Publier</Button>
            <Button variant="inverse" size="sm" onClick={() => bulk('draft')}>Dépublier</Button>
          </div>
        )}
      </div>

      {list.length ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className={cn('hidden items-center gap-3.5 bg-surface-2 px-4 py-2.5 text-[12.5px] font-semibold text-muted lg:grid', cols)}>
            <input type="checkbox" className="size-5 accent-brand" aria-label="Tout sélectionner" checked={sel.length === list.length} onChange={(e) => setSelected(e.target.checked ? list.map((p) => p.id) : [])} />
            <span /><span>Produit</span><span>Prix</span><span>Stock</span><span>Statut</span><span className="text-right">Actions</span>
          </div>
          {list.map((p) => {
            const st = displayStatus(p), on = p.status === 'published'
            return (
              <div key={p.id} className={cn('grid grid-cols-[24px_56px_minmax(0,1fr)] items-center gap-x-3 gap-y-2.5 border-t border-line p-3.5 first:border-0 lg:gap-3.5 lg:px-4 lg:py-3 lg:first:border-t', cols)}>
                <input type="checkbox" className="size-5 accent-brand" aria-label={`Sélectionner ${p.name}`} checked={sel.includes(p.id)}
                  onChange={(e) => setSelected((s) => (e.target.checked ? [...s, p.id] : s.filter((x) => x !== p.id)))} />
                <span className="size-14 overflow-hidden rounded-[10px]"><ProductImage art={p.art} hue={p.hue} image={p.image} /></span>
                <div className="min-w-0">
                  <div className="text-[14.5px] leading-tight font-semibold">{p.name}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[12.5px] text-muted">{CATEGORY[p.category].name}{source(p)}</div>
                </div>
                <div className="col-start-3 flex items-center gap-2.5 lg:col-auto"><span className="min-w-11 text-[12.5px] text-muted lg:hidden">Prix</span><PriceInput product={p} /></div>
                <div className="col-start-3 flex items-center gap-2.5 lg:col-auto"><span className="min-w-11 text-[12.5px] text-muted lg:hidden">Stock</span><StockInput product={p} /></div>
                <div className="col-start-3 lg:col-auto"><Pill tone={STATUS_TONE[st]}><span className="size-1.5 rounded-full bg-current" />{STATUS_LABEL[st]}</Pill></div>
                <div className="col-span-3 flex items-center justify-end gap-1 border-t border-dashed border-line pt-2 lg:col-span-1 lg:border-0 lg:pt-0">
                  <span className="mr-1 text-[13px] whitespace-nowrap text-muted">{on ? 'En ligne' : 'Hors ligne'}</span>
                  <Switch checked={on} onChange={(v) => togglePublish(p, v)} label={`${on ? 'Dépublier' : 'Publier'} ${p.name}`} />
                  <IconButton onClick={() => openForm(p.id)} aria-label={`Modifier ${p.name}`} className="size-9"><Pencil className="size-[18px]" /></IconButton>
                  <IconButton onClick={() => setToDelete(p)} aria-label={`Supprimer ${p.name}`} className="size-9"><Trash2 className="size-[18px]" /></IconButton>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState icon={Box} title={q ? 'Aucun produit trouvé' : tab[2] === 'draft' ? 'Aucun brouillon' : tab[2] === 'out' ? 'Aucun produit en rupture' : 'Aucun produit'}
          actions={<Button onClick={openMethods}><Upload className="size-5" />Importer mes produits</Button>}>
          {tab[2] === 'draft' ? 'Importez vos produits Instagram : ils arrivent ici pour vérification avant publication.' : 'Ajoutez votre premier produit ou importez votre catalogue.'}
        </EmptyState>
      )}

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} size="sm" title={`Supprimer « ${toDelete?.name ?? ''} » ?`}
        description="Le produit sera retiré de votre boutique et des paniers des acheteurs. Cette action est définitive."
        footer={<>
          <Button variant="ghost" onClick={() => setToDelete(null)}>Annuler</Button>
          <Button variant="danger" onClick={() => { deleteSellerProduct(toDelete!.id); setToDelete(null); toast('Produit supprimé') }}><Trash2 className="size-4" />Supprimer</Button>
        </>} />
    </>
  )
}
