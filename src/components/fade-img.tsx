import { useEffect, useRef, useState, type ImgHTMLAttributes, type Ref } from 'react'

interface FadeImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Forwarded so imperative consumers (parallax transforms) can hold it. */
  ref?: Ref<HTMLImageElement>
}

/**
 * An <img> that fades in once it has decoded — replaces the default
 * "pop in when the bytes arrive" with a soft rise. Pairs with the
 * `.img-fade` contract in global.css (`data-loaded` drives opacity).
 * Cached images are detected via `complete` so they never flash.
 * Spread props come after `data-loaded`, so callers can override anything.
 */
export function FadeImg({ ref: forwardedRef, ...props }: FadeImgProps) {
  const innerRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (innerRef.current?.complete) setLoaded(true)
  }, [])

  return (
    <img
      ref={(el) => {
        innerRef.current = el
        if (typeof forwardedRef === 'function') forwardedRef(el)
        else if (forwardedRef) forwardedRef.current = el
      }}
      data-loaded={loaded ? '1' : '0'}
      onLoad={() => setLoaded(true)}
      {...props}
    />
  )
}
