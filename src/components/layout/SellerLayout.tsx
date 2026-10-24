import { Link, NavLink, Outlet } from 'react-router'
import { Box, Eye, LayoutGrid, Upload } from 'lucide-react'
import { MY_SELLER_ID } from '../../data/catalog'
import { ImportMethodsModal } from '../seller/ImportMethodsModal'
import { ProductFormModal } from '../seller/ProductFormModal'
import { Logo } from '../Logo'
import { cn } from '../ui/cn'
import { Footer } from './Footer'
import { PrototypeBar } from './PrototypeBar'

export function SellerLayout() {
  const item = ({ isActive }: { isActive: boolean }) => cn('flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap [&_svg]:size-[18px]', isActive ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-surface-2 hover:text-ink')
  return (
    <div>
      <PrototypeBar space="seller" />
      <header className="sticky top-0 z-50 border-b border-line bg-surface">
        <div className="container-page">
          <div className="flex items-center gap-4 py-3">
            <Link to="/vendeur"><Logo suffix="Espace vendeur" /></Link>
            <div className="ml-auto flex items-center gap-2">
              <Link to={`/catalogue?vendeur=${MY_SELLER_ID}`} className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-bold hover:bg-surface-2"><Eye className="size-5" /><span className="hidden sm:inline">Voir ma boutique</span></Link>
              <span className="grid size-[38px] place-items-center rounded-xl bg-[hsl(250_50%_45%)] font-display text-sm font-extrabold text-white" aria-label="Atelier Nour">AN</span>
            </div>
          </div>
          <nav className="no-scrollbar flex gap-1 overflow-x-auto pb-2" aria-label="Espace vendeur">
            <NavLink to="/vendeur" end className={item}><LayoutGrid />Tableau de bord</NavLink>
            <NavLink to="/vendeur/produits" className={item}><Box />Mes produits</NavLink>
            <NavLink to="/vendeur/importer" className={item}><Upload />Importer</NavLink>
          </nav>
        </div>
      </header>
      <main className="container-page min-h-[60vh] pt-6"><Outlet /></main>
      <Footer compact />
      <ImportMethodsModal />
      <ProductFormModal />
    </div>
  )
}
