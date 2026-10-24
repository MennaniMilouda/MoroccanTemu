import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router'
import { Grid2x2, House, Search, ShoppingBag, Store, User } from 'lucide-react'
import { CATEGORIES } from '../../data/catalog'
import { useCartLines } from '../../store/hooks'
import { toast } from '../../store/toast'
import { Logo } from '../Logo'
import { cn } from '../ui/cn'
import { Footer } from './Footer'
import { PrototypeBar } from './PrototypeBar'

function CartBadge({ count, className }: { count: number; className?: string }) {
  if (!count) return null
  return <span className={cn('absolute grid h-[18px] min-w-[18px] place-items-center rounded-full bg-deal px-1 text-[11px] font-bold text-white', className)}>{count}</span>
}

function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const { count } = useCartLines()
  const [q, setQ] = useState(params.get('q') ?? '')
  useEffect(() => { setQ(params.get('q') ?? '') }, [params])

  const onCatalog = pathname === '/catalogue'
  const activeCat = onCatalog ? params.get('cat') : null
  const navItem = (on: boolean, hot = false) => cn('rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap hover:bg-surface-2 hover:text-ink', on ? 'bg-surface-2 text-ink' : hot ? 'text-deal' : 'text-muted')

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface">
      <div className="container-page">
        <div className="flex flex-wrap items-center gap-2.5 py-2.5 md:flex-nowrap md:gap-4 md:py-3">
          <Link to="/" aria-label="Dukan, accueil"><Logo /></Link>
          <form role="search" className="order-3 flex min-w-0 basis-full items-center rounded-full border-[1.5px] border-transparent bg-surface-2 py-1 pr-1 pl-4 focus-within:border-brand focus-within:bg-surface md:order-none md:flex-1 md:basis-auto"
            onSubmit={(e) => { e.preventDefault(); navigate(`/catalogue${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`) }}>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Babouches, huile d’argan, lanterne…" aria-label="Rechercher un produit" className="min-w-0 flex-1 bg-transparent px-1 py-1.5 outline-none" />
            <button type="submit" className="flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-2 font-semibold text-on-brand"><Search className="size-5" /><span className="hidden md:inline">Rechercher</span></button>
          </form>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Link to="/vendeur" className="hidden items-center gap-2 rounded-xl px-2.5 py-2 text-[13px] leading-tight hover:bg-surface-2 md:flex">
              <Store className="size-5" /><span className="hidden lg:block"><span className="text-muted">Vous êtes vendeur ?</span><b className="block text-sm">Vendre sur Dukan</b></span>
            </Link>
            <button type="button" onClick={() => toast('Connexion simulée : aucun compte réel dans ce prototype.', 'info')} className="hidden items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[13px] leading-tight hover:bg-surface-2 md:flex">
              <User className="size-5" /><span className="hidden lg:block"><span className="text-muted">Bonjour</span><b className="block text-sm">Mon compte</b></span>
            </button>
            <Link to="/panier" className="relative grid size-10 place-items-center rounded-full hover:bg-surface-2" aria-label={`Panier, ${count} article${count > 1 ? 's' : ''}`}>
              <ShoppingBag className="size-5" /><CartBadge count={count} className="top-0.5 right-0" />
            </Link>
          </div>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto pb-2" aria-label="Catégories">
          <Link to="/catalogue?promo=1" className={navItem(onCatalog && params.has('promo'), true)}>Ventes flash</Link>
          <Link to="/catalogue" className={navItem(onCatalog && !activeCat && !params.has('promo') && !params.has('vendeur'))}>Tous les produits</Link>
          {CATEGORIES.map((c) => <Link key={c.id} to={`/catalogue?cat=${c.id}`} className={navItem(activeCat === c.id)}>{c.name}</Link>)}
        </nav>
      </div>
    </header>
  )
}

function BottomNav() {
  const { count } = useCartLines()
  const item = ({ isActive }: { isActive: boolean }) => cn('relative grid justify-items-center gap-0.5 p-1 text-[11.5px] font-semibold', isActive ? 'text-brand' : 'text-muted')
  return (
    <nav aria-label="Navigation principale" className="fixed inset-x-0 bottom-0 z-55 grid grid-cols-4 border-t border-line bg-surface px-2 pt-1.5 pb-[calc(6px+env(safe-area-inset-bottom,0px))] md:hidden">
      <NavLink to="/" end className={item}><House className="size-5" />Accueil</NavLink>
      <NavLink to="/catalogue" className={item}><Grid2x2 className="size-5" />Catalogue</NavLink>
      <NavLink to="/panier" className={item}><ShoppingBag className="size-5" />Panier<CartBadge count={count} className="top-0 right-[calc(50%-22px)]" /></NavLink>
      <NavLink to="/vendeur" className={item}><Store className="size-5" />Vendre</NavLink>
    </nav>
  )
}

export function BuyerLayout() {
  return (
    <div className="pb-[calc(68px+env(safe-area-inset-bottom,0px))] md:pb-0">
      <PrototypeBar space="buyer" />
      <Header />
      <main className="min-h-[60vh]"><Outlet /></main>
      <Footer />
      <BottomNav />
    </div>
  )
}
