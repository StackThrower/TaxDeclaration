"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { getConsent, setConsent } from "@/lib/consent"

export function CookieConsent() {
  const { language } = useI18n()
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Show the banner until the user has made an explicit choice.
    if (getConsent() === null) {
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptCookies = () => {
    setConsent("accepted")
    setShowBanner(false)
  }

  const rejectCookies = () => {
    setConsent("rejected")
    setShowBanner(false)
  }

  // Dismissing without choosing is not consent: nothing is stored, analytics
  // stays off, and the banner comes back on the next visit.
  const closeBanner = () => {
    setShowBanner(false)
  }

  if (!showBanner) return null

  const content: Record<string, {
    title: string
    description: string
    learnMore: string
    acceptAll: string
    rejectAll: string
    necessary: string
    analytics: string
    marketing: string
    gdprCompliance: string
  }> = {
    uk: {
      title: "Ми використовуємо cookies",
      description: "Цей веб-сайт використовує cookies для забезпечення найкращого досвіду користувача. Cookies допомагають нам зберігати ваші налаштування (мова, тема) та аналізувати використання сайту. Ми НЕ використовуємо рекламні або маркетингові cookies. Всі податкові дані обробляються локально у вашому браузері та НЕ передаються на наші сервери.",
      learnMore: "Детальніше про політику конфіденційності",
      acceptAll: "Прийняти всі",
      rejectAll: "Відхилити необов'язкові",
      necessary: "Обов'язкові cookies: Зберігають налаштування сайту (мова, тема)",
      analytics: "Аналітичні cookies: Google Analytics і Microsoft Clarity — вмикаються лише після вашої згоди",
      marketing: "Маркетингові cookies: НЕ використовуються",
      gdprCompliance: "Згідно з GDPR (EU 2016/679) ви маєте право контролювати використання cookies. Ви можете змінити свої налаштування у будь-який час.",
    },
    pl: {
      title: "Używamy cookies",
      description: "Ta strona internetowa używa plików cookie, aby zapewnić najlepsze wrażenia użytkownika. Pliki cookie pomagają nam przechowywać Twoje ustawienia (język, motyw) i analizować korzystanie ze strony. NIE używamy plików cookie reklamowych ani marketingowych. Wszystkie dane podatkowe są przetwarzane lokalnie w Twojej przeglądarce i NIE są przesyłane na nasze serwery.",
      learnMore: "Więcej o polityce prywatności",
      acceptAll: "Zaakceptuj wszystkie",
      rejectAll: "Odrzuć opcjonalne",
      necessary: "Niezbędne cookies: Przechowują ustawienia strony (język, motyw)",
      analytics: "Analityczne cookies: Google Analytics i Microsoft Clarity — włączane wyłącznie po Twojej zgodzie",
      marketing: "Marketingowe cookies: NIE są używane",
      gdprCompliance: "Zgodnie z RODO (UE 2016/679) masz prawo kontrolować wykorzystanie plików cookie. Możesz zmienić swoje ustawienia w dowolnym momencie.",
    },
    en: {
      title: "We use cookies",
      description: "This website uses cookies to provide you with the best user experience. Cookies help us store your preferences (language, theme) and analyze site usage. We DO NOT use advertising or marketing cookies. All tax data is processed locally in your browser and is NOT transmitted to our servers.",
      learnMore: "Learn more about privacy policy",
      acceptAll: "Accept all",
      rejectAll: "Reject optional",
      necessary: "Necessary cookies: Store site preferences (language, theme)",
      analytics: "Analytics cookies: Google Analytics and Microsoft Clarity — enabled only after your consent",
      marketing: "Marketing cookies: NOT used",
      gdprCompliance: "In accordance with GDPR (EU 2016/679), you have the right to control cookie usage. You can change your settings at any time.",
    },
    fr: {
      title: "Nous utilisons des cookies",
      description: "Ce site web utilise des cookies pour vous offrir la meilleure expérience utilisateur. Les cookies nous aident à stocker vos préférences (langue, thème) et à analyser l'utilisation du site. Nous N'utilisons PAS de cookies publicitaires ou marketing. Toutes les données fiscales sont traitées localement dans votre navigateur et NE sont PAS transmises à nos serveurs.",
      learnMore: "En savoir plus sur la politique de confidentialité",
      acceptAll: "Tout accepter",
      rejectAll: "Refuser les optionnels",
      necessary: "Cookies nécessaires : Stockent les préférences du site (langue, thème)",
      analytics: "Cookies analytiques : Google Analytics et Microsoft Clarity — activés uniquement après votre consentement",
      marketing: "Cookies marketing : NON utilisés",
      gdprCompliance: "Conformément au RGPD (UE 2016/679), vous avez le droit de contrôler l'utilisation des cookies. Vous pouvez modifier vos paramètres à tout moment.",
    },
    de: {
      title: "Wir verwenden Cookies",
      description: "Diese Website verwendet Cookies, um Ihnen das beste Benutzererlebnis zu bieten. Cookies helfen uns, Ihre Einstellungen (Sprache, Design) zu speichern und die Nutzung der Website zu analysieren. Wir verwenden KEINE Werbe- oder Marketing-Cookies. Alle Steuerdaten werden lokal in Ihrem Browser verarbeitet und NICHT an unsere Server übertragen.",
      learnMore: "Mehr über Datenschutzrichtlinie erfahren",
      acceptAll: "Alle akzeptieren",
      rejectAll: "Optionale ablehnen",
      necessary: "Notwendige Cookies: Speichern Website-Einstellungen (Sprache, Design)",
      analytics: "Analyse-Cookies: Google Analytics und Microsoft Clarity — nur nach Ihrer Einwilligung aktiviert",
      marketing: "Marketing-Cookies: NICHT verwendet",
      gdprCompliance: "Gemäß DSGVO (EU 2016/679) haben Sie das Recht, die Verwendung von Cookies zu kontrollieren. Sie können Ihre Einstellungen jederzeit ändern.",
    },
    es: {
      title: "Usamos cookies",
      description: "Este sitio web utiliza cookies para brindarle la mejor experiencia de usuario. Las cookies nos ayudan a almacenar sus preferencias (idioma, tema) y analizar el uso del sitio. NO utilizamos cookies publicitarias ni de marketing. Todos los datos fiscales se procesan localmente en su navegador y NO se transmiten a nuestros servidores.",
      learnMore: "Más información sobre la política de privacidad",
      acceptAll: "Aceptar todo",
      rejectAll: "Rechazar opcionales",
      necessary: "Cookies necesarias: Almacenan preferencias del sitio (idioma, tema)",
      analytics: "Cookies analíticas: Google Analytics y Microsoft Clarity — se activan solo tras su consentimiento",
      marketing: "Cookies de marketing: NO se utilizan",
      gdprCompliance: "De acuerdo con el RGPD (UE 2016/679), tiene derecho a controlar el uso de cookies. Puede cambiar su configuración en cualquier momento.",
    },
    pt: {
      title: "Usamos cookies",
      description: "Este site usa cookies para fornecer a melhor experiência do usuário. Os cookies nos ajudam a armazenar suas preferências (idioma, tema) e analisar o uso do site. NÃO usamos cookies de publicidade ou marketing. Todos os dados fiscais são processados localmente em seu navegador e NÃO são transmitidos para nossos servidores.",
      learnMore: "Saiba mais sobre política de privacidade",
      acceptAll: "Aceitar tudo",
      rejectAll: "Rejeitar opcionais",
      necessary: "Cookies necessários: Armazenam preferências do site (idioma, tema)",
      analytics: "Cookies analíticos: Google Analytics e Microsoft Clarity — ativados apenas após o seu consentimento",
      marketing: "Cookies de marketing: NÃO usados",
      gdprCompliance: "De acordo com o GDPR (UE 2016/679), você tem o direito de controlar o uso de cookies. Você pode alterar suas configurações a qualquer momento.",
    },
  }

  const text = content[language] || content.en

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background/95 backdrop-blur-md border-t border-border shadow-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                🍪 {text.title}
              </h3>
              <button
                onClick={closeBanner}
                className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              {text.description}
            </p>

            <div className="space-y-1 mb-3 text-xs text-muted-foreground">
              <p>✅ {text.necessary}</p>
              <p>❌ {text.analytics}</p>
              <p>❌ {text.marketing}</p>
            </div>

            <p className="text-xs text-muted-foreground/80 italic mb-2">
              {text.gdprCompliance}
            </p>

            <a
              href={`/${language}-ua/privacy`}
              className="text-xs text-primary hover:underline inline-block"
            >
              {text.learnMore} →
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button
              onClick={acceptCookies}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              {text.acceptAll}
            </Button>
            <Button
              onClick={rejectCookies}
              variant="outline"
              className="w-full sm:w-auto"
              size="sm"
            >
              {text.rejectAll}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

