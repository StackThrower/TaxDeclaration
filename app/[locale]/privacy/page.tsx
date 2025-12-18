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
    uk: "Політика конфіденційності | Monegoo",
    pl: "Polityka prywatności | Monegoo",
    en: "Privacy Policy | Monegoo",
    fr: "Politique de confidentialité | Monegoo",
    de: "Datenschutzrichtlinie | Monegoo",
    es: "Política de privacidad | Monegoo",
    pt: "Política de Privacidade | Monegoo",
  }

  const descriptions: Record<string, string> = {
    uk: "Дізнайтеся, як ми захищаємо вашу конфіденційність і обробляємо ваші дані на monegoo.com",
    pl: "Dowiedz się, jak chronimy Twoją prywatność i przetwarzamy Twoje dane w monegoo.com",
    en: "Learn how we protect your privacy and handle your data on monegoo.com",
    fr: "Découvrez comment nous protégeons votre vie privée et traitons vos données sur monegoo.com",
    de: "Erfahren Sie, wie wir Ihre Privatsphäre schützen und Ihre Daten auf monegoo.com verarbeiten",
    es: "Descubra cómo protegemos su privacidad y manejamos sus datos en monegoo.com",
    pt: "Saiba como protegemos sua privacidade e tratamos seus dados no monegoo.com",
  }

  return {
    title: titles[language] || titles.en,
    description: descriptions[language] || descriptions.en,
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
      lastUpdated: "Останнє оновлення: 18 грудня 2024",
      sections: [
        {
          heading: "1. Збір та використання даних",
          content: [
            "monegoo.com – це безкоштовний інструмент для заповнення податкових декларацій. Ми серйозно ставимося до захисту вашої конфіденційності.",
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
          heading: "7. Контакти",
          content: [
            "Якщо у вас є питання щодо нашої політики конфіденційності, зв'яжіться з нами:",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    pl: {
      title: "Polityka prywatności",
      lastUpdated: "Ostatnia aktualizacja: 18 grudnia 2024",
      sections: [
        {
          heading: "1. Zbieranie i wykorzystanie danych",
          content: [
            "monegoo.com to darmowe narzędzie do wypełniania deklaracji podatkowych. Poważnie traktujemy ochronę Twojej prywatności.",
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
          heading: "7. Kontakt",
          content: [
            "Jeśli masz pytania dotyczące naszej polityki prywatności, skontaktuj się z nami:",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: December 18, 2024",
      sections: [
        {
          heading: "1. Data Collection and Use",
          content: [
            "monegoo.com is a free tool for filling out tax returns. We take your privacy seriously.",
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
          heading: "7. Contact",
          content: [
            "If you have questions about our privacy policy, contact us:",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    fr: {
      title: "Politique de confidentialité",
      lastUpdated: "Dernière mise à jour : 18 décembre 2024",
      sections: [
        {
          heading: "1. Collecte et utilisation des données",
          content: [
            "monegoo.com est un outil gratuit pour remplir les déclarations fiscales. Nous prenons votre vie privée au sérieux.",
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
          heading: "7. Contact",
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
            "monegoo.com ist ein kostenloses Tool zum Ausfüllen von Steuererklärungen. Wir nehmen Ihre Privatsphäre ernst.",
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
          heading: "7. Kontakt",
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
            "monegoo.com es una herramienta gratuita para completar declaraciones de impuestos. Nos tomamos en serio su privacidad.",
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
          heading: "7. Contacto",
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
            "monegoo.com é uma ferramenta gratuita para preencher declarações fiscais. Levamos sua privacidade a sério.",
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
          heading: "7. Contato",
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

