import { INSTAGRAM_POOL } from '../data/import'
import type { ImportCandidate } from '../types'
import { formatCompact } from './format'

export interface ParseError { title: string; detail: string }

/** Accepts "@handle", "handle" or any instagram.com profile URL. */
export function parseInstagramAccount(raw: string): { handle: string } | { error: ParseError } {
  const value = raw.trim()
  if (!value) return { error: { title: 'Le champ est vide.', detail: 'Collez l’adresse de votre compte, par exemple instagram.com/votre.boutique.' } }
  let handle: string | null = null
  if (/^@?[A-Za-z0-9._]{1,30}$/.test(value)) handle = value.replace(/^@/, '')
  else {
    const m = value.match(/^(?:https?:\/\/)?(?:www\.|m\.)?(?:instagram\.com|instagr\.am)\/([A-Za-z0-9._]{1,30})\/?(?:\?.*)?$/i)
    if (m) handle = m[1]
    else if (/^(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+\.[a-z.]+\//i.test(value))
      return { error: { title: 'Ce lien ne mène pas à Instagram.', detail: 'Utilisez l’adresse de votre profil Instagram, du type instagram.com/votre.boutique.' } }
    else return { error: { title: 'Cette adresse n’est pas un compte Instagram valide.', detail: 'Un nom de compte contient uniquement des lettres, des chiffres, des points et des tirets bas.' } }
  }
  if (['p', 'reel', 'reels', 'explore', 'stories'].includes(handle.toLowerCase()))
    return { error: { title: 'C’est le lien d’une publication, pas d’un compte.', detail: 'Ouvrez votre profil et copiez l’adresse affichée en haut, par exemple instagram.com/votre.boutique.' } }
  return { handle }
}

/** Deterministic pseudo-random generator so the same handle always "detects" the same products. */
export function seeded(str: string) {
  let x = 0
  for (const c of str) x = (x * 31 + c.charCodeAt(0)) >>> 0
  return () => {
    x = (x * 1664525 + 1013904223) >>> 0
    return x / 4294967296
  }
}

export interface InstagramProfile {
  handle: string
  hue: number
  posts: number
  followers: string
  candidates: ImportCandidate[]
}

/**
 * SIMULATION: nothing is fetched from Instagram. Products are drawn from a fictional pool.
 * Handles containing "vide", "empty" or "perso" return no products, to show the empty state.
 */
export function simulateInstagramAnalysis(handle: string): InstagramProfile {
  const rnd = seeded(handle.toLowerCase())
  if (/vide|empty|perso/i.test(handle)) return { handle, hue: 250, posts: 40, followers: '1,2k', candidates: [] }
  const pool = [...INSTAGRAM_POOL].sort(() => rnd() - 0.5)
  const count = 6 + Math.floor(rnd() * 3)
  return {
    handle,
    hue: Math.floor(rnd() * 360),
    posts: 80 + Math.floor(rnd() * 240),
    followers: formatCompact(2000 + Math.floor(rnd() * 28000)),
    candidates: pool.slice(0, count).map((c) => ({ ...c, selected: c.priceSource === 'caption' })),
  }
}
