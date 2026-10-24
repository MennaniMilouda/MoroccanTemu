import { CATEGORIES, CATEGORY_ART } from '../data/catalog'
import type { CategoryId, ImportCandidate } from '../types'
import { normalize } from './format'
import { seeded } from './instagram'

export type CsvResult = { candidates: ImportCandidate[]; skipped: number } | { error: { title: string; detail: string } }

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

function guessCategory(value = ''): CategoryId {
  const v = normalize(value)
  return CATEGORIES.find((c) => normalize(c.name) === v || c.id === v || (v && v.startsWith(c.id.slice(0, 4))))?.id ?? 'decoration'
}

/** Reads a CSV with columns nom, prix, categorie, stock (header optional, ";" or "," separated). */
export function parseProductsCsv(text: string): CsvResult {
  const rows = text.replace(/\r/g, '').split('\n').map((l) => l.trim()).filter(Boolean)
  if (!rows.length) return { error: { title: 'Le fichier est vide.', detail: 'Ajoutez une ligne par produit avec au moins un nom et un prix.' } }
  const delim = rows[0].includes(';') ? ';' : ','
  const head = rows[0].split(delim).map((h) => normalize(h.trim()))
  const hasHeader = head.some((h) => ['nom', 'name', 'prix', 'price'].includes(h))
  const col = (keys: string[], fallback: number) => (hasHeader ? head.findIndex((h) => keys.includes(h)) : fallback)
  const ci = { name: col(['nom', 'name', 'produit', 'titre'], 0), price: col(['prix', 'price'], 1), cat: col(['categorie', 'category'], 2), stock: col(['stock', 'quantite', 'qty'], 3) }
  if (ci.name < 0 || ci.price < 0)
    return { error: { title: 'Colonnes « nom » et « prix » introuvables.', detail: 'Vérifiez la première ligne du fichier, par exemple : nom;prix;categorie;stock.' } }

  let skipped = 0
  const candidates: ImportCandidate[] = []
  rows.slice(hasHeader ? 1 : 0).forEach((line, k) => {
    const cells = line.split(delim).map((x) => x.trim().replace(/^"|"$/g, ''))
    const name = cells[ci.name]
    const price = parseFloat((cells[ci.price] ?? '').replace(',', '.').replace(/[^\d.]/g, ''))
    if (!name || !(price > 0)) { skipped++; return }
    const category = guessCategory(cells[ci.cat])
    candidates.push({
      name, price: Math.round(price), category, stock: parseInt(cells[ci.stock]) || 5,
      art: CATEGORY_ART[category], hue: Math.floor(seeded(name)() * 360),
      caption: `Ligne ${k + (hasHeader ? 2 : 1)} du fichier · <b>${escapeHtml(name)}</b>`,
      priceSource: 'caption', selected: true,
    })
  })
  if (!candidates.length) return { error: { title: 'Aucune ligne exploitable.', detail: `${skipped} ligne(s) sans nom ou sans prix valide.` } }
  return { candidates, skipped }
}
