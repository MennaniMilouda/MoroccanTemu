import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { ChevronRight, FileSpreadsheet, Instagram, PenLine } from 'lucide-react'
import { useSellerUi } from '../../store/sellerUi'
import { Modal } from '../ui/Modal'
import { Pill } from '../ui/Pill'
import { cn } from '../ui/cn'

function Method({ icon, iconClass, title, badge, text, onClick, recommended }: {
  icon: ReactNode; iconClass: string; title: string; badge?: string; text: string; onClick: () => void; recommended?: boolean
}) {
  return (
    <button type="button" onClick={onClick} className={cn('grid w-full grid-cols-[auto_1fr_auto] items-center gap-3.5 rounded-2xl border-[1.5px] bg-surface p-4 text-left transition hover:border-brand hover:bg-brand-soft', recommended ? 'border-brand' : 'border-line')}>
      <span className={cn('grid size-12 place-items-center rounded-[14px] [&_svg]:size-6', iconClass)}>{icon}</span>
      <span>
        <span className="flex flex-wrap items-center gap-2 text-base font-bold">{title}{badge && <Pill>{badge}</Pill>}</span>
        <span className="mt-0.5 block text-[13.5px] text-muted">{text}</span>
      </span>
      <ChevronRight className="size-5 text-muted" />
    </button>
  )
}

export function ImportMethodsModal() {
  const { methodsOpen, closeMethods, openForm } = useSellerUi()
  const navigate = useNavigate()
  const go = (methode: string) => { closeMethods(); navigate(`/vendeur/importer?methode=${methode}`) }
  return (
    <Modal open={methodsOpen} onClose={closeMethods} title="Comment voulez-vous importer vos produits ?"
      description="Choisissez la méthode la plus simple pour vous. Vous pourrez tout vérifier avant publication.">
      <Method recommended onClick={() => go('instagram')} icon={<Instagram />} iconClass="bg-gradient-to-tr from-amber-400 via-pink-600 to-purple-700 text-white"
        title="Importer depuis Instagram" badge="Recommandé" text="Collez le lien de votre compte, nous détectons vos produits. Environ 2 minutes." />
      <Method onClick={() => go('fichier')} icon={<FileSpreadsheet />} iconClass="bg-ok-soft text-ok"
        title="Importer depuis un fichier" text="Un fichier CSV exporté de votre boutique ou d’un tableur." />
      <Method onClick={() => openForm()} icon={<PenLine />} iconClass="bg-surface-2"
        title="Ajouter des produits manuellement" text="Remplissez une fiche produit, idéal pour quelques articles." />
    </Modal>
  )
}
