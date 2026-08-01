"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { hasAnalyticsConsent, subscribeToConsent } from "@/lib/consent"

export function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = "G-5GSSKMXMQE"
  const CLARITY_PROJECT_ID = "ul1ye4h69b"

  // Starts false on the server and on the first client render so nothing is
  // requested before the user has answered the cookie banner.
  const [consented, setConsented] = useState(false)
  const everLoaded = useRef(false)

  useEffect(() => {
    const sync = () => {
      const granted = hasAnalyticsConsent()
      setConsented(granted)

      if (granted) {
        everLoaded.current = true
        return
      }

      // Consent was withdrawn (e.g. in another tab) after the tags had already
      // been injected. `next/script` appends them straight to the document, so
      // unmounting this component does not remove them — both vendors have to
      // be told to stop collecting. A reload is still needed to unload the
      // scripts themselves.
      if (everLoaded.current) {
        const w = window as unknown as {
          gtag?: (...args: unknown[]) => void
          clarity?: (...args: unknown[]) => void
        }

        w.gtag?.("consent", "update", {
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          analytics_storage: "denied",
        })
        w.clarity?.("stop")
      }
    }

    sync()
    return subscribeToConsent(sync)
  }, [])

  if (!consented) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'granted'
            });
            gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
          `,
        }}
      />
      <Script
        id="microsoft-clarity"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
            // Only reached once the user accepted the banner.
            window.clarity("consent");
          `,
        }}
      />
    </>
  )
}
