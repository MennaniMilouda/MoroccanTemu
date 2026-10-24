const NF = new Intl.NumberFormat('fr-FR')

/** 1290 → "1 290 DH" */
export const formatDH = (n: number) => `${NF.format(Math.round(n))} DH`
export const formatNumber = (n: number) => NF.format(n)
/** 3820 → "3,8k" */
export const formatCompact = (n: number) =>
  n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.', ',') + 'k' : String(n)
export const formatRating = (n: number) => n.toFixed(1).replace('.', ',')
export const discountPercent = (price: number, oldPrice?: number | null) =>
  oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0
/** Lowercase and strip accents, for search. */
export const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
export const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
export const plural = (n: number, word: string, pluralWord = word + 's') => `${n} ${n > 1 ? pluralWord : word}`
