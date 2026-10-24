import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Banknote, Check, ChevronRight, Instagram, RotateCcw, ShieldCheck, Sparkles, Truck, Zap } from 'lucide-react'
import { ProductCard, ProductGrid, ProductRail } from '../../components/ProductCard'
import { ProductImage } from '../../components/ProductImage'
import { ButtonLink } from '../../components/ui/Button'
import { CATEGORIES, PRODUCTS } from '../../data/catalog'
import { INSTAGRAM_POOL } from '../../data/import'
import { FREE_SHIPPING_FROM } from '../../lib/delivery'
import { useCatalog } from '../../store/hooks'
import { useShop } from '../../store/shop'

const TREND_CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir']
const FLASH_SOLD = [82, 64, 91, 47, 73, 58, 69]

function useCountdownToMidnight() {
  const calc = () => {
    const now = new Date(), end = new Date(now)
    end.setHours(23, 59, 59, 999)
    const s = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000))
    return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, '0'))
  }
  const [t, setT] = useState(calc)
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id) }, [])
  return t
}

function Section({ title, subtitle, link, children }: { title: string; subtitle?: string; link?: { to: string; label: string }; children: ReactNode }) {
  return (
    <section className="container-page py-7">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold sm:text-[28px]">{title}</h2>
          {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
        </div>
        {link && <Link to={link.to} className="inline-flex items-center gap-1 font-semibold whitespace-nowrap text-brand">{link.label}<ChevronRight className="size-4" /></Link>}
      </div>
      {children}
    </section>
  )
}

function Promo({ to, eyebrow, eyebrowClass, title, cta, art, hue, className }: { to: string; eyebrow: string; eyebrowClass: string; title: string; cta: string; art: 'bottle' | 'lantern'; hue: number; className: string }) {
  return (
    <Link to={to} className={`grid min-h-[157px] grid-cols-[1fr_150px] items-center overflow-hidden rounded-3xl ${className}`}>
      <div className="grid gap-1.5 py-5 pl-5.5">
        <span className={`text-xs font-bold tracking-[.09em] uppercase ${eyebrowClass}`}>{eyebrow}</span>
        <h3 className="text-[21px] leading-tight font-bold">{title}</h3>
        <span className="inline-flex items-center gap-1 font-semibold text-brand">{cta}<ChevronRight className="size-4" /></span>
      </div>
      <div className="h-full"><ProductImage art={art} hue={hue} view={2} /></div>
    </Link>
  )
}

export function Home() {
  const catalog = useCatalog()
  const city = useShop((s) => s.city)
  const [h, m, s] = useCountdownToMidnight()
  const flash = PRODUCTS.filter((p) => p.tags.flash)
  const trend = PRODUCTS.filter((p) => p.tags.trend).sort((a, b) => b.sold - a.sold).slice(0, 10)
  const news = catalog.filter((p) => p.tags.new).slice(0, 10)
  const recommended = [...PRODUCTS].sort((a, b) => ((b.rating ?? 0) * (b.reviews ?? 0)) % 97 - ((a.rating ?? 0) * (a.reviews ?? 0)) % 97).slice(0, 12)

  return (
    <>
      <div className="container-page pt-5">
        <section className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <div className="zellige relative grid content-center gap-4.5 overflow-hidden rounded-3xl bg-brand p-6 text-white sm:p-11 lg:min-h-[330px]">
            <span className="inline-flex items-center gap-2 justify-self-start rounded-full bg-white/15 px-3 py-1.5 text-[13px] font-semibold"><Sparkles className="size-4" />Soldes d’automne · du 20 au 31 octobre</span>
            <h1 className="max-w-[520px] text-[32px] leading-[1.05] font-extrabold tracking-[-0.025em] sm:text-[54px]">Le meilleur du Maroc, <em className="text-saffron not-italic">jusqu’à -45 %</em>.</h1>
            <p className="max-w-[520px] text-[17px] opacity-90">Artisanat, mode, beauté et high-tech de vendeurs vérifiés. Payez à la livraison, partout au Royaume.</p>
            <ButtonLink to="/catalogue?promo=1" variant="saffron" className="justify-self-start">Voir les promotions <ArrowRight className="size-5" /></ButtonLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Promo to="/catalogue?cat=beaute" eyebrow="Rituel hammam" eyebrowClass="text-warn" title="Argan, ghassoul et savon noir dès 49 DH" cta="Découvrir" art="bottle" hue={36} className="bg-saffron-soft" />
            <Promo to="/catalogue?cat=decoration" eyebrow="Fait main à Marrakech" eyebrowClass="text-brand" title="Lanternes, tapis et poufs" cta="Explorer la déco" art="lantern" hue={42} className="border border-line bg-surface" />
          </div>
        </section>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {([[Banknote, 'Paiement à la livraison', 'Vous payez en recevant'], [Truck, 'Livraison gratuite', `Dès ${FREE_SHIPPING_FROM} DH d’achat`], [RotateCcw, 'Retours 14 jours', 'Simples et gratuits'], [ShieldCheck, 'Vendeurs vérifiés', 'Identité et adresse contrôlées']] as const).map(([Icon, title, text]) => (
            <div key={title} className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-3 text-[13.5px] leading-tight">
              <Icon className="size-5 flex-none text-brand" /><span><b className="block text-sm">{title}</b>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <Section title="Catégories" link={{ to: '/catalogue', label: 'Tout voir' }}>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/catalogue?cat=${c.id}`} className="group grid justify-items-center gap-2.5 text-center text-[14.5px] font-semibold">
              <span className="aspect-square w-full overflow-hidden rounded-full transition group-hover:-translate-y-1"><ProductImage art={c.art} hue={c.hue} /></span>
              <span>{c.name}<small className="block text-[12.5px] font-medium text-muted">{catalog.filter((p) => p.category === c.id).length} produits</small></span>
            </Link>
          ))}
        </div>
      </Section>

      <section className="container-page pb-7">
        <div className="rounded-3xl border border-line bg-surface p-5">
          <div className="mb-4 flex flex-wrap items-center gap-x-4.5 gap-y-3">
            <h2 className="flex items-center gap-2 text-[26px] font-bold"><Zap className="size-6.5 fill-deal stroke-none" />Ventes flash</h2>
            <div className="flex items-center gap-1 font-bold tabular-nums" aria-label="Fin des ventes flash">
              Fin dans {[h, m, s].map((v, i) => <span key={i} className="flex items-center gap-1">{i > 0 && ':'}<span className="min-w-8 rounded-md bg-ink px-1.5 py-0.5 text-center text-bg">{v}</span></span>)}
            </div>
            <Link to="/catalogue?promo=1" className="ml-auto inline-flex items-center gap-1 font-semibold text-brand">Voir tout<ChevronRight className="size-4" /></Link>
          </div>
          <ProductRail>{flash.map((p, i) => <ProductCard key={p.id} product={p} flashSold={FLASH_SOLD[i % FLASH_SOLD.length]} />)}</ProductRail>
        </div>
      </section>

      <Section title="Tendances au Maroc" subtitle="Les produits les plus commandés cette semaine, ville par ville." link={{ to: '/catalogue?tri=ventes', label: 'Classement complet' }}>
        <ProductRail>{trend.map((p, i) => <ProductCard key={p.id} product={p} rank={{ position: i + 1, city: TREND_CITIES[i % TREND_CITIES.length] }} />)}</ProductRail>
      </Section>

      <Section title="Nouveautés" subtitle="Fraîchement arrivés chez nos vendeurs." link={{ to: '/catalogue?tri=nouveautes', label: 'Voir les nouveautés' }}>
        <ProductRail>{news.map((p) => <ProductCard key={p.id} product={p} />)}</ProductRail>
      </Section>

      <section className="container-page py-7">
        <div className="grid items-center gap-6 overflow-hidden rounded-3xl bg-ink p-6 text-bg sm:p-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="text-xs font-bold tracking-[.09em] text-saffron uppercase">Pour les vendeurs</span>
            <h2 className="mt-2 text-[24px] font-bold sm:text-[34px]">Vous vendez déjà sur Instagram ? Votre boutique Dukan est prête en 2 minutes.</h2>
            <p className="mt-2.5 max-w-[52ch] opacity-80">Collez le lien de votre compte, nous détectons vos produits, vous vérifiez les prix et vous publiez. Sans ressaisir vos photos une par une.</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <ButtonLink to="/vendeur/importer?methode=instagram" variant="saffron"><Instagram className="size-5" />Importer depuis Instagram</ButtonLink>
              <ButtonLink to="/vendeur" variant="ghost" className="border-white/30 text-bg hover:bg-white/10">Découvrir l’espace vendeur</ButtonLink>
            </div>
          </div>
          <div className="grid -rotate-3 grid-cols-3 gap-1.5" aria-hidden="true">
            {INSTAGRAM_POOL.slice(0, 6).map((x, i) => (
              <div key={x.name} className="relative aspect-square overflow-hidden rounded-[10px]">
                <ProductImage art={x.art} hue={x.hue} view={i % 2} />
                {i !== 2 && i !== 4 && <span className="absolute top-1.5 right-1.5 grid size-5.5 place-items-center rounded-full bg-brand text-white"><Check className="size-3.5" /></span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section title="Recommandés pour vous" subtitle={`Sélectionnés selon les tendances à ${city}.`}>
        <ProductGrid>{recommended.map((p) => <ProductCard key={p.id} product={p} />)}</ProductGrid>
        <div className="mt-5 text-center"><ButtonLink to="/catalogue" variant="ghost">Voir tous les produits <ArrowRight className="size-5" /></ButtonLink></div>
      </Section>
    </>
  )
}
