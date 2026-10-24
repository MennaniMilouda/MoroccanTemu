import { memo, useMemo } from 'react'
import { artSvg } from '../lib/art'
import type { ArtType } from '../types'
import { cn } from './ui/cn'

/** Shows the product photo when one exists, otherwise the illustrated placeholder. `view` picks one of 4 framings. */
export const ProductImage = memo(function ProductImage({ art, hue, image, view = 0, alt = '', className }: {
  art: ArtType; hue: number; image?: string; view?: number; alt?: string; className?: string
}) {
  const svg = useMemo(() => (image ? '' : artSvg(art, hue, view)), [art, hue, image, view])
  if (image) return <img src={image} alt={alt} className={cn('size-full object-cover', className)} loading="lazy" />
  return <div role={alt ? 'img' : undefined} aria-label={alt || undefined} className={cn('size-full [&>svg]:block [&>svg]:size-full', className)} dangerouslySetInnerHTML={{ __html: svg }} />
})
