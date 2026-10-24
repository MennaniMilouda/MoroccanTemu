import type { DisplayStatus } from '../../store/shop'

export const STATUS_LABEL: Record<DisplayStatus, string> = { draft: 'Brouillon', published: 'Publié', out: 'En rupture de stock' }
export const STATUS_TONE: Record<DisplayStatus, 'draft' | 'ok' | 'out'> = { draft: 'draft', published: 'ok', out: 'out' }
