import { useState, type FormEvent, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Banknote, Check } from 'lucide-react'
import { ProductImage } from '../../components/ProductImage'
import { Button } from '../../components/ui/Button'
import { Field, Input, Select } from '../../components/ui/Field'
import { Spinner } from '../../components/ui/Spinner'
import { cn } from '../../components/ui/cn'
import { CITIES, MY_SELLER_ID, SELLERS } from '../../data/catalog'
import { deliveryWindow, FREE_SHIPPING_FROM, SHIPPING_EXPRESS, SHIPPING_STANDARD, shippingCost } from '../../lib/delivery'
import { formatDH } from '../../lib/format'
import { useCartLines } from '../../store/hooks'
import { useShop } from '../../store/shop'
import { toast } from '../../store/toast'
import { OrderSummary } from './OrderSummary'

const PHONE_RE = /^(\+212|00212|0)[5-7]\d{8}$/

export function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ['Panier', 'Livraison', 'Confirmation']
  return (
    <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted">
      {steps.map((s, i) => {
        const n = i + 1, done = n < current, on = n === current
        return (
          <li key={s} className="flex items-center gap-2">
            {i > 0 && <span className="h-[1.5px] w-7 bg-line" />}
            <span className={cn('grid size-6.5 place-items-center rounded-full border-[1.5px] text-[13px]', done ? 'border-ok bg-ok text-white' : on ? 'border-ink bg-ink text-bg' : 'border-line')}>
              {done ? <Check className="size-3.5" strokeWidth={3} /> : n}
            </span>
            <span className={on || done ? 'text-ink' : ''}>{s}</span>
          </li>
        )
      })}
    </ol>
  )
}

function RadioCard({ name, value, checked, onChange, disabled, children, right }: {
  name: string; value: string; checked: boolean; onChange: () => void; disabled?: boolean; children: ReactNode; right?: ReactNode
}) {
  return (
    <label className={cn('flex items-start gap-3 rounded-xl border-[1.5px] p-3.5', checked ? 'border-brand bg-brand-soft' : 'border-line bg-surface', disabled ? 'cursor-not-allowed opacity-55' : 'cursor-pointer')}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} className="mt-1 accent-brand" />
      <div className="text-[14.5px]">{children}</div>
      {right && <span className="ml-auto font-bold whitespace-nowrap">{right}</span>}
    </label>
  )
}

export function Checkout() {
  const { lines, subtotal } = useCartLines()
  const { city: savedCity, placeOrder } = useShop()
  const navigate = useNavigate()
  const [v, setV] = useState({ name: '', phone: '', city: savedCity, district: '', address: '', note: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [express, setExpress] = useState(false)
  const [sending, setSending] = useState(false)

  if (!lines.length && !sending) return <Navigate to="/panier" replace />

  const set = (k: keyof typeof v, value: string) => { setV((s) => ({ ...s, [k]: value })); setErrors((e) => ({ ...e, [k]: '' })) }
  const firstSeller = SELLERS[lines[0]?.product.sellerId ?? 'fes']

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const phone = v.phone.replace(/[\s.-]/g, '')
    const errs: Record<string, string> = {}
    if (v.name.trim().split(/\s+/).length < 2 || v.name.trim().length < 4) errs.name = 'Indiquez votre prénom et votre nom.'
    if (!PHONE_RE.test(phone)) errs.phone = 'Numéro marocain attendu, par exemple 06 12 34 56 78.'
    if (v.address.trim().length < 6) errs.address = 'Précisez l’adresse : numéro, rue ou résidence.'
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) { document.getElementById(`co-${first}`)?.focus(); toast('Vérifiez les champs signalés en rouge', 'error'); return }

    setSending(true)
    // Simulated network delay: no order is actually sent anywhere.
    setTimeout(() => {
      const no = 'DK-' + (48300 + Math.floor(Math.random() * 600))
      const total = subtotal + shippingCost(subtotal, express)
      const mine = lines.filter((l) => l.product.sellerId === MY_SELLER_ID)
      const [first = '', last = ''] = v.name.trim().split(/\s+/)
      placeOrder(
        { no, name: v.name.trim(), phone: v.phone, address: v.address.trim(), city: v.city, express, total,
          lines: lines.map((l) => ({ name: l.product.name, price: l.product.price, qty: l.qty, art: l.product.art, hue: l.hue, image: l.product.image })) },
        mine.length ? { no, customer: `${first} ${last[0] ?? ''}.`, city: v.city, item: mine.map((l) => l.product.name + (l.qty > 1 ? ` (×${l.qty})` : '')).join(', '),
          total: mine.reduce((a, l) => a + l.product.price * l.qty, 0), status: 'À préparer', date: 'À l’instant', fromPrototype: true } : null,
        mine.map((l) => [l.product.id, l.qty]),
      )
      navigate('/commande/confirmation', { replace: true })
    }, 900)
  }

  const section = 'grid gap-3.5 rounded-2xl border border-line bg-surface px-4.5 py-4'
  return (
    <div className="container-page">
      <div className="pt-5"><Steps current={2} /></div>
      <form onSubmit={submit} noValidate className="grid items-start gap-6 pt-4 lg:grid-cols-[minmax(0,1fr)_370px]">
        <div className="grid min-w-0 gap-4">
          <section className={section}>
            <h2 className="text-xl font-bold">Vos coordonnées</h2>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Nom complet" htmlFor="co-name" error={errors.name}><Input id="co-name" autoComplete="name" placeholder="Ex. Salma Bennani" value={v.name} invalid={!!errors.name} onChange={(e) => set('name', e.target.value)} /></Field>
              <Field label="Téléphone" htmlFor="co-phone" error={errors.phone}><Input id="co-phone" type="tel" autoComplete="tel" placeholder="06 12 34 56 78" value={v.phone} invalid={!!errors.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
            </div>
          </section>
          <section className={section}>
            <h2 className="text-xl font-bold">Adresse de livraison</h2>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label="Ville" htmlFor="co-city"><Select id="co-city" value={v.city} onChange={(e) => set('city', e.target.value)}>{CITIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
              <Field label="Quartier" htmlFor="co-district" optional><Input id="co-district" placeholder="Ex. Maârif" value={v.district} onChange={(e) => set('district', e.target.value)} /></Field>
              <Field label="Adresse" htmlFor="co-address" error={errors.address} className="sm:col-span-2"><Input id="co-address" autoComplete="street-address" placeholder="N°, rue, immeuble, étage" value={v.address} invalid={!!errors.address} onChange={(e) => set('address', e.target.value)} /></Field>
              <Field label="Instructions pour le livreur" htmlFor="co-note" optional className="sm:col-span-2"><Input id="co-note" placeholder="Ex. appeler avant de passer" value={v.note} onChange={(e) => set('note', e.target.value)} /></Field>
            </div>
          </section>
          <section className={section}>
            <h2 className="text-xl font-bold">Mode de livraison</h2>
            <RadioCard name="ship" value="std" checked={!express} onChange={() => setExpress(false)} right={subtotal >= FREE_SHIPPING_FROM ? 'Gratuite' : formatDH(SHIPPING_STANDARD)}>
              <b>Standard</b><div className="text-[13px] text-muted">Livré {deliveryWindow(firstSeller.city, v.city)} par notre partenaire</div>
            </RadioCard>
            <RadioCard name="ship" value="exp" checked={express} onChange={() => setExpress(true)} right={formatDH(SHIPPING_EXPRESS)}>
              <b>Express 24 h</b><div className="text-[13px] text-muted">Commande avant 14 h, livrée demain</div>
            </RadioCard>
          </section>
          <section className={section}>
            <h2 className="text-xl font-bold">Paiement</h2>
            <RadioCard name="pay" value="cod" checked onChange={() => {}} right={<Banknote className="size-5" />}>
              <b>Paiement à la livraison</b><div className="text-[13px] text-muted">Vous payez en espèces au livreur à réception.</div>
            </RadioCard>
            <RadioCard name="pay" value="card" checked={false} onChange={() => {}} disabled>
              <b>Carte bancaire</b><div className="text-[13px] text-muted">Bientôt disponible. Aucun paiement réel dans ce prototype.</div>
            </RadioCard>
          </section>
        </div>
        <aside className="grid gap-3 rounded-2xl border border-line bg-surface px-4.5 py-4 lg:sticky lg:top-32">
          <h2 className="text-xl font-bold">Votre commande</h2>
          <div className="grid gap-2.5">
            {lines.map((l) => (
              <div key={l.key} className="grid grid-cols-[52px_1fr_auto] items-center gap-2.5 text-[13.5px]">
                <span className="relative size-13 overflow-hidden rounded-[9px]"><ProductImage art={l.product.art} hue={l.hue} image={l.product.image} /><span className="absolute top-0 right-0 rounded-bl-lg bg-ink px-1.5 text-[11px] font-bold text-bg">×{l.qty}</span></span>
                <span className="min-w-0">{l.product.name}</span><b className="tabular-nums">{formatDH(l.product.price * l.qty)}</b>
              </div>
            ))}
          </div>
          <div className="border-t border-line pt-3"><OrderSummary express={express} /></div>
          <Button type="submit" size="lg" disabled={sending}>{sending ? <><Spinner />Validation…</> : 'Confirmer la commande'}</Button>
          <p className="text-center text-[13px] text-muted">Commande fictive : rien ne sera débité ni livré.</p>
        </aside>
      </form>
    </div>
  )
}
