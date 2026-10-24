import { useNavigate } from 'react-router'
import { cn } from '../ui/cn'

/** Thin strip that makes the prototype status explicit and switches between buyer and seller spaces. */
export function PrototypeBar({ space }: { space: 'buyer' | 'seller' }) {
  const navigate = useNavigate()
  const item = (on: boolean) => cn('rounded-full px-3 py-1 text-[13px] font-semibold', on && 'bg-bg text-ink')
  return (
    <div className="bg-ink text-[13px] text-bg">
      <div className="container-page flex items-center justify-between gap-3 py-1.5">
        <span>
          <b className="text-[11.5px] font-bold tracking-[.06em] text-saffron uppercase">Prototype</b>
          <span className="hidden sm:inline"> · données fictives, aucun paiement ni connexion réelle</span>
        </span>
        <div className="inline-flex rounded-full bg-white/12 p-[3px]" role="group" aria-label="Changer d’espace">
          <button type="button" className={item(space === 'buyer')} onClick={() => navigate('/')}>Acheteur</button>
          <button type="button" className={item(space === 'seller')} onClick={() => navigate('/vendeur')}>Vendeur</button>
        </div>
      </div>
    </div>
  )
}
