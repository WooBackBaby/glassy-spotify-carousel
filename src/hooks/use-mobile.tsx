
import * as React from "react"

const MOBILE_BREAKPOINT = 500

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsMobile = () => {
      return window.innerWidth < MOBILE_BREAKPOINT
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(checkIsMobile())
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(checkIsMobile())
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
