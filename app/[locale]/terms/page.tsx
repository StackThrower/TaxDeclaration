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
    uk: "Умови використання",
    pl: "Warunki użytkowania",
    en: "Terms of Use",
    fr: "Conditions d'utilisation",
    de: "Nutzungsbedingungen",
    es: "Términos de uso",
    pt: "Termos de Uso",
  }

  const descriptions: Record<string, string> = {
    uk: "Умови використання сервісу monegoo.com для заповнення податкових декларацій",
    pl: "Warunki korzystania z usługi monegoo.com do wypełniania deklaracji podatkowych",
    en: "Terms of use for the monegoo.com service for filling out tax returns",
    fr: "Conditions d'utilisation du service monegoo.com pour remplir les déclarations fiscales",
    de: "Nutzungsbedingungen für den monegoo.com-Service zum Ausfüllen von Steuererklärungen",
    es: "Términos de uso del servicio monegoo.com para completar declaraciones de impuestos",
    pt: "Termos de uso do serviço monegoo.com para preencher declarações fiscais",
  }

  return {
    title: titles[language] || titles.en,
    description: descriptions[language] || descriptions.en,
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  const language = locale.split("-")[0]

  const content: Record<string, {
    title: string
    lastUpdated: string
    sections: Array<{ heading: string; content: string[] }>
  }> = {
    uk: {
      title: "Умови використання",
      lastUpdated: "Останнє оновлення: 18 грудня 2024",
      sections: [
        {
          heading: "1. Прийняття умов",
          content: [
            "Використовуючи сервіс monegoo.com, ви погоджуєтесь з цими умовами використання. Якщо ви не згодні з будь-якою частиною цих умов, ви не повинні використовувати наш сервіс.",
            "Сервіс monegoo.com надається \"як є\" без будь-яких гарантій явних чи неявних.",
          ],
        },
        {
          heading: "2. Опис сервісу",
          content: [
            "monegoo.com – це безкоштовний інструмент для заповнення податкових декларацій.",
            "Сервіс дозволяє:",
            "• Заповнювати податкові форми онлайн",
            "• Генерувати PDF-документи з податковими деklarацями",
            "• Розраховувати податки на основі введених даних",
            "• Експортувати дані в Excel для перевірки розрахунків",
            "Важливо: Всі розрахунки та генерація документів виконуються локально у вашому браузері. Ми НЕ зберігаємо ваші податкові дані на серверах.",
          ],
        },
        {
          heading: "3. Відповідальність користувача",
          content: [
            "Користувач несе повну відповідальність за:",
            "• Достовірність введених даних",
            "• Правильність заповнення форм",
            "• Перевірку розрахунків перед поданням декларації",
            "• Відповідність поданих документів вимогам податкових органів",
            "Ми настійно рекомендуємо перевірити всі згенеровані документи та розрахунки з кваліфікованим податковим консультантом або бухгалтером перед поданням до податкових органів.",
          ],
        },
        {
          heading: "4. Обмеження відповідальності",
          content: [
            "monegoo.com та його розробники НЕ НЕСУТЬ ВІДПОВІДАЛЬНОСТІ за:",
            "• Помилки в розрахунках",
            "• Збитки, понесені внаслідок використання сервісу",
            "• Штрафи або санкції від податкових органів",
            "• Втрату даних",
            "• Будь-які прямі чи непрямі збитки, пов'язані з використанням сервісу",
            "Сервіс призначений виключно для інформаційних цілей і не є професійною податковою консультацією.",
          ],
        },
        {
          heading: "5. Інтелектуальна власність",
          content: [
            "Всі права на дизайн, код, логотипи та контент сайту monegoo.com належать його розробникам.",
            "Ви маєте право використовувати сервіс для особистих некомерційних цілей.",
            "Заборонено:",
            "• Копіювати, модифікувати або розповсюджувати код сайту без дозволу",
            "• Використовувати сервіс в комерційних цілях без дозволу",
            "• Створювати похідні роботи на основі нашого сервісу",
          ],
        },
        {
          heading: "6. Зміни в сервісі",
          content: [
            "Ми залишаємо за собою право:",
            "• Змінювати або припиняти надання сервісу в будь-який час",
            "• Оновлювати функціональність та інтерфейс",
            "• Вносити зміни в ці умови використання",
            "Всі зміни будуть опубліковані на цій сторінці з оновленою датою.",
          ],
        },
        {
          heading: "7. Безпека",
          content: [
            "Ми не зберігаємо ваші податкові дані на наших серверах. Всі дані обробляються локально у вашому браузері.",
            "Ви несете відповідальність за:",
            "• Захист згенерованих PDF-файлів паролем (якщо необхідно)",
            "• Безпечне зберігання документів",
            "• Захист вашого пристрою від несанкціонованого доступу",
          ],
        },
        {
          heading: "8. Відмова від гарантій",
          content: [
            "Сервіс надається \"як є\" без будь-яких гарантій щодо:",
            "• Точності розрахунків",
            "• Відповідності законодавству",
            "• Безперервної роботи сервісу",
            "• Відсутності помилок",
            "Використовуйте сервіс на власний ризик.",
          ],
        },
        {
          heading: "9. Застосовне право",
          content: [
            "Ці умови регулюються законодавством країни, в якій зареєстровані розробники сервісу.",
            "Будь-які суперечки вирішуються шляхом переговорів або в судовому порядку.",
          ],
        },
        {
          heading: "10. Контакти",
          content: [
            "Якщо у вас є питання щодо умов використання, зв'яжіться з нами:",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    pl: {
      title: "Warunki użytkowania",
      lastUpdated: "Ostatnia aktualizacja: 18 grudnia 2024",
      sections: [
        {
          heading: "1. Akceptacja warunków",
          content: [
            "Korzystając z usługi monegoo.com, akceptujesz te warunki użytkowania. Jeśli nie zgadzasz się z jakąkolwiek częścią tych warunków, nie powinieneś korzystać z naszej usługi.",
            "Usługa monegoo.com jest świadczona \"tak jak jest\" bez żadnych gwarancji, wyraźnych lub dorozumianych.",
          ],
        },
        {
          heading: "2. Opis usługi",
          content: [
            "monegoo.com to darmowe narzędzie do wypełniania deklaracji podatkowych.",
            "Usługa umożliwia:",
            "• Wypełnianie formularzy podatkowych online",
            "• Generowanie dokumentów PDF z deklaracjami podatkowymi",
            "• Obliczanie podatków na podstawie wprowadzonych danych",
            "• Eksportowanie danych do Excel w celu weryfikacji obliczeń",
            "Ważne: Wszystkie obliczenia i generowanie dokumentów odbywa się lokalnie w Twojej przeglądarce. NIE przechowujemy Twoich danych podatkowych na serwerach.",
          ],
        },
        {
          heading: "3. Odpowiedzialność użytkownika",
          content: [
            "Użytkownik ponosi pełną odpowiedzialność za:",
            "• Prawdziwość wprowadzonych danych",
            "• Poprawność wypełnienia formularzy",
            "• Weryfikację obliczeń przed złożeniem deklaracji",
            "• Zgodność złożonych dokumentów z wymogami urzędów skarbowych",
            "Zdecydowanie zalecamy sprawdzenie wszystkich wygenerowanych dokumentów i obliczeń z wykwalifikowanym doradcą podatkowym lub księgowym przed złożeniem do urzędu skarbowego.",
          ],
        },
        {
          heading: "4. Ograniczenie odpowiedzialności",
          content: [
            "monegoo.com i jego twórcy NIE PONOSZĄ ODPOWIEDZIALNOŚCI za:",
            "• Błędy w obliczeniach",
            "• Szkody poniesione w wyniku korzystania z usługi",
            "• Kary lub sankcje od urzędów skarbowych",
            "• Utratę danych",
            "• Jakiekolwiek bezpośrednie lub pośrednie szkody związane z korzystaniem z usługi",
            "Usługa jest przeznaczona wyłącznie do celów informacyjnych i nie stanowi profesjonalnego doradztwa podatkowego.",
          ],
        },
        {
          heading: "5. Własność intelektualna",
          content: [
            "Wszystkie prawa do projektu, kodu, logo i treści strony monegoo.com należą do jej twórców.",
            "Masz prawo korzystać z usługi do osobistych celów niekomercyjnych.",
            "Zabronione jest:",
            "• Kopiowanie, modyfikowanie lub rozpowszechnianie kodu strony bez zgody",
            "• Używanie usługi w celach komercyjnych bez zgody",
            "• Tworzenie dzieł pochodnych na podstawie naszej usługi",
          ],
        },
        {
          heading: "6. Zmiany w usłudze",
          content: [
            "Zastrzegamy sobie prawo do:",
            "• Zmiany lub zaprzestania świadczenia usługi w dowolnym momencie",
            "• Aktualizacji funkcjonalności i interfejsu",
            "• Wprowadzania zmian w tych warunkach użytkowania",
            "Wszystkie zmiany zostaną opublikowane na tej stronie z zaktualizowaną datą.",
          ],
        },
        {
          heading: "7. Bezpieczeństwo",
          content: [
            "Nie przechowujemy Twoich danych podatkowych na naszych serwerach. Wszystkie dane są przetwarzane lokalnie w Twojej przeglądarce.",
            "Jesteś odpowiedzialny za:",
            "• Zabezpieczenie wygenerowanych plików PDF hasłem (jeśli to konieczne)",
            "• Bezpieczne przechowywanie dokumentów",
            "• Zabezpieczenie swojego urządzenia przed nieautoryzowanym dostępem",
          ],
        },
        {
          heading: "8. Wyłączenie gwarancji",
          content: [
            "Usługa jest świadczona \"tak jak jest\" bez żadnych gwarancji dotyczących:",
            "• Dokładności obliczeń",
            "• Zgodności z prawem",
            "• Ciągłości działania usługi",
            "• Braku błędów",
            "Korzystasz z usługi na własne ryzyko.",
          ],
        },
        {
          heading: "9. Prawo właściwe",
          content: [
            "Te warunki podlegają prawu kraju, w którym zarejestrowani są twórcy usługi.",
            "Wszelkie spory są rozwiązywane w drodze negocjacji lub na drodze sądowej.",
          ],
        },
        {
          heading: "10. Kontakt",
          content: [
            "Jeśli masz pytania dotyczące warunków użytkowania, skontaktuj się z nami:",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    en: {
      title: "Terms of Use",
      lastUpdated: "Last updated: December 18, 2024",
      sections: [
        {
          heading: "1. Acceptance of Terms",
          content: [
            "By using the monegoo.com service, you agree to these terms of use. If you do not agree with any part of these terms, you should not use our service.",
            "The monegoo.com service is provided \"as is\" without any warranties, express or implied.",
          ],
        },
        {
          heading: "2. Service Description",
          content: [
            "monegoo.com is a free tool for filling out tax returns.",
            "The service allows you to:",
            "• Fill out tax forms online",
            "• Generate PDF documents with tax returns",
            "• Calculate taxes based on entered data",
            "• Export data to Excel for calculation verification",
            "Important: All calculations and document generation are performed locally in your browser. We DO NOT store your tax data on servers.",
          ],
        },
        {
          heading: "3. User Responsibility",
          content: [
            "The user bears full responsibility for:",
            "• Accuracy of entered data",
            "• Correctness of form completion",
            "• Verification of calculations before filing the return",
            "• Compliance of submitted documents with tax authority requirements",
            "We strongly recommend verifying all generated documents and calculations with a qualified tax consultant or accountant before filing with tax authorities.",
          ],
        },
        {
          heading: "4. Limitation of Liability",
          content: [
            "monegoo.com and its developers ARE NOT LIABLE for:",
            "• Errors in calculations",
            "• Damages incurred as a result of using the service",
            "• Penalties or sanctions from tax authorities",
            "• Data loss",
            "• Any direct or indirect damages related to using the service",
            "The service is intended for informational purposes only and does not constitute professional tax advice.",
          ],
        },
        {
          heading: "5. Intellectual Property",
          content: [
            "All rights to the design, code, logos, and content of the monegoo.com site belong to its developers.",
            "You have the right to use the service for personal non-commercial purposes.",
            "It is forbidden to:",
            "• Copy, modify, or distribute the site code without permission",
            "• Use the service for commercial purposes without permission",
            "• Create derivative works based on our service",
          ],
        },
        {
          heading: "6. Changes to the Service",
          content: [
            "We reserve the right to:",
            "• Change or discontinue the service at any time",
            "• Update functionality and interface",
            "• Make changes to these terms of use",
            "All changes will be posted on this page with an updated date.",
          ],
        },
        {
          heading: "7. Security",
          content: [
            "We do not store your tax data on our servers. All data is processed locally in your browser.",
            "You are responsible for:",
            "• Password-protecting generated PDF files (if necessary)",
            "• Secure storage of documents",
            "• Protecting your device from unauthorized access",
          ],
        },
        {
          heading: "8. Disclaimer of Warranties",
          content: [
            "The service is provided \"as is\" without any warranties regarding:",
            "• Accuracy of calculations",
            "• Compliance with legislation",
            "• Continuous operation of the service",
            "• Absence of errors",
            "Use the service at your own risk.",
          ],
        },
        {
          heading: "9. Applicable Law",
          content: [
            "These terms are governed by the law of the country where the service developers are registered.",
            "Any disputes are resolved through negotiation or in court.",
          ],
        },
        {
          heading: "10. Contact",
          content: [
            "If you have questions about the terms of use, contact us:",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    fr: {
      title: "Conditions d'utilisation",
      lastUpdated: "Dernière mise à jour : 18 décembre 2024",
      sections: [
        {
          heading: "1. Acceptation des conditions",
          content: [
            "En utilisant le service monegoo.com, vous acceptez ces conditions d'utilisation. Si vous n'êtes pas d'accord avec une partie de ces conditions, vous ne devez pas utiliser notre service.",
            "Le service monegoo.com est fourni \"tel quel\" sans aucune garantie, expresse ou implicite.",
          ],
        },
        {
          heading: "2. Description du service",
          content: [
            "monegoo.com est un outil gratuit pour remplir les déclarations fiscales.",
            "Le service vous permet de :",
            "• Remplir des formulaires fiscaux en ligne",
            "• Générer des documents PDF avec des déclarations fiscales",
            "• Calculer les impôts sur la base des données saisies",
            "• Exporter les données vers Excel pour vérifier les calculs",
            "Important : Tous les calculs et la génération de documents sont effectués localement dans votre navigateur. Nous NE stockons PAS vos données fiscales sur des serveurs.",
          ],
        },
        {
          heading: "3. Responsabilité de l'utilisateur",
          content: [
            "L'utilisateur assume l'entière responsabilité pour :",
            "• L'exactitude des données saisies",
            "• L'exactitude du remplissage des formulaires",
            "• La vérification des calculs avant de soumettre la déclaration",
            "• La conformité des documents soumis aux exigences des autorités fiscales",
            "Nous recommandons fortement de vérifier tous les documents et calculs générés avec un conseiller fiscal ou un comptable qualifié avant de les soumettre aux autorités fiscales.",
          ],
        },
        {
          heading: "4. Limitation de responsabilité",
          content: [
            "monegoo.com et ses développeurs NE SONT PAS RESPONSABLES de :",
            "• Erreurs dans les calculs",
            "• Dommages subis suite à l'utilisation du service",
            "• Pénalités ou sanctions des autorités fiscales",
            "• Perte de données",
            "• Tout dommage direct ou indirect lié à l'utilisation du service",
            "Le service est destiné uniquement à des fins informatives et ne constitue pas un conseil fiscal professionnel.",
          ],
        },
        {
          heading: "5. Propriété intellectuelle",
          content: [
            "Tous les droits sur la conception, le code, les logos et le contenu du site monegoo.com appartiennent à ses développeurs.",
            "Vous avez le droit d'utiliser le service à des fins personnelles non commerciales.",
            "Il est interdit de :",
            "• Copier, modifier ou distribuer le code du site sans autorisation",
            "• Utiliser le service à des fins commerciales sans autorisation",
            "• Créer des œuvres dérivées basées sur notre service",
          ],
        },
        {
          heading: "6. Modifications du service",
          content: [
            "Nous nous réservons le droit de :",
            "• Modifier ou interrompre le service à tout moment",
            "• Mettre à jour les fonctionnalités et l'interface",
            "• Apporter des modifications à ces conditions d'utilisation",
            "Toutes les modifications seront publiées sur cette page avec une date mise à jour.",
          ],
        },
        {
          heading: "7. Sécurité",
          content: [
            "Nous ne stockons pas vos données fiscales sur nos serveurs. Toutes les données sont traitées localement dans votre navigateur.",
            "Vous êtes responsable de :",
            "• Protéger par mot de passe les fichiers PDF générés (si nécessaire)",
            "• Stockage sécurisé des documents",
            "• Protection de votre appareil contre l'accès non autorisé",
          ],
        },
        {
          heading: "8. Exclusion de garanties",
          content: [
            "Le service est fourni \"tel quel\" sans aucune garantie concernant :",
            "• L'exactitude des calculs",
            "• La conformité à la législation",
            "• Le fonctionnement continu du service",
            "• L'absence d'erreurs",
            "Utilisez le service à vos propres risques.",
          ],
        },
        {
          heading: "9. Droit applicable",
          content: [
            "Ces conditions sont régies par la loi du pays où les développeurs du service sont enregistrés.",
            "Tout litige est résolu par négociation ou devant les tribunaux.",
          ],
        },
        {
          heading: "10. Contact",
          content: [
            "Si vous avez des questions concernant les conditions d'utilisation, contactez-nous :",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    de: {
      title: "Nutzungsbedingungen",
      lastUpdated: "Letzte Aktualisierung: 18. Dezember 2024",
      sections: [
        {
          heading: "1. Annahme der Bedingungen",
          content: [
            "Durch die Nutzung des monegoo.com-Dienstes stimmen Sie diesen Nutzungsbedingungen zu. Wenn Sie mit einem Teil dieser Bedingungen nicht einverstanden sind, sollten Sie unseren Dienst nicht nutzen.",
            "Der monegoo.com-Dienst wird \"wie besehen\" ohne jegliche ausdrückliche oder stillschweigende Garantien bereitgestellt.",
          ],
        },
        {
          heading: "2. Dienstbeschreibung",
          content: [
            "monegoo.com ist ein kostenloses Tool zum Ausfüllen von Steuererklärungen.",
            "Der Dienst ermöglicht Ihnen:",
            "• Steuerformulare online auszufüllen",
            "• PDF-Dokumente mit Steuererklärungen zu generieren",
            "• Steuern auf Basis eingegebener Daten zu berechnen",
            "• Daten zur Überprüfung der Berechnungen nach Excel zu exportieren",
            "Wichtig: Alle Berechnungen und die Dokumentengenerierung erfolgen lokal in Ihrem Browser. Wir speichern Ihre Steuerdaten NICHT auf Servern.",
          ],
        },
        {
          heading: "3. Verantwortung des Nutzers",
          content: [
            "Der Nutzer trägt die volle Verantwortung für:",
            "• Richtigkeit der eingegebenen Daten",
            "• Korrektheit beim Ausfüllen der Formulare",
            "• Überprüfung der Berechnungen vor Einreichung der Erklärung",
            "• Einhaltung der Anforderungen der Steuerbehörden bei eingereichten Dokumenten",
            "Wir empfehlen dringend, alle generierten Dokumente und Berechnungen mit einem qualifizierten Steuerberater zu überprüfen, bevor Sie sie bei den Steuerbehörden einreichen.",
          ],
        },
        {
          heading: "4. Haftungsbeschränkung",
          content: [
            "monegoo.com und seine Entwickler HAFTEN NICHT für:",
            "• Fehler in Berechnungen",
            "• Schäden, die durch die Nutzung des Dienstes entstehen",
            "• Strafen oder Sanktionen von Steuerbehörden",
            "• Datenverlust",
            "• Direkte oder indirekte Schäden im Zusammenhang mit der Nutzung des Dienstes",
            "Der Dienst dient nur zu Informationszwecken und stellt keine professionelle Steuerberatung dar.",
          ],
        },
        {
          heading: "5. Geistiges Eigentum",
          content: [
            "Alle Rechte an Design, Code, Logos und Inhalten der monegoo.com-Website gehören ihren Entwicklern.",
            "Sie haben das Recht, den Dienst für persönliche, nicht-kommerzielle Zwecke zu nutzen.",
            "Es ist verboten:",
            "• Den Code der Website ohne Genehmigung zu kopieren, zu modifizieren oder zu verbreiten",
            "• Den Dienst ohne Genehmigung für kommerzielle Zwecke zu nutzen",
            "• Abgeleitete Werke auf Basis unseres Dienstes zu erstellen",
          ],
        },
        {
          heading: "6. Änderungen am Dienst",
          content: [
            "Wir behalten uns das Recht vor:",
            "• Den Dienst jederzeit zu ändern oder einzustellen",
            "• Funktionalität und Benutzeroberfläche zu aktualisieren",
            "• Diese Nutzungsbedingungen zu ändern",
            "Alle Änderungen werden auf dieser Seite mit aktualisiertem Datum veröffentlicht.",
          ],
        },
        {
          heading: "7. Sicherheit",
          content: [
            "Wir speichern Ihre Steuerdaten nicht auf unseren Servern. Alle Daten werden lokal in Ihrem Browser verarbeitet.",
            "Sie sind verantwortlich für:",
            "• Passwortschutz generierter PDF-Dateien (falls erforderlich)",
            "• Sichere Aufbewahrung von Dokumenten",
            "• Schutz Ihres Geräts vor unbefugtem Zugriff",
          ],
        },
        {
          heading: "8. Gewährleistungsausschluss",
          content: [
            "Der Dienst wird \"wie besehen\" ohne Garantien bereitgestellt bezüglich:",
            "• Genauigkeit der Berechnungen",
            "• Einhaltung der Gesetzgebung",
            "• Kontinuierlichen Betrieb des Dienstes",
            "• Fehlerfreiheit",
            "Nutzen Sie den Dienst auf eigenes Risiko.",
          ],
        },
        {
          heading: "9. Anwendbares Recht",
          content: [
            "Diese Bedingungen unterliegen dem Recht des Landes, in dem die Entwickler des Dienstes registriert sind.",
            "Streitigkeiten werden durch Verhandlung oder vor Gericht beigelegt.",
          ],
        },
        {
          heading: "10. Kontakt",
          content: [
            "Wenn Sie Fragen zu den Nutzungsbedingungen haben, kontaktieren Sie uns:",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    es: {
      title: "Términos de uso",
      lastUpdated: "Última actualización: 18 de diciembre de 2024",
      sections: [
        {
          heading: "1. Aceptación de términos",
          content: [
            "Al utilizar el servicio monegoo.com, acepta estos términos de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.",
            "El servicio monegoo.com se proporciona \"tal cual\" sin ninguna garantía, expresa o implícita.",
          ],
        },
        {
          heading: "2. Descripción del servicio",
          content: [
            "monegoo.com es una herramienta gratuita para completar declaraciones de impuestos.",
            "El servicio le permite:",
            "• Completar formularios fiscales en línea",
            "• Generar documentos PDF con declaraciones de impuestos",
            "• Calcular impuestos basados en los datos ingresados",
            "• Exportar datos a Excel para verificar cálculos",
            "Importante: Todos los cálculos y la generación de documentos se realizan localmente en su navegador. NO almacenamos sus datos fiscales en servidores.",
          ],
        },
        {
          heading: "3. Responsabilidad del usuario",
          content: [
            "El usuario asume la responsabilidad total por:",
            "• Exactitud de los datos ingresados",
            "• Corrección en el llenado de formularios",
            "• Verificación de cálculos antes de presentar la declaración",
            "• Cumplimiento de los documentos presentados con los requisitos de las autoridades fiscales",
            "Recomendamos encarecidamente verificar todos los documentos y cálculos generados con un asesor fiscal o contador calificado antes de presentarlos a las autoridades fiscales.",
          ],
        },
        {
          heading: "4. Limitación de responsabilidad",
          content: [
            "monegoo.com y sus desarrolladores NO SON RESPONSABLES de:",
            "• Errores en los cálculos",
            "• Daños incurridos como resultado del uso del servicio",
            "• Multas o sanciones de las autoridades fiscales",
            "• Pérdida de datos",
            "• Cualquier daño directo o indirecto relacionado con el uso del servicio",
            "El servicio está destinado únicamente con fines informativos y no constituye asesoramiento fiscal profesional.",
          ],
        },
        {
          heading: "5. Propiedad intelectual",
          content: [
            "Todos los derechos sobre el diseño, código, logotipos y contenido del sitio monegoo.com pertenecen a sus desarrolladores.",
            "Tiene derecho a utilizar el servicio para fines personales no comerciales.",
            "Está prohibido:",
            "• Copiar, modificar o distribuir el código del sitio sin permiso",
            "• Usar el servicio con fines comerciales sin permiso",
            "• Crear obras derivadas basadas en nuestro servicio",
          ],
        },
        {
          heading: "6. Cambios en el servicio",
          content: [
            "Nos reservamos el derecho de:",
            "• Cambiar o interrumpir el servicio en cualquier momento",
            "• Actualizar funcionalidad e interfaz",
            "• Realizar cambios en estos términos de uso",
            "Todos los cambios se publicarán en esta página con una fecha actualizada.",
          ],
        },
        {
          heading: "7. Seguridad",
          content: [
            "No almacenamos sus datos fiscales en nuestros servidores. Todos los datos se procesan localmente en su navegador.",
            "Usted es responsable de:",
            "• Proteger con contraseña los archivos PDF generados (si es necesario)",
            "• Almacenamiento seguro de documentos",
            "• Proteger su dispositivo del acceso no autorizado",
          ],
        },
        {
          heading: "8. Renuncia de garantías",
          content: [
            "El servicio se proporciona \"tal cual\" sin ninguna garantía con respecto a:",
            "• Exactitud de los cálculos",
            "• Cumplimiento de la legislación",
            "• Operación continua del servicio",
            "• Ausencia de errores",
            "Use el servicio bajo su propio riesgo.",
          ],
        },
        {
          heading: "9. Ley aplicable",
          content: [
            "Estos términos se rigen por la ley del país donde están registrados los desarrolladores del servicio.",
            "Cualquier disputa se resuelve mediante negociación o en los tribunales.",
          ],
        },
        {
          heading: "10. Contacto",
          content: [
            "Si tiene preguntas sobre los términos de uso, contáctenos:",
            "Email: 0x01code@gmail.com",
          ],
        },
      ],
    },
    pt: {
      title: "Termos de Uso",
      lastUpdated: "Última atualização: 18 de dezembro de 2024",
      sections: [
        {
          heading: "1. Aceitação dos termos",
          content: [
            "Ao usar o serviço monegoo.com, você concorda com estes termos de uso. Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.",
            "O serviço monegoo.com é fornecido \"como está\" sem quaisquer garantias, expressas ou implícitas.",
          ],
        },
        {
          heading: "2. Descrição do serviço",
          content: [
            "monegoo.com é uma ferramenta gratuita para preencher declarações fiscais.",
            "O serviço permite que você:",
            "• Preencha formulários fiscais online",
            "• Gere documentos PDF com declarações fiscais",
            "• Calcule impostos com base nos dados inseridos",
            "• Exporte dados para Excel para verificar cálculos",
            "Importante: Todos os cálculos e geração de documentos são realizados localmente em seu navegador. NÃO armazenamos seus dados fiscais em servidores.",
          ],
        },
        {
          heading: "3. Responsabilidade do usuário",
          content: [
            "O usuário assume total responsabilidade por:",
            "• Exatidão dos dados inseridos",
            "• Correção no preenchimento dos formulários",
            "• Verificação dos cálculos antes de apresentar a declaração",
            "• Conformidade dos documentos apresentados com os requisitos das autoridades fiscais",
            "Recomendamos fortemente verificar todos os documentos e cálculos gerados com um consultor fiscal ou contador qualificado antes de apresentá-los às autoridades fiscais.",
          ],
        },
        {
          heading: "4. Limitação de responsabilidade",
          content: [
            "monegoo.com e seus desenvolvedores NÃO SÃO RESPONSÁVEIS por:",
            "• Erros nos cálculos",
            "• Danos incorridos como resultado do uso do serviço",
            "• Multas ou sanções das autoridades fiscais",
            "• Perda de dados",
            "• Quaisquer danos diretos ou indiretos relacionados ao uso do serviço",
            "O serviço destina-se apenas a fins informativos e não constitui aconselhamento fiscal profissional.",
          ],
        },
        {
          heading: "5. Propriedade intelectual",
          content: [
            "Todos os direitos sobre o design, código, logotipos e conteúdo do site monegoo.com pertencem aos seus desenvolvedores.",
            "Você tem o direito de usar o serviço para fins pessoais não comerciais.",
            "É proibido:",
            "• Copiar, modificar ou distribuir o código do site sem permissão",
            "• Usar o serviço para fins comerciais sem permissão",
            "• Criar obras derivadas baseadas em nosso serviço",
          ],
        },
        {
          heading: "6. Alterações no serviço",
          content: [
            "Reservamo-nos o direito de:",
            "• Alterar ou descontinuar o serviço a qualquer momento",
            "• Atualizar funcionalidade e interface",
            "• Fazer alterações nestes termos de uso",
            "Todas as alterações serão publicadas nesta página com uma data atualizada.",
          ],
        },
        {
          heading: "7. Segurança",
          content: [
            "Não armazenamos seus dados fiscais em nossos servidores. Todos os dados são processados localmente em seu navegador.",
            "Você é responsável por:",
            "• Proteger com senha os arquivos PDF gerados (se necessário)",
            "• Armazenamento seguro de documentos",
            "• Proteger seu dispositivo de acesso não autorizado",
          ],
        },
        {
          heading: "8. Isenção de garantias",
          content: [
            "O serviço é fornecido \"como está\" sem quaisquer garantias quanto a:",
            "• Exatidão dos cálculos",
            "• Conformidade com a legislação",
            "• Operação contínua do serviço",
            "• Ausência de erros",
            "Use o serviço por sua conta e risco.",
          ],
        },
        {
          heading: "9. Lei aplicável",
          content: [
            "Estes termos são regidos pela lei do país onde os desenvolvedores do serviço estão registrados.",
            "Quaisquer disputas são resolvidas por negociação ou nos tribunais.",
          ],
        },
        {
          heading: "10. Contato",
          content: [
            "Se você tiver dúvidas sobre os termos de uso, entre em contato conosco:",
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

