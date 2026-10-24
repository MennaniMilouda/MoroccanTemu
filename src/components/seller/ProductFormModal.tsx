import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { CATEGORIES, CATEGORY_ART } from '../../data/catalog'
import { useSellerUi } from '../../store/sellerUi'
import { useShop } from '../../store/shop'
import { toast } from '../../store/toast'
import type { CategoryId } from '../../types'
import { ProductImage } from '../ProductImage'
import { Button } from '../ui/Button'
import { Field, Input, Select, Textarea } from '../ui/Field'
import { Modal } from '../ui/Modal'
import { cn } from '../ui/cn'

const HUES = [250, 350, 28, 42, 155, 200, 15, 300]
const empty = { name: '', price: '', oldPrice: '', stock: '1', category: 'decoration' as CategoryId, description: '', hue: 250, published: false }

export function ProductFormModal() {
  const { form, closeForm } = useSellerUi()
  const products = useShop((s) => s.sellerProducts)
  const { addSellerProducts, updateSellerProduct } = useShop()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const editing = form?.productId ? products.find((p) => p.id === form.productId) : undefined
  const [v, setV] = useState(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!form) return
    setErrors({})
    setV(editing ? {
      name: editing.name, price: String(editing.price), oldPrice: editing.oldPrice ? String(editing.oldPrice) : '', stock: String(editing.stock),
      category: editing.category, description: editing.description, hue: editing.hue, published: editing.status === 'published',
    } : empty)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form])

  const set = <K extends keyof typeof v>(k: K, value: (typeof v)[K]) => { setV((s) => ({ ...s, [k]: value })); setErrors((e) => ({ ...e, [k]: '' })) }
  const art = editing?.art ?? CATEGORY_ART[v.category]

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const price = Number(v.price), oldPrice = v.oldPrice ? Number(v.oldPrice) : null
    const errs: Record<string, string> = {}
    if (v.name.trim().length < 3) errs.name = 'Donnez un nom d’au moins 3 caractères.'
    if (!(price > 0)) errs.price = 'Indiquez un prix supérieur à 0 DH.'
    if (oldPrice !== null && oldPrice <= price) errs.oldPrice = 'Le prix barré doit être supérieur au prix de vente.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const data = {
      name: v.name.trim(), price: Math.round(price), oldPrice, stock: Math.max(0, parseInt(v.stock) || 0), category: v.category,
      description: v.description.trim(), hue: v.hue, art, status: v.published ? 'published' as const : 'draft' as const,
    }
    if (editing) {
      updateSellerProduct(editing.id, data)
      toast('Produit mis à jour')
    } else {
      addSellerProducts([{ ...data, source: 'manuel' }])
      toast(data.status === 'published' ? 'Produit publié dans votre boutique' : 'Produit enregistré en brouillon')
      if (!pathname.startsWith('/vendeur/produits')) navigate(`/vendeur/produits?onglet=${data.status === 'published' ? 'tous' : 'brouillons'}`)
    }
    closeForm()
  }

  return (
    <Modal open={!!form} onClose={closeForm} title={editing ? 'Modifier le produit' : 'Ajouter un produit'}
      description={editing ? 'Les modifications sont visibles immédiatement dans votre boutique.' : 'Le produit sera enregistré en brouillon, sauf si vous le publiez directement.'}>
      <form onSubmit={submit} noValidate className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
          <div className="grid content-start gap-2">
            <div className="aspect-square max-w-40 overflow-hidden rounded-[14px]"><ProductImage art={art} hue={v.hue} /></div>
            <span className="text-[13px] text-muted">Couleur de la photo</span>
            <div className="flex flex-wrap gap-2">
              {HUES.map((h) => (
                <button key={h} type="button" onClick={() => set('hue', h)} aria-label={`Teinte ${h}`} aria-pressed={v.hue === h}
                  className={cn('size-8 rounded-full border-2', v.hue === h ? 'border-ink' : 'border-transparent')} style={{ background: `hsl(${h} 55% 47%)` }} />
              ))}
            </div>
          </div>
          <div className="grid content-start gap-3">
            <Field label="Nom du produit" htmlFor="pf-name" error={errors.name}>
              <Input id="pf-name" value={v.name} invalid={!!errors.name} onChange={(e) => set('name', e.target.value)} placeholder="Ex. Coussin en lin brodé" autoFocus />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Prix (DH)" htmlFor="pf-price" error={errors.price}>
                <Input id="pf-price" type="number" min={1} inputMode="numeric" value={v.price} invalid={!!errors.price} onChange={(e) => set('price', e.target.value)} className="tabular-nums" />
              </Field>
              <Field label="Prix barré" htmlFor="pf-old" error={errors.oldPrice} optional>
                <Input id="pf-old" type="number" min={1} inputMode="numeric" value={v.oldPrice} invalid={!!errors.oldPrice} onChange={(e) => set('oldPrice', e.target.value)} className="tabular-nums" />
              </Field>
              <Field label="Stock" htmlFor="pf-stock">
                <Input id="pf-stock" type="number" min={0} value={v.stock} onChange={(e) => set('stock', e.target.value)} className="tabular-nums" />
              </Field>
              <Field label="Catégorie" htmlFor="pf-cat">
                <Select id="pf-cat" value={v.category} onChange={(e) => set('category', e.target.value as CategoryId)}>
                  {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </Field>
            </div>
          </div>
        </div>
        <Field label="Description" htmlFor="pf-desc">
          <Textarea id="pf-desc" rows={3} value={v.description} onChange={(e) => set('description', e.target.value)} placeholder="Matière, dimensions, fabrication…" />
        </Field>
        <label className="flex cursor-pointer items-center gap-2.5 text-[14.5px]">
          <input type="checkbox" className="size-5 accent-brand" checked={v.published} onChange={(e) => set('published', e.target.checked)} />Publié dans ma boutique
        </label>
        <div className="flex flex-wrap justify-end gap-2.5">
          <Button variant="ghost" onClick={closeForm}>Annuler</Button>
          <Button type="submit">{editing ? 'Enregistrer les modifications' : 'Enregistrer le produit'}</Button>
        </div>
      </form>
    </Modal>
  )
}
