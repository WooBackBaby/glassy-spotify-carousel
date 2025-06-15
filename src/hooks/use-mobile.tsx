
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsMobile = () => {
      // Check both screen width and user agent for better mobile detection
      const screenWidth = window.innerWidth
      const userAgent = navigator.userAgent.toLowerCase()
      
      // Check for mobile user agents
      const mobileUserAgents = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      
      // Check screen width
      const isSmallScreen = screenWidth < MOBILE_BREAKPOINT
      
      return mobileUserAgents || isSmallScreen
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
