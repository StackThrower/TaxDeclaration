import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const language = locale.split("-")[0]

  const titles: Record<string, string> = {
    uk: "Політика конфіденційності",
    pl: "Polityka prywatności",
    en: "Privacy Policy",
    fr: "Politique de confidentialité",
    de: "Datenschutzrichtlinie",
    es: "Política de privacidad",
    pt: "Política de Privacidade",
  }

  const descriptions: Record<string, string> = {
    uk: "Дізнайтеся, як ми захищаємо вашу конфіденційність і обробляємо ваші дані на taxered.stackthrow.com",
    pl: "Dowiedz się, jak chronimy Twoją prywatność i przetwarzamy Twoje dane w taxered.stackthrow.com",
    en: "Learn how we protect your privacy and handle your data on taxered.stackthrow.com",
    fr: "Découvrez comment nous protégeons votre vie privée et traitons vos données sur taxered.stackthrow.com",
    de: "Erfahren Sie, wie wir Ihre Privatsphäre schützen und Ihre Daten auf taxered.stackthrow.com verarbeiten",
    es: "Descubra cómo protegemos su privacidad y manejamos sus datos en taxered.stackthrow.com",
    pt: "Saiba como protegemos sua privacidade e tratamos seus dados no taxered.stackthrow.com",
  }

  return {
    title: titles[language] || titles.en,
    description: descriptions[language] || descriptions.en,
    alternates: {
      canonical: `https://taxered.stackthrow.com/${locale}/privacy`,
      languages: {
        "x-default": "https://taxered.stackthrow.com",
        "uk-UA": "/uk-ua/privacy",
        "en-US": "/en-us/privacy",
        "en-GB": "/en-gb/privacy",
        "en-CA": "/en-ca/privacy",
        "fr-FR": "/fr-fr/privacy",
        "pl-PL": "/pl-pl/privacy",
        "es-ES": "/es-es/privacy",
        "pt-PT": "/pt-pt/privacy",
        "de-DE": "/de-de/privacy",
        "sv-SE": "/sv-se/privacy",
      },
    },
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  const language = locale.split("-")[0]

  const content: Record<string, {
    title: string
    lastUpdated: string
    sections: Array<{ heading: string; content: string[] }>
  }> = {
    uk: {
      title: "Політика конфіденційності",
      lastUpdated: "Останнє оновлення: 18 грудня 2025",
      sections: [
        {
          heading: "1. Збір та використання даних",
          content: [
            "taxered.stackthrow.com – це безкоштовний інструмент для заповнення податкових декларацій. Ми серйозно ставимося до захисту вашої конфіденційності.",
            "Важливо: Ми НЕ зберігаємо ваші податкові дані, персональну інформацію або дані декларацій на наших серверах. Всі розрахунки виконуються локально у вашому браузері.",
            "Усі дані, які ви вводите в форми (ПІБ, ІПН, суми доходів тощо), обробляються виключно на вашому пристрої та не передаються на наші сервери.",
          ],
        },
        {
          heading: "2. Аналітичні сервіси",
          content: [
            "Для покращення юзабіліті та функціональності сайту ми використовуємо:",
            "• Google Analytics – для аналізу відвідуваності та поведінки користувачів на сайті",
            "• Microsoft Clarity – для аналізу взаємодії користувачів з інтерфейсом",
            "Ці сервіси збирають анонімні дані про використання сайту (сторінки, які ви відвідуєте, час перебування, клацання), але НЕ мають доступу до ваших податкових даних або персональної інформації з форм.",
          ],
        },
        {
          heading: "3. Cookies та локальне сховище",
          content: [
            "Ми можемо використовувати cookies та локальне сховище браузера для:",
            "• Збереження налаштувань мови та теми",
            "• Запам'ятовування вашого прогресу при заповненні форм (локально у вашому браузері)",
            "• Роботи аналітичних сервісів",
            "Ви можете видалити ці дані в будь-який час через налаштування вашого браузера.",
          ],
        },
        {
          heading: "4. Безпека даних",
          content: [
            "Оскільки ми не зберігаємо ваші податкові дані на серверах, ризик витоку інформації мінімальний. Всі PDF-файли генеруються локально у вашому браузері.",
            "Ми рекомендуємо:",
            "• Використовувати надійний пароль для захисту згенерованих PDF-файлів",
            "• Не надсилати конфіденційні дані через незахищені канали зв'язку",
            "• Зберігати згенеровані документи в безпечному місці",
          ],
        },
        {
          heading: "5. Права користувачів",
          content: [
            "Оскільки ми не зберігаємо ваші персональні дані, немає необхідності в їх видаленні або експорті з наших систем.",
            "Ви маєте повний контроль над даними у вашому браузері та можете очистити їх в будь-який час.",
          ],
        },
        {
          heading: "6. Зміни в політиці",
          content: [
            "Ми можемо оновлювати цю політику конфіденційності час від часу. Всі зміни будуть опубліковані на цій сторінці з оновленою датою.",
          ],
        },
        {
          heading: "7. Відповідність GDPR (Загальний регламент захисту даних ЄС)",
          content: [
            "Наш сервіс повністю відповідає вимогам GDPR (EU 2016/679) та іншим міжнародним стандартам захисту персональних даних.",
            "Ваші права згідно з GDPR:",
            "• Право на доступ до ваших даних – оскільки ми не зберігаємо ваші дані на серверах, всі дані знаходяться виключно у вашому браузері",
            "• Право на видалення даних – ви можете очистити локальне сховище браузера в будь-який час",
            "• Право на портативність даних – ви можете експортувати свої дані в PDF або Excel формат",
            "• Право на заперечення обробки – ви можете відхилити необов'язкові cookies через банер згоди",
            "• Право на обмеження обробки – ви контролюєте всі свої дані локально",
            "Типи cookies, які ми використовуємо:",
            "✅ Обов'язкові cookies: Зберігають налаштування мови та теми (не вимагають згоди згідно з GDPR)",
            "❌ Аналітичні cookies: НЕ використовуються без вашої згоди",
            "❌ Маркетингові/Рекламні cookies: НЕ використовуються взагалі",
            "Правова основа обробки даних:",
            "• Згода користувача (Article 6(1)(a) GDPR) – для аналітичних cookies",
            "• Легітимний інтерес (Article 6(1)(f) GDPR) – для необхідних cookies для функціонування сайту",
            "Міжнародна передача даних: Ми НЕ передаємо ваші податкові дані за межі ЄС, оскільки вони взагалі не залишають ваш браузер.",
          ],
        },
        {
          heading: "8. Контакти",
          content: [
            "Якщо у вас є питання щодо нашої політики конфіденційності, зв'яжіться з нами:",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    pl: {
      title: "Polityka prywatności",
      lastUpdated: "Ostatnia aktualizacja: 18 grudnia 2025",
      sections: [
        {
          heading: "1. Zbieranie i wykorzystanie danych",
          content: [
            "taxered.stackthrow.com to darmowe narzędzie do wypełniania deklaracji podatkowych. Poważnie traktujemy ochronę Twojej prywatności.",
            "Ważne: NIE przechowujemy Twoich danych podatkowych, informacji osobowych ani danych z deklaracji na naszych serwerach. Wszystkie obliczenia są wykonywane lokalnie w Twojej przeglądarce.",
            "Wszystkie dane wprowadzane do formularzy (imię, nazwisko, NIP, kwoty dochodów itp.) są przetwarzane wyłącznie na Twoim urządzeniu i nie są przesyłane na nasze serwery.",
          ],
        },
        {
          heading: "2. Usługi analityczne",
          content: [
            "Aby poprawić użyteczność i funkcjonalność strony, używamy:",
            "• Google Analytics – do analizy ruchu i zachowań użytkowników na stronie",
            "• Microsoft Clarity – do analizy interakcji użytkowników z interfejsem",
            "Te usługi zbierają anonimowe dane o korzystaniu ze strony (odwiedzane strony, czas przebywania, kliknięcia), ale NIE mają dostępu do Twoich danych podatkowych ani informacji osobowych z formularzy.",
          ],
        },
        {
          heading: "3. Pliki cookie i pamięć lokalna",
          content: [
            "Możemy używać plików cookie i pamięci lokalnej przeglądarki do:",
            "• Zapisywania ustawień języka i motywu",
            "• Zapamiętywania postępów w wypełnianiu formularzy (lokalnie w przeglądarce)",
            "• Działania usług analitycznych",
            "Możesz usunąć te dane w dowolnym momencie w ustawieniach przeglądarki.",
          ],
        },
        {
          heading: "4. Bezpieczeństwo danych",
          content: [
            "Ponieważ nie przechowujemy Twoich danych podatkowych na serwerach, ryzyko wycieku informacji jest minimalne. Wszystkie pliki PDF są generowane lokalnie w Twojej przeglądarce.",
            "Zalecamy:",
            "• Używać silnego hasła do ochrony wygenerowanych plików PDF",
            "• Nie wysyłać poufnych danych przez niezabezpieczone kanały komunikacji",
            "• Przechowywać wygenerowane dokumenty w bezpiecznym miejscu",
          ],
        },
        {
          heading: "5. Prawa użytkowników",
          content: [
            "Ponieważ nie przechowujemy Twoich danych osobowych, nie ma potrzeby ich usuwania ani eksportowania z naszych systemów.",
            "Masz pełną kontrolę nad danymi w swojej przeglądarce i możesz je wyczyścić w dowolnym momencie.",
          ],
        },
        {
          heading: "6. Zmiany w polityce",
          content: [
            "Możemy okresowo aktualizować tę politykę prywatności. Wszystkie zmiany zostaną opublikowane na tej stronie z zaktualizowaną datą.",
          ],
        },
        {
          heading: "7. Zgodność z RODO (Ogólne Rozporządzenie o Ochronie Danych UE)",
          content: [
            "Nasza usługa jest w pełni zgodna z wymogami RODO (UE 2016/679) i innymi międzynarodowymi standardami ochrony danych osobowych.",
            "Twoje prawa zgodnie z RODO:",
            "• Prawo dostępu do danych – ponieważ nie przechowujemy Twoich danych na serwerach, wszystkie dane znajdują się wyłącznie w Twojej przeglądarce",
            "• Prawo do usunięcia danych – możesz wyczyścić pamięć lokalną przeglądarki w dowolnym momencie",
            "• Prawo do przenoszenia danych – możesz eksportować swoje dane do formatu PDF lub Excel",
            "• Prawo do sprzeciwu wobec przetwarzania – możesz odrzucić opcjonalne pliki cookie przez baner zgody",
            "• Prawo do ograniczenia przetwarzania – kontrolujesz wszystkie swoje dane lokalnie",
            "Rodzaje plików cookie, których używamy:",
            "✅ Niezbędne cookies: Przechowują ustawienia języka i motywu (nie wymagają zgody zgodnie z RODO)",
            "❌ Analityczne cookies: NIE są używane bez Twojej zgody",
            "❌ Marketingowe/Reklamowe cookies: NIE są używane w ogóle",
            "Podstawa prawna przetwarzania danych:",
            "• Zgoda użytkownika (Art. 6(1)(a) RODO) – dla analitycznych cookies",
            "• Uzasadniony interes (Art. 6(1)(f) RODO) – dla niezbędnych cookies do funkcjonowania strony",
            "Międzynarodowe przekazywanie danych: NIE przekazujemy Twoich danych podatkowych poza UE, ponieważ w ogóle nie opuszczają Twojej przeglądarki.",
          ],
        },
        {
          heading: "8. Kontakt",
          content: [
            "Jeśli masz pytania dotyczące naszej polityki prywatności, skontaktuj się z nami:",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: December 18, 2025",
      sections: [
        {
          heading: "1. Data Collection and Use",
          content: [
            "taxered.stackthrow.com is a free tool for filling out tax returns. We take your privacy seriously.",
            "Important: We DO NOT store your tax data, personal information, or declaration data on our servers. All calculations are performed locally in your browser.",
            "All data you enter into forms (name, tax ID, income amounts, etc.) is processed exclusively on your device and is not transmitted to our servers.",
          ],
        },
        {
          heading: "2. Analytics Services",
          content: [
            "To improve usability and website functionality, we use:",
            "• Google Analytics – for analyzing traffic and user behavior on the site",
            "• Microsoft Clarity – for analyzing user interactions with the interface",
            "These services collect anonymous data about site usage (pages visited, time spent, clicks), but DO NOT have access to your tax data or personal information from forms.",
          ],
        },
        {
          heading: "3. Cookies and Local Storage",
          content: [
            "We may use cookies and browser local storage for:",
            "• Saving language and theme preferences",
            "• Remembering your progress when filling out forms (locally in your browser)",
            "• Analytics services operation",
            "You can delete this data at any time through your browser settings.",
          ],
        },
        {
          heading: "4. Data Security",
          content: [
            "Since we don't store your tax data on servers, the risk of information leakage is minimal. All PDF files are generated locally in your browser.",
            "We recommend:",
            "• Using a strong password to protect generated PDF files",
            "• Not sending confidential data through unsecured communication channels",
            "• Storing generated documents in a secure location",
          ],
        },
        {
          heading: "5. User Rights",
          content: [
            "Since we don't store your personal data, there's no need to delete or export it from our systems.",
            "You have full control over data in your browser and can clear it at any time.",
          ],
        },
        {
          heading: "6. Policy Changes",
          content: [
            "We may update this privacy policy from time to time. All changes will be posted on this page with an updated date.",
          ],
        },
        {
          heading: "7. GDPR Compliance (General Data Protection Regulation)",
          content: [
            "Our service is fully compliant with GDPR (EU 2016/679) requirements and other international data protection standards.",
            "Your rights under GDPR:",
            "• Right to access your data – since we don't store your data on servers, all data is exclusively in your browser",
            "• Right to deletion – you can clear browser local storage at any time",
            "• Right to data portability – you can export your data to PDF or Excel format",
            "• Right to object to processing – you can reject optional cookies via the consent banner",
            "• Right to restriction of processing – you control all your data locally",
            "Types of cookies we use:",
            "✅ Necessary cookies: Store language and theme preferences (do not require consent under GDPR)",
            "❌ Analytics cookies: NOT used without your consent",
            "❌ Marketing/Advertising cookies: NOT used at all",
            "Legal basis for data processing:",
            "• User consent (Article 6(1)(a) GDPR) – for analytics cookies",
            "• Legitimate interest (Article 6(1)(f) GDPR) – for necessary cookies for site functionality",
            "International data transfer: We DO NOT transfer your tax data outside the EU, as it never leaves your browser at all.",
          ],
        },
        {
          heading: "8. Contact",
          content: [
            "If you have questions about our privacy policy, contact us:",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    fr: {
      title: "Politique de confidentialité",
      lastUpdated: "Dernière mise à jour : 18 décembre 2025",
      sections: [
        {
          heading: "1. Collecte et utilisation des données",
          content: [
            "taxered.stackthrow.com est un outil gratuit pour remplir les déclarations fiscales. Nous prenons votre vie privée au sérieux.",
            "Important : Nous NE stockons PAS vos données fiscales, informations personnelles ou données de déclaration sur nos serveurs. Tous les calculs sont effectués localement dans votre navigateur.",
            "Toutes les données que vous saisissez dans les formulaires (nom, numéro fiscal, montants de revenus, etc.) sont traitées exclusivement sur votre appareil et ne sont pas transmises à nos serveurs.",
          ],
        },
        {
          heading: "2. Services d'analyse",
          content: [
            "Pour améliorer la convivialité et les fonctionnalités du site, nous utilisons :",
            "• Google Analytics – pour analyser le trafic et le comportement des utilisateurs sur le site",
            "• Microsoft Clarity – pour analyser les interactions des utilisateurs avec l'interface",
            "Ces services collectent des données anonymes sur l'utilisation du site (pages visitées, temps passé, clics), mais n'ont PAS accès à vos données fiscales ou informations personnelles des formulaires.",
          ],
        },
        {
          heading: "3. Cookies et stockage local",
          content: [
            "Nous pouvons utiliser des cookies et le stockage local du navigateur pour :",
            "• Sauvegarder les préférences de langue et de thème",
            "• Mémoriser votre progression lors du remplissage des formulaires (localement dans votre navigateur)",
            "• Fonctionnement des services d'analyse",
            "Vous pouvez supprimer ces données à tout moment via les paramètres de votre navigateur.",
          ],
        },
        {
          heading: "4. Sécurité des données",
          content: [
            "Puisque nous ne stockons pas vos données fiscales sur des serveurs, le risque de fuite d'informations est minimal. Tous les fichiers PDF sont générés localement dans votre navigateur.",
            "Nous recommandons :",
            "• Utiliser un mot de passe fort pour protéger les fichiers PDF générés",
            "• Ne pas envoyer de données confidentielles via des canaux de communication non sécurisés",
            "• Stocker les documents générés dans un endroit sécurisé",
          ],
        },
        {
          heading: "5. Droits des utilisateurs",
          content: [
            "Puisque nous ne stockons pas vos données personnelles, il n'est pas nécessaire de les supprimer ou de les exporter de nos systèmes.",
            "Vous avez un contrôle total sur les données dans votre navigateur et pouvez les effacer à tout moment.",
          ],
        },
        {
          heading: "6. Modifications de la politique",
          content: [
            "Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. Toutes les modifications seront publiées sur cette page avec une date mise à jour.",
          ],
        },
        {
          heading: "7. Conformité au RGPD (Règlement Général sur la Protection des Données)",
          content: [
            "Notre service est entièrement conforme aux exigences du RGPD (UE 2016/679) et à d'autres normes internationales de protection des données.",
            "Vos droits en vertu du RGPD :",
            "• Droit d'accès à vos données – puisque nous ne stockons pas vos données sur des serveurs, toutes les données se trouvent exclusivement dans votre navigateur",
            "• Droit à l'effacement – vous pouvez effacer le stockage local du navigateur à tout moment",
            "• Droit à la portabilité des données – vous pouvez exporter vos données au format PDF ou Excel",
            "• Droit d'opposition au traitement – vous pouvez refuser les cookies optionnels via la bannière de consentement",
            "• Droit à la limitation du traitement – vous contrôlez toutes vos données localement",
            "Types de cookies que nous utilisons :",
            "✅ Cookies nécessaires : Stockent les préférences de langue et de thème (ne nécessitent pas de consentement selon le RGPD)",
            "❌ Cookies analytiques : NON utilisés sans votre consentement",
            "❌ Cookies marketing/publicitaires : NON utilisés du tout",
            "Base juridique du traitement des données :",
            "• Consentement de l'utilisateur (Article 6(1)(a) RGPD) – pour les cookies analytiques",
            "• Intérêt légitime (Article 6(1)(f) RGPD) – pour les cookies nécessaires au fonctionnement du site",
            "Transfert international de données : Nous NE transférons PAS vos données fiscales en dehors de l'UE, car elles ne quittent jamais votre navigateur.",
          ],
        },
        {
          heading: "8. Contact",
          content: [
            "Si vous avez des questions concernant notre politique de confidentialité, contactez-nous :",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    de: {
      title: "Datenschutzrichtlinie",
      lastUpdated: "Letzte Aktualisierung: 18. Dezember 2024",
      sections: [
        {
          heading: "1. Datenerfassung und -verwendung",
          content: [
            "taxered.stackthrow.com ist ein kostenloses Tool zum Ausfüllen von Steuererklärungen. Wir nehmen Ihre Privatsphäre ernst.",
            "Wichtig: Wir speichern KEINE Ihrer Steuerdaten, persönlichen Informationen oder Erklärungsdaten auf unseren Servern. Alle Berechnungen werden lokal in Ihrem Browser durchgeführt.",
            "Alle Daten, die Sie in Formulare eingeben (Name, Steuernummer, Einkommensbeträge usw.), werden ausschließlich auf Ihrem Gerät verarbeitet und nicht an unsere Server übertragen.",
          ],
        },
        {
          heading: "2. Analysedienste",
          content: [
            "Um die Benutzerfreundlichkeit und Funktionalität der Website zu verbessern, verwenden wir:",
            "• Google Analytics – zur Analyse von Traffic und Nutzerverhalten auf der Website",
            "• Microsoft Clarity – zur Analyse der Benutzerinteraktionen mit der Oberfläche",
            "Diese Dienste sammeln anonyme Daten über die Website-Nutzung (besuchte Seiten, Verweildauer, Klicks), haben aber KEINEN Zugriff auf Ihre Steuerdaten oder persönlichen Informationen aus Formularen.",
          ],
        },
        {
          heading: "3. Cookies und lokaler Speicher",
          content: [
            "Wir können Cookies und den lokalen Speicher des Browsers verwenden für:",
            "• Speichern von Sprach- und Designeinstellungen",
            "• Merken Ihres Fortschritts beim Ausfüllen von Formularen (lokal in Ihrem Browser)",
            "• Betrieb von Analysediensten",
            "Sie können diese Daten jederzeit über Ihre Browser-Einstellungen löschen.",
          ],
        },
        {
          heading: "4. Datensicherheit",
          content: [
            "Da wir Ihre Steuerdaten nicht auf Servern speichern, ist das Risiko eines Informationslecks minimal. Alle PDF-Dateien werden lokal in Ihrem Browser generiert.",
            "Wir empfehlen:",
            "• Ein starkes Passwort zum Schutz generierter PDF-Dateien zu verwenden",
            "• Keine vertraulichen Daten über ungesicherte Kommunikationskanäle zu senden",
            "• Generierte Dokumente an einem sicheren Ort aufzubewahren",
          ],
        },
        {
          heading: "5. Benutzerrechte",
          content: [
            "Da wir Ihre persönlichen Daten nicht speichern, müssen diese nicht aus unseren Systemen gelöscht oder exportiert werden.",
            "Sie haben volle Kontrolle über die Daten in Ihrem Browser und können sie jederzeit löschen.",
          ],
        },
        {
          heading: "6. Richtlinienänderungen",
          content: [
            "Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Alle Änderungen werden auf dieser Seite mit aktualisiertem Datum veröffentlicht.",
          ],
        },
        {
          heading: "7. DSGVO-Konformität (Datenschutz-Grundverordnung)",
          content: [
            "Unser Service entspricht vollständig den Anforderungen der DSGVO (EU 2016/679) und anderen internationalen Datenschutzstandards.",
            "Ihre Rechte gemäß DSGVO:",
            "• Recht auf Zugang zu Ihren Daten – da wir Ihre Daten nicht auf Servern speichern, befinden sich alle Daten ausschließlich in Ihrem Browser",
            "• Recht auf Löschung – Sie können den lokalen Speicher des Browsers jederzeit löschen",
            "• Recht auf Datenübertragbarkeit – Sie können Ihre Daten im PDF- oder Excel-Format exportieren",
            "• Widerspruchsrecht gegen Verarbeitung – Sie können optionale Cookies über das Einwilligungsbanner ablehnen",
            "• Recht auf Einschränkung der Verarbeitung – Sie kontrollieren alle Ihre Daten lokal",
            "Arten von Cookies, die wir verwenden:",
            "✅ Notwendige Cookies: Speichern Sprach- und Designeinstellungen (erfordern keine Einwilligung gemäß DSGVO)",
            "❌ Analyse-Cookies: NICHT ohne Ihre Einwilligung verwendet",
            "❌ Marketing-/Werbe-Cookies: NICHT verwendet",
            "Rechtsgrundlage für Datenverarbeitung:",
            "• Einwilligung des Nutzers (Art. 6(1)(a) DSGVO) – für Analyse-Cookies",
            "• Berechtigtes Interesse (Art. 6(1)(f) DSGVO) – für notwendige Cookies für die Website-Funktionalität",
            "Internationale Datenübermittlung: Wir übermitteln Ihre Steuerdaten NICHT außerhalb der EU, da sie Ihren Browser überhaupt nicht verlassen.",
          ],
        },
        {
          heading: "8. Kontakt",
          content: [
            "Wenn Sie Fragen zu unserer Datenschutzrichtlinie haben, kontaktieren Sie uns:",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    es: {
      title: "Política de privacidad",
      lastUpdated: "Última actualización: 18 de diciembre de 2024",
      sections: [
        {
          heading: "1. Recopilación y uso de datos",
          content: [
            "taxered.stackthrow.com es una herramienta gratuita para completar declaraciones de impuestos. Nos tomamos en serio su privacidad.",
            "Importante: NO almacenamos sus datos fiscales, información personal o datos de declaración en nuestros servidores. Todos los cálculos se realizan localmente en su navegador.",
            "Todos los datos que ingresa en los formularios (nombre, número fiscal, montos de ingresos, etc.) se procesan exclusivamente en su dispositivo y no se transmiten a nuestros servidores.",
          ],
        },
        {
          heading: "2. Servicios de análisis",
          content: [
            "Para mejorar la usabilidad y funcionalidad del sitio, utilizamos:",
            "• Google Analytics – para analizar el tráfico y el comportamiento del usuario en el sitio",
            "• Microsoft Clarity – para analizar las interacciones del usuario con la interfaz",
            "Estos servicios recopilan datos anónimos sobre el uso del sitio (páginas visitadas, tiempo transcurrido, clics), pero NO tienen acceso a sus datos fiscales o información personal de los formularios.",
          ],
        },
        {
          heading: "3. Cookies y almacenamiento local",
          content: [
            "Podemos usar cookies y almacenamiento local del navegador para:",
            "• Guardar preferencias de idioma y tema",
            "• Recordar su progreso al completar formularios (localmente en su navegador)",
            "• Operación de servicios de análisis",
            "Puede eliminar estos datos en cualquier momento a través de la configuración de su navegador.",
          ],
        },
        {
          heading: "4. Seguridad de datos",
          content: [
            "Dado que no almacenamos sus datos fiscales en servidores, el riesgo de filtración de información es mínimo. Todos los archivos PDF se generan localmente en su navegador.",
            "Recomendamos:",
            "• Usar una contraseña segura para proteger los archivos PDF generados",
            "• No enviar datos confidenciales a través de canales de comunicación no seguros",
            "• Almacenar los documentos generados en un lugar seguro",
          ],
        },
        {
          heading: "5. Derechos de los usuarios",
          content: [
            "Dado que no almacenamos sus datos personales, no es necesario eliminarlos o exportarlos de nuestros sistemas.",
            "Tiene control total sobre los datos en su navegador y puede borrarlos en cualquier momento.",
          ],
        },
        {
          heading: "6. Cambios en la política",
          content: [
            "Podemos actualizar esta política de privacidad de vez en cuando. Todos los cambios se publicarán en esta página con una fecha actualizada.",
          ],
        },
        {
          heading: "7. Cumplimiento del RGPD (Reglamento General de Protección de Datos)",
          content: [
            "Nuestro servicio cumple completamente con los requisitos del RGPD (UE 2016/679) y otros estándares internacionales de protección de datos.",
            "Sus derechos bajo el RGPD:",
            "• Derecho de acceso a sus datos – dado que no almacenamos sus datos en servidores, todos los datos están exclusivamente en su navegador",
            "• Derecho de supresión – puede borrar el almacenamiento local del navegador en cualquier momento",
            "• Derecho a la portabilidad de datos – puede exportar sus datos en formato PDF o Excel",
            "• Derecho de oposición al procesamiento – puede rechazar cookies opcionales a través del banner de consentimiento",
            "• Derecho a la limitación del procesamiento – usted controla todos sus datos localmente",
            "Tipos de cookies que usamos:",
            "✅ Cookies necesarias: Almacenan preferencias de idioma y tema (no requieren consentimiento según el RGPD)",
            "❌ Cookies analíticas: NO se usan sin su consentimiento",
            "❌ Cookies de marketing/publicidad: NO se usan en absoluto",
            "Base legal para el procesamiento de datos:",
            "• Consentimiento del usuario (Artículo 6(1)(a) RGPD) – para cookies analíticas",
            "• Interés legítimo (Artículo 6(1)(f) RGPD) – para cookies necesarias para la funcionalidad del sitio",
            "Transferencia internacional de datos: NO transferimos sus datos fiscales fuera de la UE, ya que nunca salen de su navegador.",
          ],
        },
        {
          heading: "8. Contacto",
          content: [
            "Si tiene preguntas sobre nuestra política de privacidad, contáctenos:",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    pt: {
      title: "Política de Privacidade",
      lastUpdated: "Última atualização: 18 de dezembro de 2024",
      sections: [
        {
          heading: "1. Coleta e uso de dados",
          content: [
            "taxered.stackthrow.com é uma ferramenta gratuita para preencher declarações fiscais. Levamos sua privacidade a sério.",
            "Importante: NÃO armazenamos seus dados fiscais, informações pessoais ou dados de declaração em nossos servidores. Todos os cálculos são realizados localmente em seu navegador.",
            "Todos os dados que você insere nos formulários (nome, número fiscal, valores de renda, etc.) são processados exclusivamente em seu dispositivo e não são transmitidos aos nossos servidores.",
          ],
        },
        {
          heading: "2. Serviços de análise",
          content: [
            "Para melhorar a usabilidade e funcionalidade do site, usamos:",
            "• Google Analytics – para analisar o tráfego e o comportamento do usuário no site",
            "• Microsoft Clarity – para analisar as interações do usuário com a interface",
            "Esses serviços coletam dados anônimos sobre o uso do site (páginas visitadas, tempo gasto, cliques), mas NÃO têm acesso aos seus dados fiscais ou informações pessoais dos formulários.",
          ],
        },
        {
          heading: "3. Cookies e armazenamento local",
          content: [
            "Podemos usar cookies e armazenamento local do navegador para:",
            "• Salvar preferências de idioma e tema",
            "• Lembrar seu progresso ao preencher formulários (localmente em seu navegador)",
            "• Operação de serviços de análise",
            "Você pode excluir esses dados a qualquer momento através das configurações do seu navegador.",
          ],
        },
        {
          heading: "4. Segurança de dados",
          content: [
            "Como não armazenamos seus dados fiscais em servidores, o risco de vazamento de informações é mínimo. Todos os arquivos PDF são gerados localmente em seu navegador.",
            "Recomendamos:",
            "• Usar uma senha forte para proteger os arquivos PDF gerados",
            "• Não enviar dados confidenciais por canais de comunicação não seguros",
            "• Armazenar os documentos gerados em um local seguro",
          ],
        },
        {
          heading: "5. Direitos dos usuários",
          content: [
            "Como não armazenamos seus dados pessoais, não há necessidade de excluí-los ou exportá-los de nossos sistemas.",
            "Você tem controle total sobre os dados em seu navegador e pode apagá-los a qualquer momento.",
          ],
        },
        {
          heading: "6. Alterações na política",
          content: [
            "Podemos atualizar esta política de privacidade de tempos em tempos. Todas as alterações serão publicadas nesta página com uma data atualizada.",
          ],
        },
        {
          heading: "7. Conformidade com o GDPR (Regulamento Geral de Proteção de Dados)",
          content: [
            "Nosso serviço está totalmente em conformidade com os requisitos do GDPR (UE 2016/679) e outros padrões internacionais de proteção de dados.",
            "Seus direitos sob o GDPR:",
            "• Direito de acesso aos seus dados – como não armazenamos seus dados em servidores, todos os dados estão exclusivamente em seu navegador",
            "• Direito de exclusão – você pode limpar o armazenamento local do navegador a qualquer momento",
            "• Direito à portabilidade de dados – você pode exportar seus dados em formato PDF ou Excel",
            "• Direito de oposição ao processamento – você pode rejeitar cookies opcionais através do banner de consentimento",
            "• Direito à limitação do processamento – você controla todos os seus dados localmente",
            "Tipos de cookies que usamos:",
            "✅ Cookies necessários: Armazenam preferências de idioma e tema (não requerem consentimento sob o GDPR)",
            "❌ Cookies analíticos: NÃO usados sem seu consentimento",
            "❌ Cookies de marketing/publicidade: NÃO usados",
            "Base legal para processamento de dados:",
            "• Consentimento do usuário (Artigo 6(1)(a) GDPR) – para cookies analíticos",
            "• Interesse legítimo (Artigo 6(1)(f) GDPR) – para cookies necessários para funcionalidade do site",
            "Transferência internacional de dados: NÃO transferimos seus dados fiscais para fora da UE, pois eles nunca saem do seu navegador.",
          ],
        },
        {
          heading: "8. Contato",
          content: [
            "Se você tiver dúvidas sobre nossa política de privacidade, entre em contato conosco:",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
  }

  const pageContent = content[language] || content.en

  if (!pageContent) {
    notFound()
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{pageContent.title}</h1>
          <p className="text-sm text-muted-foreground mb-8">{pageContent.lastUpdated}</p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            {pageContent.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">{section.heading}</h2>
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="mb-4 text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

