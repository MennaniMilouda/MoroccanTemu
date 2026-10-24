import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { BadgeCheck, Eye, MapPin, Plus, Sparkles, TriangleAlert, Upload } from 'lucide-react'
import { ProductImage } from '../../components/ProductImage'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Pill } from '../../components/ui/Pill'
import { MY_SELLER_ID } from '../../data/catalog'
import { SALES_30_DAYS } from '../../data/seller'
import { formatDH, formatNumber, formatRating } from '../../lib/format'
import { useSellerUi } from '../../store/sellerUi'
import { displayStatus, useShop } from '../../store/shop'
import { toast } from '../../store/toast'
import type { OrderStatus, SellerProduct } from '../../types'
import { STATUS_LABEL, STATUS_TONE } from './status'

const ORDER_TONE: Record<OrderStatus, 'warn' | 'brand' | 'ok'> = { 'À préparer': 'warn', 'Expédiée': 'brand', 'Livrée': 'ok' }

function SalesChart() {
  const W = 600, H = 170, pad = 28, max = 2000, bw = (W - pad - 6) / SALES_30_DAYS.length
  const y = (v: number) => H - 22 - (v / max) * (H - 40)
  const last = SALES_30_DAYS.length - 1
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ventes quotidiennes sur 30 jours" className="block h-auto w-full text-[11px]">
      {[0, 500, 1000, 1500, 2000].map((v) => (
        <g key={v}><line x1={pad} x2={W} y1={y(v)} y2={y(v)} stroke="var(--line)" /><text x={0} y={y(v) + 4} fill="var(--muted)">{v ? `${v / 1000}k` : '0'}</text></g>
      ))}
      {SALES_30_DAYS.map((v, i) => (
        <rect key={i} x={pad + i * bw + 2} y={y(v)} width={bw - 4} height={H - 22 - y(v)} rx={3} fill="var(--brand)" opacity={i === last ? 1 : 0.45}><title>{formatDH(v)}</title></rect>
      ))}
      {([[0, '25 sept.', 'start'], [14, '9 oct.', 'middle'], [last, '24 oct.', 'end']] as const).map(([i, label, anchor]) => (
        <text key={label} x={pad + i * bw + bw / 2} y={H - 4} textAnchor={anchor} fill="var(--muted)">{label}</text>
      ))}
    </svg>
  )
}

function MiniRow({ p, action }: { p: SellerProduct; action?: ReactNode }) {
  const st = displayStatus(p)
  return (
    <div className="grid grid-cols-[48px_1fr_auto] items-center gap-3 border-t border-line py-2.5 first:border-0">
      <span className="size-12 overflow-hidden rounded-[10px]"><ProductImage art={p.art} hue={p.hue} image={p.image} /></span>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{p.name}</div>
        <div className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-muted tabular-nums">{formatDH(p.price)} · stock {p.stock} <Pill tone={STATUS_TONE[st]} className="px-1.5 py-0 text-[11.5px]">{STATUS_LABEL[st]}</Pill></div>
      </div>
      {action}
    </div>
  )
}

function Panel({ title, count, link, children, hint }: { title: string; count?: number; link?: { to: string; label: string }; hint?: string; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl border border-line bg-surface p-4.5">
      <div className="mb-3 flex items-center justify-between gap-2.5">
        <h3 className="text-lg font-bold">{title}{count != null && <span className="font-sans text-[15px] font-medium text-muted"> ({count})</span>}</h3>
        {link && <Link to={link.to} className="font-semibold text-brand">{link.label}</Link>}
        {hint && <span className="text-[13px] text-muted">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

export function Dashboard() {
  const { sellerProducts, orders, setStatus } = useShop()
  const { openMethods, openForm } = useSellerUi()
  const published = sellerProducts.filter((p) => p.status === 'published')
  const drafts = sellerProducts.filter((p) => p.status === 'draft')
  const out = published.filter((p) => p.stock <= 0)
  const protoOrders = orders.filter((o) => o.fromPrototype)
  const sales = SALES_30_DAYS.reduce((a, b) => a + b, 0) + protoOrders.reduce((a, o) => a + o.total, 0)
  const pending = orders.filter((o) => o.status === 'À préparer').length

  const kpis = [
    ['Ventes · 30 jours', formatDH(sales), '+12 % vs mois dernier'],
    ['Commandes', String(64 + protoOrders.length), '+8 commandes'],
    ['Visites de la boutique', formatNumber(3210), '+21 % via Instagram'],
    ['Produits en ligne', String(published.length), `${drafts.length} en brouillon`],
  ]

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3.5">
        <div>
          <h1 className="text-[26px] font-bold sm:text-[34px]">Bonjour Nour</h1>
          <p className="mt-1 text-muted">Atelier Nour · Marrakech · {pending} commande{pending > 1 ? 's' : ''} à préparer aujourd’hui</p>
        </div>
        <Button variant="ghost" onClick={() => openForm()}><Plus className="size-5" />Ajouter un produit</Button>
      </div>

      <section className="zellige grid items-center gap-5 overflow-hidden rounded-[22px] bg-brand p-5 text-white sm:p-7 md:grid-cols-[1fr_auto]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/18 px-2.5 py-0.5 text-[12.5px] font-semibold"><Sparkles className="size-3.5" />Gagnez du temps</span>
          <h2 className="mt-2.5 text-[21px] font-bold sm:text-[27px]">Importez vos produits depuis Instagram, un fichier ou votre boutique</h2>
          <p className="mt-1.5 max-w-[58ch] opacity-85">Dukan détecte les photos, les noms et les prix de vos publications. Vous vérifiez, vous publiez.</p>
        </div>
        <Button variant="saffron" size="lg" onClick={openMethods} className="justify-self-start"><Upload className="size-5" />Importer mes produits</Button>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {kpis.map(([label, value, delta], i) => (
          <div key={label} className="grid gap-1 rounded-2xl border border-line bg-surface px-4.5 py-4">
            <span className="text-[13.5px] font-medium text-muted">{label}</span>
            <span className="font-display text-[22px] font-extrabold tracking-[-0.02em] tabular-nums sm:text-[27px]">{value}</span>
            <span className={`text-[13px] font-semibold ${i === 3 ? 'text-muted' : 'text-ok'}`}>{delta}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="grid min-w-0 gap-4">
          <Panel title="Ventes quotidiennes" hint="Données fictives · en DH"><SalesChart /></Panel>
          <Panel title="Dernières commandes" hint={`${orders.length} commandes`}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead><tr className="text-left text-[12.5px] text-muted">{['N°', 'Client', 'Produit', 'Montant', 'Statut'].map((h) => <th key={h} className="border-b border-line py-2 pr-2.5 font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {orders.slice(0, 7).map((o) => (
                    <tr key={o.no} className="border-b border-line last:border-0">
                      <td className="py-2.5 pr-2.5 whitespace-nowrap tabular-nums">{o.no}</td>
                      <td className="py-2.5 pr-2.5 whitespace-nowrap">{o.customer}<div className="text-[13px] text-muted">{o.city} · {o.date}</div></td>
                      <td className="min-w-40 py-2.5 pr-2.5">{o.item}</td>
                      <td className="py-2.5 pr-2.5 font-bold whitespace-nowrap tabular-nums">{formatDH(o.total)}</td>
                      <td className="py-2.5"><Pill tone={ORDER_TONE[o.status]}>{o.status}</Pill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="grid min-w-0 gap-4">
          {out.length > 0 && (
            <div className="flex items-start gap-2.5 rounded-xl bg-warn-soft px-3.5 py-3 text-sm text-warn">
              <TriangleAlert className="mt-0.5 size-5 flex-none" />
              <div><b className="block">{out.length} produit{out.length > 1 ? 's' : ''} en rupture de stock</b>{out.map((p) => p.name).join(', ')} n’apparaît plus comme disponible. <Link to="/vendeur/produits?onglet=rupture" className="font-semibold text-brand">Réapprovisionner</Link></div>
            </div>
          )}
          <Panel title="Brouillons" count={drafts.length} link={{ to: '/vendeur/produits?onglet=brouillons', label: 'Gérer' }}>
            {drafts.length ? drafts.slice(0, 4).map((p) => (
              <MiniRow key={p.id} p={p} action={<Button variant="soft" size="sm" onClick={() => { setStatus([p.id], 'published'); toast(`« ${p.name} » est en ligne`) }}>Publier</Button>} />
            )) : <p className="text-[13px] text-muted">Aucun brouillon. Les produits importés arrivent ici avant publication.</p>}
          </Panel>
          <Panel title="Produits publiés" count={published.length} link={{ to: '/vendeur/produits?onglet=publies', label: 'Voir tout' }}>
            {published.length ? published.slice(0, 4).map((p) => <MiniRow key={p.id} p={p} />) : <p className="text-[13px] text-muted">Aucun produit publié pour le moment.</p>}
          </Panel>
          <Panel title="Aperçu de la boutique">
            <div className="overflow-hidden rounded-[14px] border border-line">
              <div className="h-21"><ProductImage art="rug" hue={250} view={1} /></div>
              <div className="relative -mt-6.5 flex items-end gap-3 px-3.5">
                <span className="grid size-13 place-items-center rounded-[14px] border-3 border-surface bg-[hsl(250_50%_45%)] font-display text-lg font-extrabold text-white">AN</span>
                <div className="pb-0.5">
                  <h4 className="flex items-center gap-1 text-[17px] font-bold">Atelier Nour<BadgeCheck className="size-4 text-brand" /></h4>
                  <div className="flex items-center gap-1 text-[13px] text-muted"><MapPin className="size-3.5" />Marrakech · {formatRating(4.9)} ★ · {published.length} produits</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-3.5">
                {published.slice(0, 3).map((p) => <div key={p.id} className="aspect-square overflow-hidden rounded-[9px]"><ProductImage art={p.art} hue={p.hue} image={p.image} /></div>)}
              </div>
            </div>
            <ButtonLink to={`/catalogue?vendeur=${MY_SELLER_ID}`} variant="ghost" className="mt-3 w-full"><Eye className="size-5" />Voir ma boutique comme un acheteur</ButtonLink>
          </Panel>
        </div>
      </div>
    </>
  )
}
