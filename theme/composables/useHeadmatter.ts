import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

/** Frontmatter de la primera diapositiva (encabezado de la presentación). */
export function useHeadmatter() {
  const { $slidev } = useSlideContext()
  return computed<Record<string, any>>(() => ($slidev as any)?.nav?.slides?.[0]?.meta?.slide?.frontmatter ?? {})
}
