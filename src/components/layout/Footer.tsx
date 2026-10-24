import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { CATEGORIES } from '../../data/catalog'
import { useShop } from '../../store/shop'
import { toast } from '../../store/toast'
import { Logo } from '../Logo'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

export function Footer({ compact = false }: { compact?: boolean }) {
  const [confirm, setConfirm] = useState(false)
  const reset = useShop((s) => s.reset)
  const navigate = useNavigate()
  const link = 'block py-1 text-sm text-muted hover:text-ink'
  return (
    <footer className="mt-10 border-t border-line bg-surface">
      <div className="container-page">
        {!compact && (
          <div className="grid grid-cols-2 gap-6 py-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="col-span-2 md:col-span-1">
              <Link to="/"><Logo /></Link>
              <p className="mt-2 max-w-[34ch] text-sm text-muted">La marketplace des vendeurs marocains. Des milliers de produits, livrés dans tout le Royaume, payés à la livraison.</p>
            </div>
            <div><h4 className="mb-2 font-sans text-sm font-bold">Acheter</h4>{CATEGORIES.slice(0, 4).map((c) => <Link key={c.id} to={`/catalogue?cat=${c.id}`} className={link}>{c.name}</Link>)}</div>
            <div><h4 className="mb-2 font-sans text-sm font-bold">Vendre</h4><Link to="/vendeur" className={link}>Ouvrir ma boutique</Link><Link to="/vendeur/importer?methode=instagram" className={link}>Importer depuis Instagram</Link><Link to="/vendeur/produits" className={link}>Gérer mes produits</Link></div>
            <div><h4 className="mb-2 font-sans text-sm font-bold">Aide</h4><p className={link}>Livraison et délais</p><p className={link}>Retours sous 14 jours</p><p className={link}>Service client : 05 22 00 00 00</p></div>
          </div>
        )}
        <div className="flex flex-wrap justify-between gap-2.5 border-t border-line py-3.5 text-[13px] text-muted">
          <span>© 2026 Dukan · Prototype de démonstration, toutes les données sont fictives.</span>
          <button type="button" className="font-semibold text-brand" onClick={() => setConfirm(true)}>Réinitialiser le prototype</button>
        </div>
      </div>
      <Modal open={confirm} onClose={() => setConfirm(false)} size="sm" title="Réinitialiser le prototype ?"
        description="Le panier, les commandes et les produits du vendeur reviennent à leur état d’origine."
        footer={<><Button variant="ghost" onClick={() => setConfirm(false)}>Annuler</Button><Button variant="danger" onClick={() => { reset(); setConfirm(false); navigate('/'); toast('Prototype réinitialisé') }}>Réinitialiser</Button></>} />
    </footer>
  )
}
