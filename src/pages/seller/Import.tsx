import { useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Check, ChevronRight, FileSpreadsheet, Heart, Info, Instagram, MapPin, PenLine, Search, TriangleAlert, Upload, WandSparkles } from 'lucide-react'
import { ProductImage } from '../../components/ProductImage'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Field'
import { Pill } from '../../components/ui/Pill'
import { Spinner } from '../../components/ui/Spinner'
import { cn } from '../../components/ui/cn'
import { CATEGORIES } from '../../data/catalog'
import { SAMPLE_CSV } from '../../data/import'
import { parseProductsCsv } from '../../lib/csv'
import { plural } from '../../lib/format'
import { parseInstagramAccount, simulateInstagramAnalysis, type InstagramProfile, type ParseError } from '../../lib/instagram'
import { useSellerUi } from '../../store/sellerUi'
import { useShop } from '../../store/shop'
import { toast } from '../../store/toast'
import type { CategoryId, ImportCandidate, SellerProduct } from '../../types'

type Method = 'instagram' | 'fichier'
type Step = 'input' | 'loading' | 'results' | 'empty' | 'success'

const LOADING_STEPS: Record<Method, string[]> = {
  instagram: ['Lecture du profil public', 'Analyse des 24 dernières publications', 'Repérage des prix dans les légendes', 'Classement par catégorie'],
  fichier: ['Lecture du fichier', 'Reconnaissance des colonnes', 'Vérification des prix'],
}

const igGradient = 'bg-gradient-to-tr from-amber-400 via-pink-600 to-purple-700 text-white'

function StepIndicator({ method, step }: { method: Method; step: Step }) {
  const names = method === 'fichier' ? ['Fichier', 'Lecture', 'Sélection', 'Terminé'] : ['Compte', 'Analyse', 'Sélection', 'Terminé']
  const idx = { input: 0, loading: 1, results: 2, empty: 2, success: 3 }[step]
  const all = ['Méthode', ...names]
  return (
    <ol className="mb-4.5 flex flex-wrap gap-1.5">
      {all.map((n, i) => {
        const done = i <= idx, on = i === idx + 1
        return (
          <li key={n} className={cn('flex items-center gap-2 rounded-full border bg-surface py-1.5 pr-3 pl-2 text-[13.5px] font-semibold', on ? 'border-ink text-ink' : 'border-line text-muted')}>
            <i className={cn('grid size-5.5 place-items-center rounded-full text-xs not-italic', done ? 'bg-ok text-white' : on ? 'bg-ink text-bg' : 'bg-surface-2')}>
              {done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
            </i>{n}
          </li>
        )
      })}
    </ol>
  )
}

function ErrorBox({ error, id }: { error: ParseError; id?: string }) {
  return (
    <div id={id} role="alert" className="flex items-start gap-2.5 rounded-xl bg-danger-soft px-3.5 py-3 text-sm text-danger">
      <TriangleAlert className="mt-0.5 size-5 flex-none" /><div><b className="block">{error.title}</b>{error.detail}</div>
    </div>
  )
}

function Loading({ method, title, onDone }: { method: Method; title: string; onDone: () => void }) {
  const steps = LOADING_STEPS[method]
  const [current, setCurrent] = useState(0)
  const done = useRef(onDone)
  done.current = onDone
  useEffect(() => {
    if (current > steps.length) return
    const t = setTimeout(() => (current === steps.length ? done.current() : setCurrent((c) => c + 1)), current === 0 ? 80 : 700 + Math.random() * 250)
    return () => clearTimeout(t)
  }, [current, steps.length])
  return (
    <div className="mx-auto grid max-w-[660px] gap-4 rounded-[22px] border border-line bg-surface p-7" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className={cn('grid size-11.5 place-items-center rounded-2xl [&_svg]:size-6', method === 'instagram' ? igGradient : 'bg-ok text-white')}>{method === 'instagram' ? <Instagram /> : <FileSpreadsheet />}</span>
        <div><h3 className="text-[19px] font-bold">{title}</h3><p className="text-[13px] text-muted">Cela prend quelques secondes</p></div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <i className="block h-full rounded-full bg-gradient-to-r from-pink-600 to-brand transition-[width] duration-500" style={{ width: `${(Math.min(current, steps.length) / steps.length) * 100}%` }} />
      </div>
      <ul className="grid gap-2 text-sm">
        {steps.map((s, i) => {
          const state = i < current - 1 ? 'done' : i === current - 1 ? 'current' : 'todo'
          return (
            <li key={s} className={cn('flex items-center gap-2.5', state === 'todo' ? 'text-muted' : 'text-ink')}>
              <span className={cn('grid size-5 place-items-center rounded-full border-2', state === 'done' ? 'border-ok bg-ok text-white' : state === 'current' ? 'animate-spin border-brand border-t-transparent' : 'border-line')}>
                {state === 'done' && <Check className="size-3" strokeWidth={3} />}
              </span>{s}
            </li>
          )
        })}
      </ul>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="aspect-square animate-shimmer rounded-xl bg-[linear-gradient(90deg,var(--surface-2)_25%,var(--line)_50%,var(--surface-2)_75%)] bg-[length:200%_100%]" />)}
      </div>
    </div>
  )
}

function CandidateCard({ c, index, invalid, showLikes, onChange }: {
  c: ImportCandidate; index: number; invalid: boolean; showLikes: boolean; onChange: (patch: Partial<ImportCandidate>) => void
}) {
  const label = 'text-xs font-semibold text-muted'
  return (
    <article className={cn('flex min-w-0 flex-col overflow-hidden rounded-2xl border-2 bg-surface transition', invalid ? 'border-danger' : c.selected ? 'border-brand' : 'border-line opacity-75')}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <ProductImage art={c.art} hue={c.hue} image={c.image} view={index % 2} />
        <label className="absolute top-2.5 left-2.5 grid cursor-pointer place-items-center rounded-[9px] bg-surface p-1.5 shadow" title="Sélectionner">
          <input type="checkbox" className="size-5 accent-brand" checked={c.selected} onChange={(e) => onChange({ selected: e.target.checked })} aria-label={`Sélectionner ${c.name}`} />
        </label>
        {showLikes && c.likes != null && <span className="absolute right-2.5 bottom-2.5 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-xs font-semibold text-white"><Heart className="size-3 fill-white stroke-none" />{c.likes}</span>}
      </div>
      <div className="grid gap-2.5 p-3">
        {/* captions are fixed mock data (or escaped CSV text) with <b> price highlights */}
        <p className="line-clamp-3 rounded-[9px] bg-surface-2 px-2.5 py-2 text-[12.5px] leading-snug text-muted [&_b]:text-ink" dangerouslySetInnerHTML={{ __html: c.caption }} />
        <div className="grid gap-1"><label className={label} htmlFor={`cn-${index}`}>Nom du produit</label>
          <Input id={`cn-${index}`} value={c.name} onChange={(e) => onChange({ name: e.target.value })} className="py-2 text-sm" invalid={invalid && c.name.trim().length < 3} /></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-1"><label className={label} htmlFor={`cp-${index}`}>Prix (DH)</label>
            <Input id={`cp-${index}`} type="number" min={1} inputMode="numeric" value={c.price || ''} onChange={(e) => onChange({ price: Number(e.target.value) })} className="py-2 text-sm tabular-nums" invalid={invalid && !(c.price > 0)} /></div>
          <div className="grid gap-1"><label className={label} htmlFor={`cc-${index}`}>Catégorie</label>
            <Select id={`cc-${index}`} value={c.category} onChange={(e) => onChange({ category: e.target.value as CategoryId })} className="py-2 text-sm">
              {CATEGORIES.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </Select></div>
        </div>
        <div>{c.priceSource === 'caption' ? <Pill tone="ok"><Check />Prix trouvé dans la légende</Pill> : <Pill tone="warn"><TriangleAlert />Prix suggéré, à vérifier</Pill>}</div>
      </div>
    </article>
  )
}

export function Import() {
  const [params, setParams] = useSearchParams()
  const method: Method = params.get('methode') === 'fichier' ? 'fichier' : 'instagram'
  const navigate = useNavigate()
  const { addSellerProducts, setStatus } = useShop()
  const openForm = useSellerUi((s) => s.openForm)

  const [step, setStep] = useState<Step>('input')
  const [url, setUrl] = useState('')
  const [error, setError] = useState<ParseError | null>(null)
  const [profile, setProfile] = useState<InstagramProfile | null>(null)
  const [file, setFile] = useState<{ name: string; skipped: number } | null>(null)
  const [candidates, setCandidates] = useState<ImportCandidate[]>([])
  const [invalid, setInvalid] = useState<number[]>([])
  const [importing, setImporting] = useState(false)
  const [created, setCreated] = useState<SellerProduct[]>([])
  const pending = useRef<() => void>(() => {})

  const restart = (m: Method = method) => {
    setStep('input'); setError(null); setUrl(''); setCandidates([]); setInvalid([]); setCreated([]); setProfile(null); setFile(null)
    if (m !== method) setParams({ methode: m })
    window.scrollTo({ top: 0 })
  }
  useEffect(() => { restart(method) }, [method]) // eslint-disable-line react-hooks/exhaustive-deps

  const analyze = (raw: string) => {
    const r = parseInstagramAccount(raw)
    if ('error' in r) { setError(r.error); document.getElementById('ig-url')?.focus(); return }
    setError(null)
    const result = simulateInstagramAnalysis(r.handle)
    setProfile(result)
    pending.current = () => {
      setCandidates(result.candidates)
      setStep(result.candidates.length ? 'results' : 'empty')
      if (result.candidates.length) toast(`${result.candidates.length} produits détectés sur @${result.handle}`, 'info')
    }
    setStep('loading')
  }

  const readCsv = (text: string, name: string) => {
    const r = parseProductsCsv(text)
    if ('error' in r) { setError(r.error); return }
    setError(null)
    setFile({ name, skipped: r.skipped })
    pending.current = () => { setCandidates(r.candidates); setStep('results') }
    setStep('loading')
  }
  const readFile = (f?: File) => { if (f) f.text().then((t) => readCsv(t, f.name)) }

  const patch = (i: number, p: Partial<ImportCandidate>) => {
    setCandidates((cs) => cs.map((c, k) => (k === i ? { ...c, ...p } : c)))
    setInvalid((v) => v.filter((k) => k !== i))
  }
  const selectedCount = candidates.filter((c) => c.selected).length

  const doImport = () => {
    const bad = candidates.flatMap((c, i) => (c.selected && (c.name.trim().length < 3 || !(c.price > 0)) ? [i] : []))
    setInvalid(bad)
    if (bad.length) { toast(`${plural(bad.length, 'produit')} sans nom ou sans prix valide. Corrigez-les ou décochez-les.`, 'error'); return }
    setImporting(true)
    setTimeout(() => {
      const items = candidates.filter((c) => c.selected).map((c) => ({
        name: c.name.trim(), category: c.category, price: Math.round(c.price), oldPrice: null, art: c.art, hue: c.hue, image: c.image,
        stock: c.stock ?? 5, status: 'draft' as const, source: method === 'instagram' ? 'instagram' as const : 'fichier' as const,
        description: c.caption.replace(/<[^>]+>/g, ''),
      }))
      setCreated(addSellerProducts(items))
      setImporting(false)
      setStep('success')
      window.scrollTo({ top: 0 })
      toast(`${plural(items.length, 'produit ajouté', 'produits ajoutés')} aux brouillons`)
    }, 1100)
  }

  const publishAll = () => {
    setStatus(created.map((p) => p.id), 'published')
    toast(`${plural(created.length, 'produit publié', 'produits publiés')} dans votre boutique`)
    navigate('/vendeur/produits')
  }

  const card = 'mx-auto grid max-w-[660px] gap-4.5 rounded-[22px] border border-line bg-surface p-5 sm:p-8'
  const methodChip = (on: boolean) => cn('inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium [&_svg]:size-4', on ? 'border-ink bg-ink text-bg' : 'border-line bg-surface')

  return (
    <>
      <nav className="mb-2.5 flex items-center gap-1.5 text-[13.5px] text-muted" aria-label="Fil d’Ariane">
        <Link to="/vendeur" className="hover:text-ink">Tableau de bord</Link><ChevronRight className="size-4" /><span>Importer mes produits</span>
      </nav>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3.5">
        <div>
          <h1 className="text-[26px] font-bold sm:text-[34px]">Importer mes produits</h1>
          <p className="mt-1 text-muted">{method === 'instagram' ? 'Depuis votre compte Instagram professionnel' : 'Depuis un fichier CSV ou un export de votre boutique'}</p>
        </div>
        {step === 'input' && (
          <div className="flex flex-wrap gap-2">
            <button type="button" className={methodChip(method === 'instagram')} onClick={() => setParams({ methode: 'instagram' })}><Instagram />Instagram</button>
            <button type="button" className={methodChip(method === 'fichier')} onClick={() => setParams({ methode: 'fichier' })}><FileSpreadsheet />Fichier</button>
            <button type="button" className={methodChip(false)} onClick={() => openForm()}><PenLine />Manuel</button>
          </div>
        )}
      </div>
      <StepIndicator method={method} step={step} />

      {method === 'instagram' && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-dashed border-saffron bg-saffron-soft px-3.5 py-3 text-sm">
          <Info className="mt-0.5 size-5 flex-none text-warn" />
          <div><b>Simulation de prototype.</b> Aucune connexion à Instagram n’est établie : les produits « détectés » sont fictifs et servent uniquement à tester le parcours.</div>
        </div>
      )}

      {step === 'input' && method === 'instagram' && (
        <div className={card}>
          <span className={cn('grid size-14 place-items-center rounded-2xl', igGradient)}><Instagram className="size-7.5" /></span>
          <div>
            <h2 className="text-[22px] font-bold sm:text-[28px]">Collez le lien de votre compte Instagram</h2>
            <p className="mt-1.5 text-muted">Nous analysons vos dernières publications pour retrouver les photos, les noms et les prix de vos produits.</p>
          </div>
          <form noValidate className="grid gap-2.5" onSubmit={(e: FormEvent) => { e.preventDefault(); analyze(url) }}>
            <label className="text-sm font-semibold" htmlFor="ig-url">Adresse du compte</label>
            <div className="flex flex-wrap gap-2">
              <div className={cn('flex min-w-56 flex-1 items-center gap-2 rounded-xl border-[1.5px] bg-surface px-3', error ? 'border-danger ring-3 ring-danger-soft' : 'border-line focus-within:border-brand focus-within:ring-3 focus-within:ring-brand-soft')}>
                <Instagram className="size-5 text-muted" />
                <input id="ig-url" value={url} onChange={(e) => { setUrl(e.target.value); setError(null) }} placeholder="https://instagram.com/votre.boutique"
                  autoComplete="off" spellCheck={false} aria-invalid={!!error || undefined} aria-describedby={error ? 'ig-err' : undefined} className="min-w-0 flex-1 bg-transparent py-3 outline-none" />
              </div>
              <Button type="submit" size="lg"><WandSparkles className="size-5" />Analyser le compte</Button>
            </div>
            {error && <ErrorBox error={error} id="ig-err" />}
            <div className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
              Essayer :
              {[['https://instagram.com/atelier.nour', 'instagram.com/atelier.nour'], ['@dar_zellige_mk', '@dar_zellige_mk'], ['instagram.com/boutique_vide', 'compte sans produits'], ['facebook.com/atelier', 'lien invalide']].map(([v, l]) => (
                <button key={v} type="button" onClick={() => { setUrl(v); analyze(v) }} className="rounded-full border border-dashed border-line bg-surface-2 px-2.5 py-1 hover:border-brand hover:text-brand">{l}</button>
              ))}
            </div>
          </form>
          <div className="grid gap-2.5 border-t border-line pt-4 sm:grid-cols-3">
            {[['Analyse', 'Lecture des publications et des légendes'], ['Vérification', 'Vous corrigez noms, prix et catégories'], ['Brouillons', 'Rien n’est publié sans votre accord']].map(([t, d], i) => (
              <div key={t} className="grid gap-1 text-[13px] text-muted"><i className="font-display text-lg font-extrabold text-brand not-italic">{i + 1}</i><b className="text-sm text-ink">{t}</b>{d}</div>
            ))}
          </div>
        </div>
      )}

      {step === 'input' && method === 'fichier' && (
        <div className={card}>
          <span className="grid size-14 place-items-center rounded-2xl bg-ok text-white"><FileSpreadsheet className="size-7.5" /></span>
          <div>
            <h2 className="text-[22px] font-bold sm:text-[28px]">Importer depuis un fichier</h2>
            <p className="mt-1.5 text-muted">Un fichier CSV avec une ligne par produit. Les colonnes reconnues : nom, prix, categorie, stock.</p>
          </div>
          <FileDrop onFile={readFile} />
          {error && <ErrorBox error={error} />}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="soft" onClick={() => readCsv(SAMPLE_CSV, 'produits-exemple.csv')}>Utiliser le fichier d’exemple</Button>
            <span className="text-[13px] text-muted">5 produits, pour tester sans fichier</span>
          </div>
          <div>
            <div className="mb-1.5 text-sm font-semibold">Format attendu</div>
            <pre className="overflow-x-auto rounded-[10px] bg-surface-2 p-3 font-mono text-[12.5px]">{SAMPLE_CSV.split('\n').slice(0, 3).join('\n')}</pre>
          </div>
        </div>
      )}

      {step === 'loading' && (
        <Loading method={method} title={method === 'instagram' ? `Analyse de @${profile?.handle}` : 'Lecture du fichier'} onDone={() => pending.current()} />
      )}

      {step === 'empty' && profile && (
        <div className="mx-auto grid max-w-[660px] justify-items-center gap-3 rounded-2xl border border-dashed border-line bg-surface px-5 py-14 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-surface-2 text-muted"><Search className="size-7" /></span>
          <h3 className="text-xl font-bold">Aucun produit détecté sur @{profile.handle}</h3>
          <p className="max-w-[52ch] text-muted">Nous n’avons trouvé ni prix ni produit dans les 24 dernières publications. C’est fréquent pour un compte personnel ou un compte qui publie surtout des stories.</p>
          <div className="mt-1 flex flex-wrap justify-center gap-2.5">
            <Button onClick={() => restart()}>Essayer un autre compte</Button>
            <Button variant="ghost" onClick={() => restart('fichier')}>Importer depuis un fichier</Button>
            <Button variant="ghost" onClick={() => openForm()}>Ajouter manuellement</Button>
          </div>
        </div>
      )}

      {step === 'results' && (
        <>
          <div className="mb-3.5 flex flex-wrap items-center gap-3.5 rounded-2xl border border-line bg-surface px-4 py-3.5">
            {method === 'instagram' && profile ? (
              <>
                <span className="rounded-full bg-gradient-to-tr from-amber-400 via-pink-600 to-purple-700 p-[3px]">
                  <span className="grid size-14.5 place-items-center rounded-full border-3 border-surface font-display text-lg font-extrabold text-white" style={{ background: `hsl(${profile.hue} 50% 42%)` }}>{profile.handle.slice(0, 2).toUpperCase()}</span>
                </span>
                <div>
                  <h3 className="text-lg font-bold">@{profile.handle}</h3>
                  <div className="flex flex-wrap gap-4 text-[13.5px] text-muted"><span><b className="text-ink">{profile.posts}</b> publications</span><span><b className="text-ink">{profile.followers}</b> abonnés</span><span className="flex items-center gap-1"><MapPin className="size-3.5" />Maroc</span></div>
                </div>
                <div className="sm:ml-auto sm:text-right"><b className="block font-display text-2xl leading-none tabular-nums">{candidates.length}</b><span className="text-[13px] text-muted">produits détectés sur 24 publications</span></div>
              </>
            ) : (
              <>
                <span className="grid size-13 place-items-center rounded-2xl bg-ok text-white"><FileSpreadsheet className="size-6" /></span>
                <div><h3 className="text-lg font-bold">{file?.name}</h3><div className="flex gap-4 text-[13.5px] text-muted"><span><b className="text-ink">{candidates.length}</b> lignes valides</span>{!!file?.skipped && <span>{file.skipped} ignorée(s)</span>}</div></div>
              </>
            )}
          </div>
          {method === 'instagram' && (
            <div className="mb-3.5 flex items-start gap-2.5 rounded-xl bg-brand-soft px-3.5 py-3 text-sm text-brand">
              <Info className="mt-0.5 size-5 flex-none" /><div>Vérifiez les informations avant l’import. Les prix marqués <b>à vérifier</b> n’étaient pas indiqués dans la légende : nous proposons un prix moyen constaté sur Dukan.</div>
            </div>
          )}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-3.5">
            {candidates.map((c, i) => <CandidateCard key={i} c={c} index={i} invalid={invalid.includes(i)} showLikes={method === 'instagram'} onChange={(p) => patch(i, p)} />)}
          </div>
          <div className="sticky bottom-[calc(env(safe-area-inset-bottom,0px)+12px)] z-30 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[18px] bg-ink py-3 pr-3 pl-4.5 text-bg shadow-card">
            <div className="flex flex-wrap items-center gap-3 font-semibold">
              <label className="flex cursor-pointer items-center gap-2 text-sm opacity-90">
                <input type="checkbox" className="size-5 accent-brand" checked={selectedCount === candidates.length} onChange={(e) => setCandidates((cs) => cs.map((c) => ({ ...c, selected: e.target.checked })))} />Tout sélectionner
              </label>
              <span className="tabular-nums">{selectedCount} sur {candidates.length} sélectionné{selectedCount > 1 ? 's' : ''}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="inverse" onClick={() => restart()}>Recommencer</Button>
              <Button variant="saffron" onClick={doImport} disabled={!selectedCount || importing}>
                {importing ? <><Spinner />Importation…</> : <><Upload className="size-5" />Importer la sélection ({selectedCount})</>}
              </Button>
            </div>
          </div>
        </>
      )}

      {step === 'success' && (
        <div className="mx-auto grid max-w-3xl justify-items-center gap-4 rounded-[22px] border border-line bg-surface p-6 text-center sm:p-10">
          <span className="grid size-19 animate-pop place-items-center rounded-full bg-ok text-white"><Check className="size-9.5" strokeWidth={2.6} /></span>
          <h2 className="text-[24px] font-bold sm:text-[32px]">{plural(created.length, 'produit ajouté', 'produits ajoutés')} à vos brouillons</h2>
          <p className="max-w-[52ch] text-muted">Ils ne sont pas encore visibles par les acheteurs. Vérifiez le stock, puis publiez-les quand vous êtes prête.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {created.map((p, i) => <div key={p.id} className="size-16 animate-pop overflow-hidden rounded-xl" style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}><ProductImage art={p.art} hue={p.hue} image={p.image} /></div>)}
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            <Button onClick={publishAll}><Check className="size-5" />Publier les {created.length} produits</Button>
            <Button variant="ghost" onClick={() => navigate('/vendeur/produits?onglet=brouillons')}>Revoir mes brouillons</Button>
            <Button variant="ghost" onClick={() => restart()}>Importer d’autres produits</Button>
          </div>
        </div>
      )}
    </>
  )
}

function FileDrop({ onFile }: { onFile: (f?: File) => void }) {
  const [over, setOver] = useState(false)
  const onDrop = (e: DragEvent) => { e.preventDefault(); setOver(false); onFile(e.dataTransfer.files[0]) }
  return (
    <label htmlFor="csv-in" onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={onDrop}
      className={cn('grid cursor-pointer justify-items-center gap-2.5 rounded-[18px] border-2 border-dashed bg-surface-2 px-5 py-7.5 text-center transition', over ? 'border-brand' : 'border-line hover:border-brand')}>
      <Upload className="size-8.5 text-brand" />
      <b>Glissez votre fichier ici ou cliquez pour le choisir</b>
      <span className="text-[13px] text-muted">CSV séparé par des points-virgules ou des virgules</span>
      <input id="csv-in" type="file" accept=".csv,text/csv,text/plain" className="sr-only" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = '' }} />
    </label>
  )
}
