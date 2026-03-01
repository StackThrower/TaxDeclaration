import { type Metadata } from "next"
import { type Language } from "./i18n"
import { type CountryCode, countries } from "./countries"

// SEO-friendly metadata for each country and language
export type SEOMetadata = {
  title: string
  description: string
  keywords: string[]
}

// Generate SEO metadata based on country and language
export function generateSEOMetadata(
  countryCode: CountryCode,
  language: Language
): SEOMetadata {
  const country = countries[countryCode]

  // Get tax forms for this country
  const formTitles = country.taxForms.map((f) => f.title).join(", ")
  const formDescriptions = country.taxForms.map((f) => f.description).join("; ")

  // Define metadata for each language and country combination
  const metadata: Record<Language, Record<CountryCode, SEOMetadata>> = {
    uk: {
      ua: {
        title: `Генератор декларації про майновий стан та доходи ${new Date().getFullYear()}`,
        description: `Заповніть податкову декларацію про майновий стан та доходи онлайн для розрахунку ПДФО та військового збору від інвестицій. Безкоштовний сервіс для громадян України.`,
        keywords: [
          "податкова декларація",
          "F0100214",
          "F0121214",
          "Ф1",
          "ПДФО",
          "військовий збір",
          "декларація про доходи",
          "майновий стан",
          "інвестиції",
          "податки Україна",
          "онлайн декларація",
        ],
      },
      pl: {
        title: `Rozliczenie podatkowe PIT ${formTitles} - Polska ${new Date().getFullYear()}`,
        description: `Składaj zeznania podatkowe online: ${formDescriptions}. Darmowa pomoc w rozliczeniu PIT dla obywateli Polski.`,
        keywords: [
          "PIT",
          "zeznanie podatkowe",
          "rozliczenie podatkowe",
          "deklaracja",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      fr: {
        title: `Déclaration d'impôts ${formTitles} - France ${new Date().getFullYear()}`,
        description: `Remplissez votre déclaration d'impôts en ligne: ${formDescriptions}. Service gratuit pour les résidents français.`,
        keywords: [
          "déclaration d'impôts",
          "impôts France",
          "formulaire fiscal",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      de: {
        title: `Steuererklärung ${formTitles} - Deutschland ${new Date().getFullYear()}`,
        description: `Füllen Sie Ihre Steuererklärung online aus: ${formDescriptions}. Kostenloser Service für deutsche Steuerzahler.`,
        keywords: [
          "Steuererklärung",
          "Einkommensteuer",
          "Steuerformular",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      pt: {
        title: `Declaração de IRS ${formTitles} - Portugal ${new Date().getFullYear()}`,
        description: `Preencha a sua declaração de IRS online: ${formDescriptions}. Serviço gratuito para contribuintes portugueses.`,
        keywords: [
          "IRS",
          "declaração de impostos",
          "finanças",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      es: {
        title: `Declaración de la Renta ${formTitles} - España ${new Date().getFullYear()}`,
        description: `Complete su declaración de la renta online: ${formDescriptions}. Servicio gratuito para contribuyentes españoles.`,
        keywords: [
          "declaración de la renta",
          "IRPF",
          "modelo",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      se: {
        title: `Inkomstdeklaration ${formTitles} - Sverige ${new Date().getFullYear()}`,
        description: `Fyll i din inkomstdeklaration online: ${formDescriptions}. Gratis tjänst för svenska skattebetalare.`,
        keywords: [
          "inkomstdeklaration",
          "skattedeklaration",
          "Skatteverket",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      gb: {
        title: `Tax Return ${formTitles} - United Kingdom ${new Date().getFullYear()}`,
        description: `Complete your tax return online: ${formDescriptions}. Free service for UK taxpayers.`,
        keywords: [
          "tax return",
          "self assessment",
          "HMRC",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      us: {
        title: `Tax Return ${formTitles} - United States ${new Date().getFullYear()}`,
        description: `File your tax return online: ${formDescriptions}. Free service for US taxpayers.`,
        keywords: [
          "tax return",
          "IRS",
          "income tax",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      ca: {
        title: `Tax Return ${formTitles} - Canada ${new Date().getFullYear()}`,
        description: `File your tax return online: ${formDescriptions}. Free service for Canadian taxpayers.`,
        keywords: [
          "tax return",
          "CRA",
          "income tax",
          ...country.taxForms.map((f) => f.title),
        ],
      },
    },
    en: {
      ua: {
        title: `Tax Declaration F0100214 & F0121214 - Ukraine ${new Date().getFullYear()}`,
        description: `File your tax declaration online: F0100214 on property status and income, and F0121214 (Annex F1) for calculating personal income tax and military duty on investments. Free service for Ukrainian citizens.`,
        keywords: [
          "tax declaration",
          "F0100214",
          "F0121214",
          "personal income tax",
          "military duty",
          "income declaration",
          "property status",
          "investments",
          "Ukraine taxes",
          "online declaration",
        ],
      },
      pl: {
        title: `Tax Return PIT ${formTitles} - Poland ${new Date().getFullYear()}`,
        description: `File your tax returns online: ${formDescriptions}. Free PIT filing assistance for Polish citizens.`,
        keywords: [
          "PIT",
          "tax return",
          "tax filing",
          "declaration",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      fr: {
        title: `Tax Return ${formTitles} - France ${new Date().getFullYear()}`,
        description: `Complete your tax return online: ${formDescriptions}. Free service for French residents.`,
        keywords: [
          "tax return",
          "France taxes",
          "tax form",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      de: {
        title: `Tax Return ${formTitles} - Germany ${new Date().getFullYear()}`,
        description: `Complete your tax return online: ${formDescriptions}. Free service for German taxpayers.`,
        keywords: [
          "tax return",
          "income tax",
          "tax form",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      pt: {
        title: `IRS Declaration ${formTitles} - Portugal ${new Date().getFullYear()}`,
        description: `Complete your IRS declaration online: ${formDescriptions}. Free service for Portuguese taxpayers.`,
        keywords: [
          "IRS",
          "tax declaration",
          "finance",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      es: {
        title: `Tax Return ${formTitles} - Spain ${new Date().getFullYear()}`,
        description: `Complete your tax return online: ${formDescriptions}. Free service for Spanish taxpayers.`,
        keywords: [
          "tax return",
          "IRPF",
          "tax form",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      se: {
        title: `Income Declaration ${formTitles} - Sweden ${new Date().getFullYear()}`,
        description: `Complete your income declaration online: ${formDescriptions}. Free service for Swedish taxpayers.`,
        keywords: [
          "income declaration",
          "tax declaration",
          "Skatteverket",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      gb: {
        title: `Tax Return ${formTitles} - United Kingdom ${new Date().getFullYear()}`,
        description: `Complete your tax return online: ${formDescriptions}. Free service for UK taxpayers.`,
        keywords: [
          "tax return",
          "self assessment",
          "HMRC",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      us: {
        title: `Tax Return ${formTitles} - United States ${new Date().getFullYear()}`,
        description: `File your tax return online: ${formDescriptions}. Free service for US taxpayers.`,
        keywords: [
          "tax return",
          "IRS",
          "income tax",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      ca: {
        title: `Tax Return ${formTitles} - Canada ${new Date().getFullYear()}`,
        description: `File your tax return online: ${formDescriptions}. Free service for Canadian taxpayers.`,
        keywords: [
          "tax return",
          "CRA",
          "income tax",
          ...country.taxForms.map((f) => f.title),
        ],
      },
    },
    fr: {
      ua: {
        title: `Déclaration fiscale F0100214 et F0121214 - Ukraine ${new Date().getFullYear()}`,
        description: `Remplissez votre déclaration fiscale en ligne: F0100214 sur le patrimoine et les revenus, et F0121214 (Annexe F1) pour le calcul de l'impôt sur le revenu et la taxe militaire sur les investissements.`,
        keywords: [
          "déclaration fiscale",
          "F0100214",
          "F0121214",
          "impôt sur le revenu",
          "taxe militaire",
          "Ukraine",
        ],
      },
      pl: {
        title: `Déclaration fiscale PIT ${formTitles} - Pologne ${new Date().getFullYear()}`,
        description: `Soumettez vos déclarations fiscales en ligne: ${formDescriptions}. Assistance gratuite pour les citoyens polonais.`,
        keywords: ["PIT", "déclaration fiscale", "Pologne", ...country.taxForms.map((f) => f.title)],
      },
      fr: {
        title: `Déclaration d'impôts ${formTitles} - France ${new Date().getFullYear()}`,
        description: `Remplissez votre déclaration d'impôts en ligne: ${formDescriptions}. Service gratuit pour les résidents français.`,
        keywords: [
          "déclaration d'impôts",
          "impôts France",
          "formulaire fiscal",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      de: {
        title: `Déclaration fiscale ${formTitles} - Allemagne ${new Date().getFullYear()}`,
        description: `Remplissez votre déclaration fiscale en ligne: ${formDescriptions}. Service gratuit pour les contribuables allemands.`,
        keywords: ["déclaration fiscale", "Allemagne", ...country.taxForms.map((f) => f.title)],
      },
      pt: {
        title: `Déclaration IRS ${formTitles} - Portugal ${new Date().getFullYear()}`,
        description: `Remplissez votre déclaration IRS en ligne: ${formDescriptions}. Service gratuit pour les contribuables portugais.`,
        keywords: ["IRS", "déclaration fiscale", "Portugal", ...country.taxForms.map((f) => f.title)],
      },
      es: {
        title: `Déclaration fiscale ${formTitles} - Espagne ${new Date().getFullYear()}`,
        description: `Remplissez votre déclaration fiscale en ligne: ${formDescriptions}. Service gratuit pour les contribuables espagnols.`,
        keywords: ["déclaration fiscale", "IRPF", "Espagne", ...country.taxForms.map((f) => f.title)],
      },
      se: {
        title: `Déclaration de revenus ${formTitles} - Suède ${new Date().getFullYear()}`,
        description: `Remplissez votre déclaration de revenus en ligne: ${formDescriptions}. Service gratuit pour les contribuables suédois.`,
        keywords: ["déclaration de revenus", "Suède", ...country.taxForms.map((f) => f.title)],
      },
      gb: {
        title: `Déclaration fiscale ${formTitles} - Royaume-Uni ${new Date().getFullYear()}`,
        description: `Remplissez votre déclaration fiscale en ligne: ${formDescriptions}. Service gratuit pour les contribuables britanniques.`,
        keywords: ["déclaration fiscale", "HMRC", "Royaume-Uni", ...country.taxForms.map((f) => f.title)],
      },
      us: {
        title: `Déclaration fiscale ${formTitles} - États-Unis ${new Date().getFullYear()}`,
        description: `Remplissez votre déclaration fiscale en ligne: ${formDescriptions}. Service gratuit pour les contribuables américains.`,
        keywords: ["déclaration fiscale", "IRS", "États-Unis", ...country.taxForms.map((f) => f.title)],
      },
      ca: {
        title: `Déclaration fiscale ${formTitles} - Canada ${new Date().getFullYear()}`,
        description: `Remplissez votre déclaration fiscale en ligne: ${formDescriptions}. Service gratuit pour les contribuables canadiens.`,
        keywords: ["déclaration fiscale", "ARC", "Canada", ...country.taxForms.map((f) => f.title)],
      },
    },
    pl: {
      ua: {
        title: `Deklaracja podatkowa F0100214 i F0121214 - Ukraina ${new Date().getFullYear()}`,
        description: `Złóż deklarację podatkową online: F0100214 o stanie majątkowym i dochodach oraz F0121214 (Załącznik F1) do obliczania podatku dochodowego i opłaty wojskowej od inwestycji.`,
        keywords: [
          "deklaracja podatkowa",
          "F0100214",
          "F0121214",
          "podatek dochodowy",
          "opłata wojskowa",
          "Ukraina",
        ],
      },
      pl: {
        title: `Rozliczenie podatkowe PIT ${formTitles} - Polska ${new Date().getFullYear()}`,
        description: `Składaj zeznania podatkowe online: ${formDescriptions}. Darmowa pomoc w rozliczeniu PIT dla obywateli Polski.`,
        keywords: [
          "PIT",
          "zeznanie podatkowe",
          "rozliczenie podatkowe",
          "deklaracja",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      fr: {
        title: `Deklaracja podatkowa ${formTitles} - Francja ${new Date().getFullYear()}`,
        description: `Złóż deklarację podatkową online: ${formDescriptions}. Darmowa usługa dla podatników francuskich.`,
        keywords: ["deklaracja podatkowa", "Francja", ...country.taxForms.map((f) => f.title)],
      },
      de: {
        title: `Deklaracja podatkowa ${formTitles} - Niemcy ${new Date().getFullYear()}`,
        description: `Złóż deklarację podatkową online: ${formDescriptions}. Darmowa usługa dla podatników niemieckich.`,
        keywords: ["deklaracja podatkowa", "Niemcy", ...country.taxForms.map((f) => f.title)],
      },
      pt: {
        title: `Deklaracja IRS ${formTitles} - Portugalia ${new Date().getFullYear()}`,
        description: `Złóż deklarację IRS online: ${formDescriptions}. Darmowa usługa dla podatników portugalskich.`,
        keywords: ["IRS", "deklaracja podatkowa", "Portugalia", ...country.taxForms.map((f) => f.title)],
      },
      es: {
        title: `Deklaracja podatkowa ${formTitles} - Hiszpania ${new Date().getFullYear()}`,
        description: `Złóż deklarację podatkową online: ${formDescriptions}. Darmowa usługa dla podatników hiszpańskich.`,
        keywords: ["deklaracja podatkowa", "IRPF", "Hiszpania", ...country.taxForms.map((f) => f.title)],
      },
      se: {
        title: `Deklaracja dochodów ${formTitles} - Szwecja ${new Date().getFullYear()}`,
        description: `Złóż deklarację dochodów online: ${formDescriptions}. Darmowa usługa dla podatników szwedzkich.`,
        keywords: ["deklaracja dochodów", "Szwecja", ...country.taxForms.map((f) => f.title)],
      },
      gb: {
        title: `Deklaracja podatkowa ${formTitles} - Wielka Brytania ${new Date().getFullYear()}`,
        description: `Złóż deklarację podatkową online: ${formDescriptions}. Darmowa usługa dla podatników brytyjskich.`,
        keywords: ["deklaracja podatkowa", "HMRC", "Wielka Brytania", ...country.taxForms.map((f) => f.title)],
      },
      us: {
        title: `Deklaracja podatkowa ${formTitles} - Stany Zjednoczone ${new Date().getFullYear()}`,
        description: `Złóż deklarację podatkową online: ${formDescriptions}. Darmowa usługa dla podatników amerykańskich.`,
        keywords: ["deklaracja podatkowa", "IRS", "USA", ...country.taxForms.map((f) => f.title)],
      },
      ca: {
        title: `Deklaracja podatkowa ${formTitles} - Kanada ${new Date().getFullYear()}`,
        description: `Złóż deklarację podatkową online: ${formDescriptions}. Darmowa usługa dla podatników kanadyjskich.`,
        keywords: ["deklaracja podatkowa", "CRA", "Kanada", ...country.taxForms.map((f) => f.title)],
      },
    },
    es: {
      ua: {
        title: `Declaración fiscal F0100214 y F0121214 - Ucrania ${new Date().getFullYear()}`,
        description: `Presenta tu declaración fiscal en línea: F0100214 sobre el estado patrimonial e ingresos, y F0121214 (Anexo F1) para calcular el impuesto sobre la renta y la tasa militar sobre inversiones.`,
        keywords: [
          "declaración fiscal",
          "F0100214",
          "F0121214",
          "impuesto sobre la renta",
          "tasa militar",
          "Ucrania",
        ],
      },
      pl: {
        title: `Declaración fiscal PIT ${formTitles} - Polonia ${new Date().getFullYear()}`,
        description: `Presenta tus declaraciones fiscales en línea: ${formDescriptions}. Asistencia gratuita para ciudadanos polacos.`,
        keywords: ["PIT", "declaración fiscal", "Polonia", ...country.taxForms.map((f) => f.title)],
      },
      fr: {
        title: `Declaración fiscal ${formTitles} - Francia ${new Date().getFullYear()}`,
        description: `Presenta tu declaración fiscal en línea: ${formDescriptions}. Servicio gratuito para contribuyentes franceses.`,
        keywords: ["declaración fiscal", "Francia", ...country.taxForms.map((f) => f.title)],
      },
      de: {
        title: `Declaración fiscal ${formTitles} - Alemania ${new Date().getFullYear()}`,
        description: `Presenta tu declaración fiscal en línea: ${formDescriptions}. Servicio gratuito para contribuyentes alemanes.`,
        keywords: ["declaración fiscal", "Alemania", ...country.taxForms.map((f) => f.title)],
      },
      pt: {
        title: `Declaración IRS ${formTitles} - Portugal ${new Date().getFullYear()}`,
        description: `Presenta tu declaración IRS en línea: ${formDescriptions}. Servicio gratuito para contribuyentes portugueses.`,
        keywords: ["IRS", "declaración fiscal", "Portugal", ...country.taxForms.map((f) => f.title)],
      },
      es: {
        title: `Declaración de la Renta ${formTitles} - España ${new Date().getFullYear()}`,
        description: `Complete su declaración de la renta online: ${formDescriptions}. Servicio gratuito para contribuyentes españoles.`,
        keywords: [
          "declaración de la renta",
          "IRPF",
          "modelo",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      se: {
        title: `Declaración de ingresos ${formTitles} - Suecia ${new Date().getFullYear()}`,
        description: `Presenta tu declaración de ingresos en línea: ${formDescriptions}. Servicio gratuito para contribuyentes suecos.`,
        keywords: ["declaración de ingresos", "Suecia", ...country.taxForms.map((f) => f.title)],
      },
      gb: {
        title: `Declaración fiscal ${formTitles} - Reino Unido ${new Date().getFullYear()}`,
        description: `Presenta tu declaración fiscal en línea: ${formDescriptions}. Servicio gratuito para contribuyentes británicos.`,
        keywords: ["declaración fiscal", "HMRC", "Reino Unido", ...country.taxForms.map((f) => f.title)],
      },
      us: {
        title: `Declaración fiscal ${formTitles} - Estados Unidos ${new Date().getFullYear()}`,
        description: `Presenta tu declaración fiscal en línea: ${formDescriptions}. Servicio gratuito para contribuyentes estadounidenses.`,
        keywords: ["declaración fiscal", "IRS", "Estados Unidos", ...country.taxForms.map((f) => f.title)],
      },
      ca: {
        title: `Declaración fiscal ${formTitles} - Canadá ${new Date().getFullYear()}`,
        description: `Presenta tu declaración fiscal en línea: ${formDescriptions}. Servicio gratuito para contribuyentes canadienses.`,
        keywords: ["declaración fiscal", "CRA", "Canadá", ...country.taxForms.map((f) => f.title)],
      },
    },
    pt: {
      ua: {
        title: `Declaração fiscal F0100214 e F0121214 - Ucrânia ${new Date().getFullYear()}`,
        description: `Preencha sua declaração fiscal online: F0100214 sobre estado patrimonial e rendimentos, e F0121214 (Anexo F1) para cálculo do imposto de renda e taxa militar sobre investimentos.`,
        keywords: [
          "declaração fiscal",
          "F0100214",
          "F0121214",
          "imposto de renda",
          "taxa militar",
          "Ucrânia",
        ],
      },
      pl: {
        title: `Declaração fiscal PIT ${formTitles} - Polónia ${new Date().getFullYear()}`,
        description: `Envie suas declarações fiscais online: ${formDescriptions}. Assistência gratuita para cidadãos poloneses.`,
        keywords: ["PIT", "declaração fiscal", "Polónia", ...country.taxForms.map((f) => f.title)],
      },
      fr: {
        title: `Declaração fiscal ${formTitles} - França ${new Date().getFullYear()}`,
        description: `Preencha sua declaração fiscal online: ${formDescriptions}. Serviço gratuito para contribuintes franceses.`,
        keywords: ["declaração fiscal", "França", ...country.taxForms.map((f) => f.title)],
      },
      de: {
        title: `Declaração fiscal ${formTitles} - Alemanha ${new Date().getFullYear()}`,
        description: `Preencha sua declaração fiscal online: ${formDescriptions}. Serviço gratuito para contribuintes alemães.`,
        keywords: ["declaração fiscal", "Alemanha", ...country.taxForms.map((f) => f.title)],
      },
      pt: {
        title: `Declaração de IRS ${formTitles} - Portugal ${new Date().getFullYear()}`,
        description: `Preencha a sua declaração de IRS online: ${formDescriptions}. Serviço gratuito para contribuintes portugueses.`,
        keywords: [
          "IRS",
          "declaração de impostos",
          "finanças",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      es: {
        title: `Declaração fiscal ${formTitles} - Espanha ${new Date().getFullYear()}`,
        description: `Preencha sua declaração fiscal online: ${formDescriptions}. Serviço gratuito para contribuintes espanhóis.`,
        keywords: ["declaração fiscal", "IRPF", "Espanha", ...country.taxForms.map((f) => f.title)],
      },
      se: {
        title: `Declaração de rendimentos ${formTitles} - Suécia ${new Date().getFullYear()}`,
        description: `Preencha sua declaração de rendimentos online: ${formDescriptions}. Serviço gratuito para contribuintes suecos.`,
        keywords: ["declaração de rendimentos", "Suécia", ...country.taxForms.map((f) => f.title)],
      },
      gb: {
        title: `Declaração fiscal ${formTitles} - Reino Unido ${new Date().getFullYear()}`,
        description: `Preencha sua declaração fiscal online: ${formDescriptions}. Serviço gratuito para contribuintes britânicos.`,
        keywords: ["declaração fiscal", "HMRC", "Reino Unido", ...country.taxForms.map((f) => f.title)],
      },
      us: {
        title: `Declaração fiscal ${formTitles} - Estados Unidos ${new Date().getFullYear()}`,
        description: `Preencha sua declaração fiscal online: ${formDescriptions}. Serviço gratuito para contribuintes americanos.`,
        keywords: ["declaração fiscal", "IRS", "Estados Unidos", ...country.taxForms.map((f) => f.title)],
      },
      ca: {
        title: `Declaração fiscal ${formTitles} - Canadá ${new Date().getFullYear()}`,
        description: `Preencha sua declaração fiscal online: ${formDescriptions}. Serviço gratuito para contribuintes canadenses.`,
        keywords: ["declaração fiscal", "CRA", "Canadá", ...country.taxForms.map((f) => f.title)],
      },
    },
    de: {
      ua: {
        title: `Steuererklärung F0100214 und F0121214 - Ukraine ${new Date().getFullYear()}`,
        description: `Füllen Sie Ihre Steuererklärung online aus: F0100214 über Vermögensstatus und Einkommen sowie F0121214 (Anlage F1) zur Berechnung der Einkommensteuer und Militärsteuer auf Investitionen.`,
        keywords: [
          "Steuererklärung",
          "F0100214",
          "F0121214",
          "Einkommensteuer",
          "Militärsteuer",
          "Ukraine",
        ],
      },
      pl: {
        title: `Steuererklärung PIT ${formTitles} - Polen ${new Date().getFullYear()}`,
        description: `Reichen Sie Ihre Steuererklärung online ein: ${formDescriptions}. Kostenlose Unterstützung für polnische Bürger.`,
        keywords: ["PIT", "Steuererklärung", "Polen", ...country.taxForms.map((f) => f.title)],
      },
      fr: {
        title: `Steuererklärung ${formTitles} - Frankreich ${new Date().getFullYear()}`,
        description: `Füllen Sie Ihre Steuererklärung online aus: ${formDescriptions}. Kostenloser Service für französische Steuerzahler.`,
        keywords: ["Steuererklärung", "Frankreich", ...country.taxForms.map((f) => f.title)],
      },
      de: {
        title: `Steuererklärung ${formTitles} - Deutschland ${new Date().getFullYear()}`,
        description: `Füllen Sie Ihre Steuererklärung online aus: ${formDescriptions}. Kostenloser Service für deutsche Steuerzahler.`,
        keywords: [
          "Steuererklärung",
          "Einkommensteuer",
          "Steuerformular",
          ...country.taxForms.map((f) => f.title),
        ],
      },
      pt: {
        title: `IRS-Erklärung ${formTitles} - Portugal ${new Date().getFullYear()}`,
        description: `Füllen Sie Ihre IRS-Erklärung online aus: ${formDescriptions}. Kostenloser Service für portugiesische Steuerzahler.`,
        keywords: ["IRS", "Steuererklärung", "Portugal", ...country.taxForms.map((f) => f.title)],
      },
      es: {
        title: `Steuererklärung ${formTitles} - Spanien ${new Date().getFullYear()}`,
        description: `Füllen Sie Ihre Steuererklärung online aus: ${formDescriptions}. Kostenloser Service für spanische Steuerzahler.`,
        keywords: ["Steuererklärung", "IRPF", "Spanien", ...country.taxForms.map((f) => f.title)],
      },
      se: {
        title: `Einkommenserklärung ${formTitles} - Schweden ${new Date().getFullYear()}`,
        description: `Füllen Sie Ihre Einkommenserklärung online aus: ${formDescriptions}. Kostenloser Service für schwedische Steuerzahler.`,
        keywords: ["Einkommenserklärung", "Schweden", ...country.taxForms.map((f) => f.title)],
      },
      gb: {
        title: `Steuererklärung ${formTitles} - Vereinigtes Königreich ${new Date().getFullYear()}`,
        description: `Füllen Sie Ihre Steuererklärung online aus: ${formDescriptions}. Kostenloser Service für britische Steuerzahler.`,
        keywords: ["Steuererklärung", "HMRC", "Vereinigtes Königreich", ...country.taxForms.map((f) => f.title)],
      },
      us: {
        title: `Steuererklärung ${formTitles} - Vereinigte Staaten ${new Date().getFullYear()}`,
        description: `Füllen Sie Ihre Steuererklärung online aus: ${formDescriptions}. Kostenloser Service für amerikanische Steuerzahler.`,
        keywords: ["Steuererklärung", "IRS", "USA", ...country.taxForms.map((f) => f.title)],
      },
      ca: {
        title: `Steuererklärung ${formTitles} - Kanada ${new Date().getFullYear()}`,
        description: `Füllen Sie Ihre Steuererklärung online aus: ${formDescriptions}. Kostenloser Service für kanadische Steuerzahler.`,
        keywords: ["Steuererklärung", "CRA", "Kanada", ...country.taxForms.map((f) => f.title)],
      },
    },
  }

  // Return metadata or fallback to English
  return metadata[language]?.[countryCode] || metadata.en[countryCode]
}

// Generate complete Next.js metadata object
export function generatePageMetadata(
  countryCode: CountryCode,
  language: Language,
  locale: string
): Metadata {
  const seo = generateSEOMetadata(countryCode, language)

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      type: "website",
      locale: `${language}_${countryCode.toUpperCase()}`,
      url: `https://taxered.com/${locale}`,
      title: seo.title,
      description: seo.description,
      siteName: "Taxered Tax Declaration",
      images: [
        {
          url: "/placeholder-logo.png",
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/placeholder-logo.png"],
      creator: "@monegoo",
    },
    alternates: {
      canonical: `https://taxered.com/${locale}`,
      languages: {
        "x-default": "/",
        "uk-UA": "/uk-ua",
        "en-US": "/en-us",
        "en-GB": "/en-gb",
        "en-CA": "/en-ca",
        "fr-FR": "/fr-fr",
        "pl-PL": "/pl-pl",
        "es-ES": "/es-es",
        "pt-PT": "/pt-pt",
        "de-DE": "/de-de",
        "sv-SE": "/sv-se",
      },
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    authors: [{ name: "Taxered", url: "https://taxered.com" }],
    creator: "Taxered",
    publisher: "Taxered",
    category: "Finance",
  }
}

// Generate SEO metadata for the help page
export function generateHelpPageMetadata(
  countryCode: CountryCode,
  language: Language
): SEOMetadata {
  const country = countries[countryCode]
  const currentYear = new Date().getFullYear()

  const metadata: Record<Language, Record<CountryCode, SEOMetadata>> = {
    uk: {
      ua: {
        title: `Допомога - Центр підтримки Taxered | Податкові декларації України ${currentYear}`,
        description: `Знайдіть відповіді на питання про заповнення податкових декларацій F0100214 та F0121214. Інструкції, поради та підтримка для заповнення податкових форм онлайн. Безкоштовна допомога українською мовою.`,
        keywords: [
          "допомога",
          "інструкції",
          "підтримка",
          "податкова декларація",
          "F0100214",
          "F0121214",
          "як заповнити декларацію",
          "заповнення форм",
          "FAQ",
          "часті питання",
          "центр допомоги",
          "податки Україна",
        ],
      },
      pl: {
        title: `Pomoc - Centrum Wsparcia Taxered | Rozliczenia Podatkowe Polska ${currentYear}`,
        description: `Znajdź odpowiedzi na pytania dotyczące wypełniania deklaracji podatkowych PIT. Instrukcje, porady i wsparcie dla rozliczeń podatkowych online. Bezpłatna pomoc po polsku.`,
        keywords: [
          "pomoc",
          "instrukcje",
          "wsparcie",
          "PIT",
          "deklaracja podatkowa",
          "jak wypełnić PIT",
          "FAQ",
          "centrum pomocy",
          "podatki Polska",
        ],
      },
      fr: {
        title: `Aide - Centre d'Assistance Taxered | Déclarations Fiscales France ${currentYear}`,
        description: `Trouvez des réponses aux questions sur le remplissage des déclarations fiscales. Instructions, conseils et support pour les déclarations en ligne. Aide gratuite en français.`,
        keywords: [
          "aide",
          "instructions",
          "support",
          "déclaration d'impôts",
          "comment remplir",
          "FAQ",
          "centre d'aide",
          "impôts France",
        ],
      },
      de: {
        title: `Hilfe - Support-Center Taxered | Steuererklärungen Deutschland ${currentYear}`,
        description: `Finden Sie Antworten auf Fragen zum Ausfüllen von Steuererklärungen. Anleitungen, Tipps und Support für Online-Steuererklärungen. Kostenlose Hilfe auf Deutsch.`,
        keywords: [
          "hilfe",
          "anleitungen",
          "support",
          "steuererklärung",
          "wie ausfüllen",
          "FAQ",
          "hilfezentrum",
          "steuern Deutschland",
        ],
      },
      pt: {
        title: `Ajuda - Centro de Suporte Taxered | Declarações Fiscais Portugal ${currentYear}`,
        description: `Encontre respostas para perguntas sobre o preenchimento de declarações fiscais. Instruções, dicas e suporte para declarações online. Ajuda gratuita em português.`,
        keywords: [
          "ajuda",
          "instruções",
          "suporte",
          "declaração de impostos",
          "como preencher",
          "FAQ",
          "centro de ajuda",
          "impostos Portugal",
        ],
      },
      es: {
        title: `Ayuda - Centro de Soporte Taxered | Declaraciones Fiscales España ${currentYear}`,
        description: `Encuentre respuestas a preguntas sobre cómo completar declaraciones fiscales. Instrucciones, consejos y soporte para declaraciones en línea. Ayuda gratuita en español.`,
        keywords: [
          "ayuda",
          "instrucciones",
          "soporte",
          "declaración de impuestos",
          "cómo completar",
          "FAQ",
          "centro de ayuda",
          "impuestos España",
        ],
      },
      se: {
        title: `Hjälp - Supportcenter Taxered | Skattedeklarationer Sverige ${currentYear}`,
        description: `Hitta svar på frågor om att fylla i skattedeklarationer. Instruktioner, tips och support för online-deklarationer. Gratis hjälp på svenska.`,
        keywords: [
          "hjälp",
          "instruktioner",
          "support",
          "skattedeklaration",
          "hur fyller man i",
          "FAQ",
          "hjälpcenter",
          "skatter Sverige",
        ],
      },
      gb: {
        title: `Help - Support Center Taxered | Tax Returns UK ${currentYear}`,
        description: `Find answers to questions about completing tax returns. Instructions, tips and support for online tax filings. Free help in English.`,
        keywords: [
          "help",
          "instructions",
          "support",
          "tax return",
          "how to complete",
          "FAQ",
          "help center",
          "UK taxes",
          "self assessment",
          "HMRC",
        ],
      },
      us: {
        title: `Help - Support Center Taxered | Tax Returns USA ${currentYear}`,
        description: `Find answers to questions about filing tax returns. Instructions, tips and support for online tax filings. Free help in English.`,
        keywords: [
          "help",
          "instructions",
          "support",
          "tax return",
          "how to file",
          "FAQ",
          "help center",
          "US taxes",
          "IRS",
        ],
      },
      ca: {
        title: `Help - Support Center Taxered | Tax Returns Canada ${currentYear}`,
        description: `Find answers to questions about filing tax returns. Instructions, tips and support for online tax filings. Free help in English.`,
        keywords: [
          "help",
          "instructions",
          "support",
          "tax return",
          "how to file",
          "FAQ",
          "help center",
          "Canada taxes",
          "CRA",
        ],
      },
    },
    en: {
      ua: {
        title: `Help - Taxered Support Center | Ukraine Tax Declarations ${currentYear}`,
        description: `Find answers to questions about filling out tax declarations F0100214 and F0121214. Instructions, tips and support for filing tax forms online. Free help in English.`,
        keywords: [
          "help",
          "instructions",
          "support",
          "tax declaration",
          "F0100214",
          "F0121214",
          "how to fill out",
          "form filling",
          "FAQ",
          "help center",
          "Ukraine taxes",
        ],
      },
      pl: {
        title: `Help - Taxered Support Center | Poland Tax Returns ${currentYear}`,
        description: `Find answers to questions about completing PIT tax returns. Instructions, tips and support for online tax filing. Free help in English.`,
        keywords: [
          "help",
          "instructions",
          "support",
          "PIT",
          "tax return",
          "how to complete",
          "FAQ",
          "help center",
          "Poland taxes",
        ],
      },
      fr: {
        title: `Help - Taxered Support Center | France Tax Returns ${currentYear}`,
        description: `Find answers to questions about completing tax declarations. Instructions, tips and support for online tax filing. Free help in English.`,
        keywords: [
          "help",
          "instructions",
          "support",
          "tax return",
          "how to complete",
          "FAQ",
          "help center",
          "France taxes",
        ],
      },
      de: {
        title: `Help - Taxered Support Center | Germany Tax Returns ${currentYear}`,
        description: `Find answers to questions about completing tax returns. Instructions, tips and support for online tax filing. Free help in English.`,
        keywords: [
          "help",
          "instructions",
          "support",
          "tax return",
          "how to complete",
          "FAQ",
          "help center",
          "Germany taxes",
        ],
      },
      pt: {
        title: `Help - Taxered Support Center | Portugal Tax Returns ${currentYear}`,
        description: `Find answers to questions about completing IRS declarations. Instructions, tips and support for online tax filing. Free help in English.`,
        keywords: [
          "help",
          "instructions",
          "support",
          "IRS",
          "tax return",
          "how to complete",
          "FAQ",
          "help center",
          "Portugal taxes",
        ],
      },
      es: {
        title: `Help - Taxered Support Center | Spain Tax Returns ${currentYear}`,
        description: `Find answers to questions about completing tax returns. Instructions, tips and support for online tax filing. Free help in English.`,
        keywords: [
          "help",
          "instructions",
          "support",
          "tax return",
          "how to complete",
          "FAQ",
          "help center",
          "Spain taxes",
        ],
      },
      se: {
        title: `Help - Taxered Support Center | Sweden Tax Returns ${currentYear}`,
        description: `Find answers to questions about completing income declarations. Instructions, tips and support for online tax filing. Free help in English.`,
        keywords: [
          "help",
          "instructions",
          "support",
          "income declaration",
          "how to complete",
          "FAQ",
          "help center",
          "Sweden taxes",
        ],
      },
      gb: {
        title: `Help - Support Center Taxered | Tax Returns UK ${currentYear}`,
        description: `Find answers to questions about completing tax returns. Instructions, tips and support for online tax filings. Free help in English.`,
        keywords: [
          "help",
          "instructions",
          "support",
          "tax return",
          "how to complete",
          "FAQ",
          "help center",
          "UK taxes",
          "self assessment",
          "HMRC",
        ],
      },
      us: {
        title: `Help - Support Center Taxered | Tax Returns USA ${currentYear}`,
        description: `Find answers to questions about filing tax returns. Instructions, tips and support for online tax filings. Free help in English.`,
        keywords: [
          "help",
          "instructions",
          "support",
          "tax return",
          "how to file",
          "FAQ",
          "help center",
          "US taxes",
          "IRS",
        ],
      },
      ca: {
        title: `Help - Support Center Taxered | Tax Returns Canada ${currentYear}`,
        description: `Find answers to questions about filing tax returns. Instructions, tips and support for online tax filings. Free help in English.`,
        keywords: [
          "help",
          "instructions",
          "support",
          "tax return",
          "how to file",
          "FAQ",
          "help center",
          "Canada taxes",
          "CRA",
        ],
      },
    },
    fr: {
      ua: {
        title: `Aide - Centre de Support Taxered | Déclarations Fiscales Ukraine ${currentYear}`,
        description: `Trouvez des réponses aux questions sur le remplissage des déclarations fiscales F0100214 et F0121214. Instructions, conseils et support pour les déclarations en ligne.`,
        keywords: [
          "aide",
          "instructions",
          "support",
          "déclaration fiscale",
          "F0100214",
          "F0121214",
          "comment remplir",
          "FAQ",
          "centre d'aide",
          "Ukraine",
        ],
      },
      pl: {
        title: `Aide - Centre de Support Taxered | Déclarations PIT Pologne ${currentYear}`,
        description: `Trouvez des réponses aux questions sur le remplissage des déclarations PIT. Instructions, conseils et support pour les déclarations en ligne.`,
        keywords: ["aide", "instructions", "support", "PIT", "Pologne", "FAQ", "centre d'aide"],
      },
      fr: {
        title: `Aide - Centre d'Assistance Taxered | Déclarations Fiscales France ${currentYear}`,
        description: `Trouvez des réponses aux questions sur le remplissage des déclarations fiscales. Instructions, conseils et support pour les déclarations en ligne. Aide gratuite en français.`,
        keywords: [
          "aide",
          "instructions",
          "support",
          "déclaration d'impôts",
          "comment remplir",
          "FAQ",
          "centre d'aide",
          "impôts France",
        ],
      },
      de: {
        title: `Aide - Centre de Support Taxered | Déclarations Fiscales Allemagne ${currentYear}`,
        description: `Trouvez des réponses aux questions sur le remplissage des déclarations fiscales. Instructions, conseils et support pour les déclarations en ligne.`,
        keywords: ["aide", "instructions", "support", "déclaration fiscale", "Allemagne", "FAQ", "centre d'aide"],
      },
      pt: {
        title: `Aide - Centre de Support Taxered | Déclarations IRS Portugal ${currentYear}`,
        description: `Trouvez des réponses aux questions sur le remplissage des déclarations IRS. Instructions, conseils et support pour les déclarations en ligne.`,
        keywords: ["aide", "instructions", "support", "IRS", "Portugal", "FAQ", "centre d'aide"],
      },
      es: {
        title: `Aide - Centre de Support Taxered | Déclarations Fiscales Espagne ${currentYear}`,
        description: `Trouvez des réponses aux questions sur le remplissage des déclarations fiscales. Instructions, conseils et support pour les déclarations en ligne.`,
        keywords: ["aide", "instructions", "support", "déclaration fiscale", "Espagne", "FAQ", "centre d'aide"],
      },
      se: {
        title: `Aide - Centre de Support Taxered | Déclarations Fiscales Suède ${currentYear}`,
        description: `Trouvez des réponses aux questions sur le remplissage des déclarations de revenus. Instructions, conseils et support pour les déclarations en ligne.`,
        keywords: ["aide", "instructions", "support", "déclaration de revenus", "Suède", "FAQ", "centre d'aide"],
      },
      gb: {
        title: `Aide - Centre de Support Taxered | Déclarations Fiscales Royaume-Uni ${currentYear}`,
        description: `Trouvez des réponses aux questions sur le remplissage des déclarations fiscales. Instructions, conseils et support pour les déclarations en ligne.`,
        keywords: ["aide", "instructions", "support", "déclaration fiscale", "Royaume-Uni", "FAQ", "centre d'aide"],
      },
      us: {
        title: `Aide - Centre de Support Taxered | Déclarations Fiscales États-Unis ${currentYear}`,
        description: `Trouvez des réponses aux questions sur le remplissage des déclarations fiscales. Instructions, conseils et support pour les déclarations en ligne.`,
        keywords: ["aide", "instructions", "support", "déclaration fiscale", "États-Unis", "IRS", "FAQ", "centre d'aide"],
      },
      ca: {
        title: `Aide - Centre de Support Taxered | Déclarations Fiscales Canada ${currentYear}`,
        description: `Trouvez des réponses aux questions sur le remplissage des déclarations fiscales. Instructions, conseils et support pour les déclarations en ligne.`,
        keywords: ["aide", "instructions", "support", "déclaration fiscale", "Canada", "FAQ", "centre d'aide"],
      },
    },
    pl: {
      ua: {
        title: `Pomoc - Centrum Wsparcia Taxered | Deklaracje Podatkowe Ukraina ${currentYear}`,
        description: `Znajdź odpowiedzi na pytania dotyczące wypełniania deklaracji podatkowych F0100214 i F0121214. Instrukcje, porady i wsparcie dla deklaracji online.`,
        keywords: [
          "pomoc",
          "instrukcje",
          "wsparcie",
          "deklaracja podatkowa",
          "F0100214",
          "F0121214",
          "jak wypełnić",
          "FAQ",
          "centrum pomocy",
          "Ukraina",
        ],
      },
      pl: {
        title: `Pomoc - Centrum Wsparcia Taxered | Rozliczenia Podatkowe Polska ${currentYear}`,
        description: `Znajdź odpowiedzi na pytania dotyczące wypełniania deklaracji podatkowych PIT. Instrukcje, porady i wsparcie dla rozliczeń podatkowych online. Bezpłatna pomoc po polsku.`,
        keywords: [
          "pomoc",
          "instrukcje",
          "wsparcie",
          "PIT",
          "deklaracja podatkowa",
          "jak wypełnić PIT",
          "FAQ",
          "centrum pomocy",
          "podatki Polska",
        ],
      },
      fr: {
        title: `Pomoc - Centrum Wsparcia Taxered | Deklaracje Podatkowe Francja ${currentYear}`,
        description: `Znajdź odpowiedzi na pytania dotyczące wypełniania deklaracji podatkowych. Instrukcje, porady i wsparcie dla deklaracji online.`,
        keywords: ["pomoc", "instrukcje", "wsparcie", "deklaracja podatkowa", "Francja", "FAQ", "centrum pomocy"],
      },
      de: {
        title: `Pomoc - Centrum Wsparcia Taxered | Deklaracje Podatkowe Niemcy ${currentYear}`,
        description: `Znajdź odpowiedzi na pytania dotyczące wypełniania deklaracji podatkowych. Instrukcje, porady i wsparcie dla deklaracji online.`,
        keywords: ["pomoc", "instrukcje", "wsparcie", "deklaracja podatkowa", "Niemcy", "FAQ", "centrum pomocy"],
      },
      pt: {
        title: `Pomoc - Centrum Wsparcia Taxered | Deklaracje IRS Portugalia ${currentYear}`,
        description: `Znajdź odpowiedzi na pytania dotyczące wypełniania deklaracji IRS. Instrukcje, porady i wsparcie dla deklaracji online.`,
        keywords: ["pomoc", "instrukcje", "wsparcie", "IRS", "Portugalia", "FAQ", "centrum pomocy"],
      },
      es: {
        title: `Pomoc - Centrum Wsparcia Taxered | Deklaracje Podatkowe Hiszpania ${currentYear}`,
        description: `Znajdź odpowiedzi na pytania dotyczące wypełniania deklaracji podatkowych. Instrukcje, porady i wsparcie dla deklaracji online.`,
        keywords: ["pomoc", "instrukcje", "wsparcie", "deklaracja podatkowa", "Hiszpania", "FAQ", "centrum pomocy"],
      },
      se: {
        title: `Pomoc - Centrum Wsparcia Taxered | Deklaracje Dochodów Szwecja ${currentYear}`,
        description: `Znajdź odpowiedzi na pytania dotyczące wypełniania deklaracji dochodów. Instrukcje, porady i wsparcie dla deklaracji online.`,
        keywords: ["pomoc", "instrukcje", "wsparcie", "deklaracja dochodów", "Szwecja", "FAQ", "centrum pomocy"],
      },
      gb: {
        title: `Pomoc - Centrum Wsparcia Taxered | Deklaracje Podatkowe Wielka Brytania ${currentYear}`,
        description: `Znajdź odpowiedzi na pytania dotyczące wypełniania deklaracji podatkowych. Instrukcje, porady i wsparcie dla deklaracji online.`,
        keywords: ["pomoc", "instrukcje", "wsparcie", "deklaracja podatkowa", "Wielka Brytania", "FAQ", "centrum pomocy"],
      },
      us: {
        title: `Pomoc - Centrum Wsparcia Taxered | Deklaracje Podatkowe USA ${currentYear}`,
        description: `Znajdź odpowiedzi na pytania dotyczące wypełniania deklaracji podatkowych. Instrukcje, porady i wsparcie dla deklaracji online.`,
        keywords: ["pomoc", "instrukcje", "wsparcie", "deklaracja podatkowa", "USA", "IRS", "FAQ", "centrum pomocy"],
      },
      ca: {
        title: `Pomoc - Centrum Wsparcia Taxered | Deklaracje Podatkowe Kanada ${currentYear}`,
        description: `Znajdź odpowiedzi na pytania dotyczące wypełniania deklaracji podatkowych. Instrukcje, porady i wsparcie dla deklaracji online.`,
        keywords: ["pomoc", "instrukcje", "wsparcie", "deklaracja podatkowa", "Kanada", "FAQ", "centrum pomocy"],
      },
    },
    es: {
      ua: {
        title: `Ayuda - Centro de Soporte Taxered | Declaraciones Fiscales Ucrania ${currentYear}`,
        description: `Encuentre respuestas a preguntas sobre cómo completar las declaraciones fiscales F0100214 y F0121214. Instrucciones, consejos y soporte para declaraciones en línea.`,
        keywords: [
          "ayuda",
          "instrucciones",
          "soporte",
          "declaración fiscal",
          "F0100214",
          "F0121214",
          "cómo completar",
          "FAQ",
          "centro de ayuda",
          "Ucrania",
        ],
      },
      pl: {
        title: `Ayuda - Centro de Soporte Taxered | Declaraciones PIT Polonia ${currentYear}`,
        description: `Encuentre respuestas a preguntas sobre cómo completar declaraciones PIT. Instrucciones, consejos y soporte para declaraciones en línea.`,
        keywords: ["ayuda", "instrucciones", "soporte", "PIT", "Polonia", "FAQ", "centro de ayuda"],
      },
      fr: {
        title: `Ayuda - Centro de Soporte Taxered | Declaraciones Fiscales Francia ${currentYear}`,
        description: `Encuentre respuestas a preguntas sobre cómo completar declaraciones fiscales. Instrucciones, consejos y soporte para declaraciones en línea.`,
        keywords: ["ayuda", "instrucciones", "soporte", "declaración fiscal", "Francia", "FAQ", "centro de ayuda"],
      },
      de: {
        title: `Ayuda - Centro de Soporte Taxered | Declaraciones Fiscales Alemania ${currentYear}`,
        description: `Encuentre respuestas a preguntas sobre cómo completar declaraciones fiscales. Instrucciones, consejos y soporte para declaraciones en línea.`,
        keywords: ["ayuda", "instrucciones", "soporte", "declaración fiscal", "Alemania", "FAQ", "centro de ayuda"],
      },
      pt: {
        title: `Ayuda - Centro de Soporte Taxered | Declaraciones IRS Portugal ${currentYear}`,
        description: `Encuentre respuestas a preguntas sobre cómo completar declaraciones IRS. Instrucciones, consejos y soporte para declaraciones en línea.`,
        keywords: ["ayuda", "instrucciones", "soporte", "IRS", "Portugal", "FAQ", "centro de ayuda"],
      },
      es: {
        title: `Ayuda - Centro de Soporte Taxered | Declaraciones Fiscales España ${currentYear}`,
        description: `Encuentre respuestas a preguntas sobre cómo completar declaraciones fiscales. Instrucciones, consejos y soporte para declaraciones en línea. Ayuda gratuita en español.`,
        keywords: [
          "ayuda",
          "instrucciones",
          "soporte",
          "declaración de impuestos",
          "cómo completar",
          "FAQ",
          "centro de ayuda",
          "impuestos España",
        ],
      },
      se: {
        title: `Ayuda - Centro de Soporte Taxered | Declaraciones Fiscales Suecia ${currentYear}`,
        description: `Encuentre respuestas a preguntas sobre cómo completar declaraciones de ingresos. Instrucciones, consejos y soporte para declaraciones en línea.`,
        keywords: ["ayuda", "instrucciones", "soporte", "declaración de ingresos", "Suecia", "FAQ", "centro de ayuda"],
      },
      gb: {
        title: `Ayuda - Centro de Soporte Taxered | Declaraciones Fiscales Reino Unido ${currentYear}`,
        description: `Encuentre respuestas a preguntas sobre cómo completar declaraciones fiscales. Instrucciones, consejos y soporte para declaraciones en línea.`,
        keywords: ["ayuda", "instrucciones", "soporte", "declaración fiscal", "Reino Unido", "FAQ", "centro de ayuda"],
      },
      us: {
        title: `Ayuda - Centro de Soporte Taxered | Declaraciones Fiscales Estados Unidos ${currentYear}`,
        description: `Encuentre respuestas a preguntas sobre cómo completar declaraciones fiscales. Instrucciones, consejos y soporte para declaraciones en línea.`,
        keywords: ["ayuda", "instrucciones", "soporte", "declaración fiscal", "Estados Unidos", "IRS", "FAQ", "centro de ayuda"],
      },
      ca: {
        title: `Ayuda - Centro de Soporte Taxered | Declaraciones Fiscales Canadá ${currentYear}`,
        description: `Encuentre respuestas a preguntas sobre cómo completar declaraciones fiscales. Instrucciones, consejos y soporte para declaraciones en línea.`,
        keywords: ["ayuda", "instrucciones", "soporte", "declaración fiscal", "Canadá", "FAQ", "centro de ayuda"],
      },
    },
    pt: {
      ua: {
        title: `Ajuda - Centro de Suporte Taxered | Declarações Fiscais Ucrânia ${currentYear}`,
        description: `Encontre respostas para perguntas sobre o preenchimento das declarações fiscais F0100214 e F0121214. Instruções, dicas e suporte para declarações online.`,
        keywords: [
          "ajuda",
          "instruções",
          "suporte",
          "declaração fiscal",
          "F0100214",
          "F0121214",
          "como preencher",
          "FAQ",
          "centro de ajuda",
          "Ucrânia",
        ],
      },
      pl: {
        title: `Ajuda - Centro de Suporte Taxered | Declarações PIT Polónia ${currentYear}`,
        description: `Encontre respostas para perguntas sobre o preenchimento de declarações PIT. Instruções, dicas e suporte para declarações online.`,
        keywords: ["ajuda", "instruções", "suporte", "PIT", "Polónia", "FAQ", "centro de ajuda"],
      },
      fr: {
        title: `Ajuda - Centro de Suporte Taxered | Declarações Fiscais França ${currentYear}`,
        description: `Encontre respostas para perguntas sobre o preenchimento de declarações fiscais. Instruções, dicas e suporte para declarações online.`,
        keywords: ["ajuda", "instruções", "suporte", "declaração fiscal", "França", "FAQ", "centro de ajuda"],
      },
      de: {
        title: `Ajuda - Centro de Suporte Taxered | Declarações Fiscais Alemanha ${currentYear}`,
        description: `Encontre respostas para perguntas sobre o preenchimento de declarações fiscais. Instruções, dicas e suporte para declarações online.`,
        keywords: ["ajuda", "instruções", "suporte", "declaração fiscal", "Alemanha", "FAQ", "centro de ajuda"],
      },
      pt: {
        title: `Ajuda - Centro de Suporte Taxered | Declarações Fiscais Portugal ${currentYear}`,
        description: `Encontre respostas para perguntas sobre o preenchimento de declarações fiscais. Instruções, dicas e suporte para declarações online. Ajuda gratuita em português.`,
        keywords: [
          "ajuda",
          "instruções",
          "suporte",
          "declaração de impostos",
          "como preencher",
          "FAQ",
          "centro de ajuda",
          "impostos Portugal",
        ],
      },
      es: {
        title: `Ajuda - Centro de Suporte Taxered | Declarações Fiscais Espanha ${currentYear}`,
        description: `Encontre respostas para perguntas sobre o preenchimento de declarações fiscais. Instruções, dicas e suporte para declarações online.`,
        keywords: ["ajuda", "instruções", "suporte", "declaração fiscal", "Espanha", "FAQ", "centro de ajuda"],
      },
      se: {
        title: `Ajuda - Centro de Suporte Taxered | Declarações Fiscais Suécia ${currentYear}`,
        description: `Encontre respostas para perguntas sobre o preenchimento de declarações de rendimentos. Instruções, dicas e suporte para declarações online.`,
        keywords: ["ajuda", "instruções", "suporte", "declaração de rendimentos", "Suécia", "FAQ", "centro de ajuda"],
      },
      gb: {
        title: `Ajuda - Centro de Suporte Taxered | Declarações Fiscais Reino Unido ${currentYear}`,
        description: `Encontre respostas para perguntas sobre o preenchimento de declarações fiscais. Instruções, dicas e suporte para declarações online.`,
        keywords: ["ajuda", "instruções", "suporte", "declaração fiscal", "Reino Unido", "FAQ", "centro de ajuda"],
      },
      us: {
        title: `Ajuda - Centro de Suporte Taxered | Declarações Fiscais Estados Unidos ${currentYear}`,
        description: `Encontre respostas para perguntas sobre o preenchimento de declarações fiscais. Instruções, dicas e suporte para declarações online.`,
        keywords: ["ajuda", "instruções", "suporte", "declaração fiscal", "Estados Unidos", "IRS", "FAQ", "centro de ajuda"],
      },
      ca: {
        title: `Ajuda - Centro de Suporte Taxered | Declarações Fiscais Canadá ${currentYear}`,
        description: `Encontre respostas para perguntas sobre o preenchimento de declarações fiscais. Instruções, dicas e suporte para declarações online.`,
        keywords: ["ajuda", "instruções", "suporte", "declaração fiscal", "Canadá", "FAQ", "centro de ajuda"],
      },
    },
    de: {
      ua: {
        title: `Hilfe - Support-Center Taxered | Steuererklärungen Ukraine ${currentYear}`,
        description: `Finden Sie Antworten auf Fragen zum Ausfüllen der Steuererklärungen F0100214 und F0121214. Anleitungen, Tipps und Support für Online-Steuererklärungen.`,
        keywords: [
          "hilfe",
          "anleitungen",
          "support",
          "steuererklärung",
          "F0100214",
          "F0121214",
          "wie ausfüllen",
          "FAQ",
          "hilfezentrum",
          "Ukraine",
        ],
      },
      pl: {
        title: `Hilfe - Support-Center Taxered | Steuererklärungen PIT Polen ${currentYear}`,
        description: `Finden Sie Antworten auf Fragen zum Ausfüllen von PIT-Steuererklärungen. Anleitungen, Tipps und Support für Online-Steuererklärungen.`,
        keywords: ["hilfe", "anleitungen", "support", "PIT", "Polen", "FAQ", "hilfezentrum"],
      },
      fr: {
        title: `Hilfe - Support-Center Taxered | Steuererklärungen Frankreich ${currentYear}`,
        description: `Finden Sie Antworten auf Fragen zum Ausfüllen von Steuererklärungen. Anleitungen, Tipps und Support für Online-Steuererklärungen.`,
        keywords: ["hilfe", "anleitungen", "support", "steuererklärung", "Frankreich", "FAQ", "hilfezentrum"],
      },
      de: {
        title: `Hilfe - Support-Center Taxered | Steuererklärungen Deutschland ${currentYear}`,
        description: `Finden Sie Antworten auf Fragen zum Ausfüllen von Steuererklärungen. Anleitungen, Tipps und Support für Online-Steuererklärungen. Kostenlose Hilfe auf Deutsch.`,
        keywords: [
          "hilfe",
          "anleitungen",
          "support",
          "steuererklärung",
          "wie ausfüllen",
          "FAQ",
          "hilfezentrum",
          "steuern Deutschland",
        ],
      },
      pt: {
        title: `Hilfe - Support-Center Taxered | Steuererklärungen Portugal ${currentYear}`,
        description: `Finden Sie Antworten auf Fragen zum Ausfüllen von Steuererklärungen. Anleitungen, Tipps und Support für Online-Steuererklärungen.`,
        keywords: ["hilfe", "anleitungen", "support", "steuererklärung", "Portugal", "FAQ", "hilfezentrum"],
      },
      es: {
        title: `Hilfe - Support-Center Taxered | Steuererklärungen Spanien ${currentYear}`,
        description: `Finden Sie Antworten auf Fragen zum Ausfüllen von Steuererklärungen. Anleitungen, Tipps und Support für Online-Steuererklärungen.`,
        keywords: ["hilfe", "anleitungen", "support", "steuererklärung", "Spanien", "FAQ", "hilfezentrum"],
      },
      se: {
        title: `Hilfe - Support-Center Taxered | Steuererklärungen Schweden ${currentYear}`,
        description: `Finden Sie Antworten auf Fragen zum Ausfüllen von Einkommenserklärungen. Anleitungen, Tipps und Support für Online-Steuererklärungen.`,
        keywords: ["hilfe", "anleitungen", "support", "einkommenserklärung", "Schweden", "FAQ", "hilfezentrum"],
      },
      gb: {
        title: `Hilfe - Support-Center Taxered | Steuererklärungen Vereinigtes Königreich ${currentYear}`,
        description: `Finden Sie Antworten auf Fragen zum Ausfüllen von Steuererklärungen. Anleitungen, Tipps und Support für Online-Steuererklärungen.`,
        keywords: ["hilfe", "anleitungen", "support", "steuererklärung", "Vereinigtes Königreich", "FAQ", "hilfezentrum"],
      },
      us: {
        title: `Hilfe - Support-Center Taxered | Steuererklärungen Vereinigte Staaten ${currentYear}`,
        description: `Finden Sie Antworten auf Fragen zum Ausfüllen von Steuererklärungen. Anleitungen, Tipps und Support für Online-Steuererklärungen.`,
        keywords: ["hilfe", "anleitungen", "support", "steuererklärung", "USA", "IRS", "FAQ", "hilfezentrum"],
      },
      ca: {
        title: `Hilfe - Support-Center Taxered | Steuererklärungen Kanada ${currentYear}`,
        description: `Finden Sie Antworten auf Fragen zum Ausfüllen von Steuererklärungen. Anleitungen, Tipps und Support für Online-Steuererklärungen.`,
        keywords: ["hilfe", "anleitungen", "support", "steuererklärung", "Kanada", "FAQ", "hilfezentrum"],
      },
    },
  }

  return metadata[language]?.[countryCode] || metadata.en[countryCode]
}

// Generate SEO metadata for the about page
export function generateAboutPageMetadata(
  countryCode: CountryCode,
  language: Language
): SEOMetadata {
  const country = countries[countryCode]
  const currentYear = new Date().getFullYear()

  const metadata: Record<Language, Record<CountryCode, SEOMetadata>> = {
    uk: {
      ua: {
        title: `Про Taxered - Безкоштовна система податкових декларацій України ${currentYear}`,
        description: `Taxered - це безкоштовна відкрита онлайн система для заповнення податкових декларацій F0100214 та F0121214. Ми створюємо доступні інструменти для громадян України. Ваші дані залишаються тільки у вас.`,
        keywords: [
          "про Taxered",
          "безкоштовні податкові декларації",
          "відкрита система",
          "про нас",
          "місія",
          "цінності",
          "приватність даних",
          "безпека",
          "F0100214",
          "F0121214",
          "Україна",
        ],
      },
      pl: {
        title: `O Taxered - Bezpłatny system rozliczeń podatkowych Polska ${currentYear}`,
        description: `Taxered to bezpłatny otwarty system online do wypełniania deklaracji podatkowych PIT. Tworzymy dostępne narzędzia dla obywateli Polski. Twoje dane pozostają tylko u Ciebie.`,
        keywords: [
          "o Taxered",
          "bezpłatne deklaracje podatkowe",
          "otwarty system",
          "o nas",
          "misja",
          "wartości",
          "prywatność danych",
          "Polska",
        ],
      },
      fr: {
        title: `À propos de Taxered - Système gratuit de déclarations fiscales France ${currentYear}`,
        description: `Taxered est un système en ligne gratuit et ouvert pour remplir les déclarations fiscales. Nous créons des outils accessibles pour les citoyens français. Vos données restent chez vous.`,
        keywords: [
          "à propos de Taxered",
          "déclarations fiscales gratuites",
          "système ouvert",
          "à propos",
          "mission",
          "valeurs",
          "confidentialité",
          "France",
        ],
      },
      de: {
        title: `Über Taxered - Kostenloses Steuererklärungssystem Deutschland ${currentYear}`,
        description: `Taxered ist ein kostenloses offenes Online-System zum Ausfüllen von Steuererklärungen. Wir schaffen zugängliche Tools für deutsche Bürger. Ihre Daten bleiben bei Ihnen.`,
        keywords: [
          "über Taxered",
          "kostenlose Steuererklärungen",
          "offenes System",
          "über uns",
          "Mission",
          "Werte",
          "Datenschutz",
          "Deutschland",
        ],
      },
      pt: {
        title: `Sobre a Taxered - Sistema gratuito de declarações fiscais Portugal ${currentYear}`,
        description: `Taxered é um sistema online gratuito e aberto para preencher declarações fiscais. Criamos ferramentas acessíveis para cidadãos portugueses. Seus dados permanecem com você.`,
        keywords: [
          "sobre Taxered",
          "declarações fiscais gratuitas",
          "sistema aberto",
          "sobre nós",
          "missão",
          "valores",
          "privacidade",
          "Portugal",
        ],
      },
      es: {
        title: `Acerca de Taxered - Sistema gratuito de declaraciones fiscales España ${currentYear}`,
        description: `Taxered es un sistema en línea gratuito y abierto para completar declaraciones fiscales. Creamos herramientas accesibles para ciudadanos españoles. Sus datos permanecen con usted.`,
        keywords: [
          "acerca de Taxered",
          "declaraciones fiscales gratuitas",
          "sistema abierto",
          "acerca de",
          "misión",
          "valores",
          "privacidad",
          "España",
        ],
      },
      se: {
        title: `Om Taxered - Gratis system för skattedeklarationer Sverige ${currentYear}`,
        description: `Taxered är ett gratis öppet online-system för att fylla i skattedeklarationer. Vi skapar tillgängliga verktyg för svenska medborgare. Dina data stannar hos dig.`,
        keywords: [
          "om Taxered",
          "gratis skattedeklarationer",
          "öppet system",
          "om oss",
          "mission",
          "värderingar",
          "integritet",
          "Sverige",
        ],
      },
      gb: {
        title: `About Taxered - Free Tax Return System UK ${currentYear}`,
        description: `Taxered is a free and open online system for completing tax returns. We create accessible tools for UK citizens. Your data stays with you.`,
        keywords: [
          "about Taxered",
          "free tax returns",
          "open system",
          "about us",
          "mission",
          "values",
          "privacy",
          "UK",
          "self assessment",
        ],
      },
      us: {
        title: `About Taxered - Free Tax Return System USA ${currentYear}`,
        description: `Taxered is a free and open online system for filing tax returns. We create accessible tools for US taxpayers. Your data stays with you.`,
        keywords: [
          "about Taxered",
          "free tax returns",
          "open system",
          "about us",
          "mission",
          "values",
          "privacy",
          "USA",
        ],
      },
      ca: {
        title: `About Taxered - Free Tax Return System Canada ${currentYear}`,
        description: `Taxered is a free and open online system for filing tax returns. We create accessible tools for Canadian taxpayers. Your data stays with you.`,
        keywords: [
          "about Taxered",
          "free tax returns",
          "open system",
          "about us",
          "mission",
          "values",
          "privacy",
          "Canada",
        ],
      },
    },
    en: {
      ua: {
        title: `About Taxered - Free Tax Declaration System Ukraine ${currentYear}`,
        description: `Taxered is a free and open online system for filling out tax declarations F0100214 and F0121214. We create accessible tools for Ukrainian citizens. Your data stays with you.`,
        keywords: [
          "about Taxered",
          "free tax declarations",
          "open system",
          "about us",
          "mission",
          "values",
          "privacy",
          "security",
          "F0100214",
          "F0121214",
          "Ukraine",
        ],
      },
      pl: {
        title: `About Taxered - Free Tax Return System Poland ${currentYear}`,
        description: `Taxered is a free and open online system for completing PIT tax returns. We create accessible tools for Polish citizens. Your data stays with you.`,
        keywords: [
          "about Taxered",
          "free tax returns",
          "open system",
          "about us",
          "mission",
          "values",
          "privacy",
          "Poland",
        ],
      },
      fr: {
        title: `About Taxered - Free Tax Return System France ${currentYear}`,
        description: `Taxered is a free and open online system for completing tax returns. We create accessible tools for French citizens. Your data stays with you.`,
        keywords: [
          "about Taxered",
          "free tax returns",
          "open system",
          "about us",
          "mission",
          "values",
          "privacy",
          "France",
        ],
      },
      de: {
        title: `About Taxered - Free Tax Return System Germany ${currentYear}`,
        description: `Taxered is a free and open online system for completing tax returns. We create accessible tools for German citizens. Your data stays with you.`,
        keywords: [
          "about Taxered",
          "free tax returns",
          "open system",
          "about us",
          "mission",
          "values",
          "privacy",
          "Germany",
        ],
      },
      pt: {
        title: `About Taxered - Free Tax Return System Portugal ${currentYear}`,
        description: `Taxered is a free and open online system for completing IRS declarations. We create accessible tools for Portuguese citizens. Your data stays with you.`,
        keywords: [
          "about Taxered",
          "free tax returns",
          "open system",
          "about us",
          "mission",
          "values",
          "privacy",
          "Portugal",
        ],
      },
      es: {
        title: `About Taxered - Free Tax Return System Spain ${currentYear}`,
        description: `Taxered is a free and open online system for completing tax returns. We create accessible tools for Spanish citizens. Your data stays with you.`,
        keywords: [
          "about Taxered",
          "free tax returns",
          "open system",
          "about us",
          "mission",
          "values",
          "privacy",
          "Spain",
        ],
      },
      se: {
        title: `About Taxered - Free Tax Return System Sweden ${currentYear}`,
        description: `Taxered is a free and open online system for completing income declarations. We create accessible tools for Swedish citizens. Your data stays with you.`,
        keywords: [
          "about Taxered",
          "free tax returns",
          "open system",
          "about us",
          "mission",
          "values",
          "privacy",
          "Sweden",
        ],
      },
      gb: {
        title: `About Taxered - Free Tax Return System UK ${currentYear}`,
        description: `Taxered is a free and open online system for completing tax returns. We create accessible tools for UK citizens. Your data stays with you.`,
        keywords: [
          "about Taxered",
          "free tax returns",
          "open system",
          "about us",
          "mission",
          "values",
          "privacy",
          "UK",
          "self assessment",
        ],
      },
      us: {
        title: `About Taxered - Free Tax Return System USA ${currentYear}`,
        description: `Taxered is a free and open online system for filing tax returns. We create accessible tools for US taxpayers. Your data stays with you.`,
        keywords: [
          "about Taxered",
          "free tax returns",
          "open system",
          "about us",
          "mission",
          "values",
          "privacy",
          "USA",
        ],
      },
      ca: {
        title: `About Taxered - Free Tax Return System Canada ${currentYear}`,
        description: `Taxered is a free and open online system for filing tax returns. We create accessible tools for Canadian taxpayers. Your data stays with you.`,
        keywords: [
          "about Taxered",
          "free tax returns",
          "open system",
          "about us",
          "mission",
          "values",
          "privacy",
          "Canada",
        ],
      },
    },
    fr: {
      ua: {
        title: `À propos de Taxered - Système gratuit de déclarations fiscales Ukraine ${currentYear}`,
        description: `Taxered est un système en ligne gratuit et ouvert pour remplir les déclarations fiscales F0100214 et F0121214. Nous créons des outils accessibles pour les citoyens ukrainiens. Vos données restent chez vous.`,
        keywords: [
          "à propos de Taxered",
          "déclarations fiscales gratuites",
          "système ouvert",
          "F0100214",
          "F0121214",
          "Ukraine",
        ],
      },
      pl: {
        title: `À propos de Taxered - Système gratuit de déclarations PIT Pologne ${currentYear}`,
        description: `Taxered est un système en ligne gratuit et ouvert pour remplir les déclarations PIT. Vos données restent chez vous.`,
        keywords: ["à propos de Taxered", "PIT", "Pologne"],
      },
      fr: {
        title: `À propos de Taxered - Système gratuit de déclarations fiscales France ${currentYear}`,
        description: `Taxered est un système en ligne gratuit et ouvert pour remplir les déclarations fiscales. Nous créons des outils accessibles pour les citoyens français. Vos données restent chez vous.`,
        keywords: [
          "à propos de Taxered",
          "déclarations fiscales gratuites",
          "système ouvert",
          "à propos",
          "mission",
          "valeurs",
          "confidentialité",
          "France",
        ],
      },
      de: {
        title: `À propos de Taxered - Système gratuit de déclarations fiscales Allemagne ${currentYear}`,
        description: `Taxered est un système en ligne gratuit et ouvert pour remplir les déclarations fiscales. Vos données restent chez vous.`,
        keywords: ["à propos de Taxered", "Allemagne"],
      },
      pt: {
        title: `À propos de Taxered - Système gratuit de déclarations IRS Portugal ${currentYear}`,
        description: `Taxered est un système en ligne gratuit et ouvert pour remplir les déclarations IRS. Vos données restent chez vous.`,
        keywords: ["à propos de Taxered", "IRS", "Portugal"],
      },
      es: {
        title: `À propos de Taxered - Système gratuit de déclarations fiscales Espagne ${currentYear}`,
        description: `Taxered est un système en ligne gratuit et ouvert pour remplir les déclarations fiscales. Vos données restent chez vous.`,
        keywords: ["à propos de Taxered", "Espagne"],
      },
      se: {
        title: `À propos de Taxered - Système gratuit de déclarations fiscales Suède ${currentYear}`,
        description: `Taxered est un système en ligne gratuit et ouvert pour remplir les déclarations de revenus. Vos données restent chez vous.`,
        keywords: ["à propos de Taxered", "Suède"],
      },
      gb: {
        title: `À propos de Taxered - Système gratuit de déclarations fiscales Royaume-Uni ${currentYear}`,
        description: `Taxered est un système en ligne gratuit et ouvert pour remplir les déclarations fiscales. Vos données restent chez vous.`,
        keywords: ["à propos de Taxered", "Royaume-Uni"],
      },
      us: {
        title: `À propos de Taxered - Système gratuit de déclarations fiscales États-Unis ${currentYear}`,
        description: `Taxered est un système en ligne gratuit et ouvert pour remplir les déclarations fiscales. Vos données restent chez vous.`,
        keywords: ["à propos de Taxered", "États-Unis"],
      },
      ca: {
        title: `À propos de Taxered - Système gratuit de déclarations fiscales Canada ${currentYear}`,
        description: `Taxered est un système en ligne gratuit et ouvert pour remplir les déclarations fiscales. Vos données restent chez vous.`,
        keywords: ["à propos de Taxered", "Canada"],
      },
    },
    pl: {
      ua: {
        title: `O Taxered - Bezpłatny system deklaracji podatkowych Ukraina ${currentYear}`,
        description: `Taxered to bezpłatny otwarty system online do wypełniania deklaracji podatkowych F0100214 i F0121214. Twoje dane pozostają tylko u Ciebie.`,
        keywords: ["o Taxered", "F0100214", "F0121214", "Ukraina"],
      },
      pl: {
        title: `O Taxered - Bezpłatny system rozliczeń podatkowych Polska ${currentYear}`,
        description: `Taxered to bezpłatny otwarty system online do wypełniania deklaracji podatkowych PIT. Tworzymy dostępne narzędzia dla obywateli Polski. Twoje dane pozostają tylko u Ciebie.`,
        keywords: [
          "o Taxered",
          "bezpłatne deklaracje podatkowe",
          "otwarty system",
          "o nas",
          "misja",
          "wartości",
          "prywatność danych",
          "Polska",
        ],
      },
      fr: {
        title: `O Taxered - Bezpłatny system deklaracji podatkowych Francja ${currentYear}`,
        description: `Taxered to bezpłatny otwarty system online do wypełniania deklaracji podatkowych. Twoje dane pozostają tylko u Ciebie.`,
        keywords: ["o Taxered", "Francja"],
      },
      de: {
        title: `O Taxered - Bezpłatny system deklaracji podatkowych Niemcy ${currentYear}`,
        description: `Taxered to bezpłatny otwarty system online do wypełniania deklaracji podatkowych. Twoje dane pozostają tylko u Ciebie.`,
        keywords: ["o Taxered", "Niemcy"],
      },
      pt: {
        title: `O Taxered - Bezpłatny system deklaracji IRS Portugalia ${currentYear}`,
        description: `Taxered to bezpłatny otwarty system online do wypełniania deklaracji IRS. Twoje dane pozostają tylko u Ciebie.`,
        keywords: ["o Taxered", "IRS", "Portugalia"],
      },
      es: {
        title: `O Taxered - Bezpłatny system deklaracji podatkowych Hiszpania ${currentYear}`,
        description: `Taxered to bezpłatny otwarty system online do wypełniania deklaracji podatkowych. Twoje dane pozostają tylko u Ciebie.`,
        keywords: ["o Taxered", "Hiszpania"],
      },
      se: {
        title: `O Taxered - Bezpłatny system deklaracji dochodów Szwecja ${currentYear}`,
        description: `Taxered to bezpłatny otwarty system online do wypełniania deklaracji dochodów. Twoje dane pozostają tylko u Ciebie.`,
        keywords: ["o Taxered", "Szwecja"],
      },
      gb: {
        title: `O Taxered - Bezpłatny system deklaracji podatkowych Wielka Brytania ${currentYear}`,
        description: `Taxered to bezpłatny otwarty system online do wypełniania deklaracji podatkowych. Twoje dane pozostają tylko u Ciebie.`,
        keywords: ["o Taxered", "Wielka Brytania"],
      },
      us: {
        title: `O Taxered - Bezpłatny system deklaracji podatkowych USA ${currentYear}`,
        description: `Taxered to bezpłatny otwarty system online do wypełniania deklaracji podatkowych. Twoje dane pozostają tylko u Ciebie.`,
        keywords: ["o Taxered", "USA"],
      },
      ca: {
        title: `O Taxered - Bezpłatny system deklaracji podatkowych Kanada ${currentYear}`,
        description: `Taxered to bezpłatny otwarty system online do wypełniania deklaracji podatkowych. Twoje dane pozostają tylko u Ciebie.`,
        keywords: ["o Taxered", "Kanada"],
      },
    },
    es: {
      ua: {
        title: `Acerca de Taxered - Sistema gratuito de declaraciones fiscales Ucrania ${currentYear}`,
        description: `Taxered es un sistema en línea gratuito y abierto para completar declaraciones fiscales F0100214 y F0121214. Sus datos permanecen con usted.`,
        keywords: ["acerca de Taxered", "F0100214", "F0121214", "Ucrania"],
      },
      pl: {
        title: `Acerca de Taxered - Sistema gratuito de declaraciones PIT Polonia ${currentYear}`,
        description: `Taxered es un sistema en línea gratuito y abierto para completar declaraciones PIT. Sus datos permanecen con usted.`,
        keywords: ["acerca de Taxered", "PIT", "Polonia"],
      },
      fr: {
        title: `Acerca de Taxered - Sistema gratuito de declaraciones fiscales Francia ${currentYear}`,
        description: `Taxered es un sistema en línea gratuito y abierto para completar declaraciones fiscales. Sus datos permanecen con usted.`,
        keywords: ["acerca de Taxered", "Francia"],
      },
      de: {
        title: `Acerca de Taxered - Sistema gratuito de declaraciones fiscales Alemania ${currentYear}`,
        description: `Taxered es un sistema en línea gratuito y abierto para completar declaraciones fiscales. Sus datos permanecen con usted.`,
        keywords: ["acerca de Taxered", "Alemania"],
      },
      pt: {
        title: `Acerca de Taxered - Sistema gratuito de declaraciones IRS Portugal ${currentYear}`,
        description: `Taxered es un sistema en línea gratuito y abierto para completar declaraciones IRS. Sus datos permanecen con usted.`,
        keywords: ["acerca de Taxered", "IRS", "Portugal"],
      },
      es: {
        title: `Acerca de Taxered - Sistema gratuito de declaraciones fiscales España ${currentYear}`,
        description: `Taxered es un sistema en línea gratuito y abierto para completar declaraciones fiscales. Creamos herramientas accesibles para ciudadanos españoles. Sus datos permanecen con usted.`,
        keywords: [
          "acerca de Taxered",
          "declaraciones fiscales gratuitas",
          "sistema abierto",
          "acerca de",
          "misión",
          "valores",
          "privacidad",
          "España",
        ],
      },
      se: {
        title: `Acerca de Taxered - Sistema gratuito de declaraciones fiscales Suecia ${currentYear}`,
        description: `Taxered es un sistema en línea gratuito y abierto para completar declaraciones de ingresos. Sus datos permanecen con usted.`,
        keywords: ["acerca de Taxered", "Suecia"],
      },
      gb: {
        title: `Acerca de Taxered - Sistema gratuito de declaraciones fiscales Reino Unido ${currentYear}`,
        description: `Taxered es un sistema en línea gratuito y abierto para completar declaraciones fiscales. Sus datos permanecen con usted.`,
        keywords: ["acerca de Taxered", "Reino Unido"],
      },
      us: {
        title: `Acerca de Taxered - Sistema gratuito de declaraciones fiscales Estados Unidos ${currentYear}`,
        description: `Taxered es un sistema en línea gratuito y abierto para completar declaraciones fiscales. Sus datos permanecen con usted.`,
        keywords: ["acerca de Taxered", "Estados Unidos"],
      },
      ca: {
        title: `Acerca de Taxered - Sistema gratuito de declaraciones fiscales Canadá ${currentYear}`,
        description: `Taxered es un sistema en línea gratuito y abierto para completar declaraciones fiscales. Sus datos permanecen con usted.`,
        keywords: ["acerca de Taxered", "Canadá"],
      },
    },
    pt: {
      ua: {
        title: `Sobre a Taxered - Sistema gratuito de declarações fiscais Ucrânia ${currentYear}`,
        description: `Taxered é um sistema online gratuito e aberto para preencher declarações fiscais F0100214 e F0121214. Seus dados permanecem com você.`,
        keywords: ["sobre Taxered", "F0100214", "F0121214", "Ucrânia"],
      },
      pl: {
        title: `Sobre a Taxered - Sistema gratuito de declarações PIT Polónia ${currentYear}`,
        description: `Taxered é um sistema online gratuito e aberto para preencher declarações PIT. Seus dados permanecem com você.`,
        keywords: ["sobre Taxered", "PIT", "Polónia"],
      },
      fr: {
        title: `Sobre a Taxered - Sistema gratuito de declarações fiscais França ${currentYear}`,
        description: `Taxered é um sistema online gratuito e aberto para preencher declarações fiscais. Seus dados permanecem com você.`,
        keywords: ["sobre Taxered", "França"],
      },
      de: {
        title: `Sobre a Taxered - Sistema gratuito de declarações fiscais Alemanha ${currentYear}`,
        description: `Taxered é um sistema online gratuito e aberto para preencher declarações fiscais. Seus dados permanecem com você.`,
        keywords: ["sobre Taxered", "Alemanha"],
      },
      pt: {
        title: `Sobre a Taxered - Sistema gratuito de declarações fiscais Portugal ${currentYear}`,
        description: `Taxered é um sistema online gratuito e aberto para preencher declarações fiscais. Criamos ferramentas acessíveis para cidadãos portugueses. Seus dados permanecem com você.`,
        keywords: [
          "sobre Taxered",
          "declarações fiscais gratuitas",
          "sistema aberto",
          "sobre nós",
          "missão",
          "valores",
          "privacidade",
          "Portugal",
        ],
      },
      es: {
        title: `Sobre a Taxered - Sistema gratuito de declarações fiscais Espanha ${currentYear}`,
        description: `Taxered é um sistema online gratuito e aberto para preencher declarações fiscais. Seus dados permanecem com você.`,
        keywords: ["sobre Taxered", "Espanha"],
      },
      se: {
        title: `Sobre a Taxered - Sistema gratuito de declarações fiscais Suécia ${currentYear}`,
        description: `Taxered é um sistema online gratuito e aberto para preencher declarações de rendimentos. Seus dados permanecem com você.`,
        keywords: ["sobre Taxered", "Suécia"],
      },
      gb: {
        title: `Sobre a Taxered - Sistema gratuito de declarações fiscais Reino Unido ${currentYear}`,
        description: `Taxered é um sistema online gratuito e aberto para preencher declarações fiscais. Seus dados permanecem com você.`,
        keywords: ["sobre Taxered", "Reino Unido"],
      },
      us: {
        title: `Sobre a Taxered - Sistema gratuito de declarações fiscais Estados Unidos ${currentYear}`,
        description: `Taxered é um sistema online gratuito e aberto para preencher declarações fiscais. Seus dados permanecem com você.`,
        keywords: ["sobre Taxered", "Estados Unidos"],
      },
      ca: {
        title: `Sobre a Taxered - Sistema gratuito de declarações fiscais Canadá ${currentYear}`,
        description: `Taxered é um sistema online gratuito e aberto para preencher declarações fiscais. Seus dados permanecem com você.`,
        keywords: ["sobre Taxered", "Canadá"],
      },
    },
    de: {
      ua: {
        title: `Über Taxered - Kostenloses Steuererklärungssystem Ukraine ${currentYear}`,
        description: `Taxered ist ein kostenloses offenes Online-System zum Ausfüllen von Steuererklärungen F0100214 und F0121214. Ihre Daten bleiben bei Ihnen.`,
        keywords: ["über Taxered", "F0100214", "F0121214", "Ukraine"],
      },
      pl: {
        title: `Über Taxered - Kostenloses Steuererklärungssystem Polen ${currentYear}`,
        description: `Taxered ist ein kostenloses offenes Online-System zum Ausfüllen von PIT-Steuererklärungen. Ihre Daten bleiben bei Ihnen.`,
        keywords: ["über Taxered", "PIT", "Polen"],
      },
      fr: {
        title: `Über Taxered - Kostenloses Steuererklärungssystem Frankreich ${currentYear}`,
        description: `Taxered ist ein kostenloses offenes Online-System zum Ausfüllen von Steuererklärungen. Ihre Daten bleiben bei Ihnen.`,
        keywords: ["über Taxered", "Frankreich"],
      },
      de: {
        title: `Über Taxered - Kostenloses Steuererklärungssystem Deutschland ${currentYear}`,
        description: `Taxered ist ein kostenloses offenes Online-System zum Ausfüllen von Steuererklärungen. Wir schaffen zugängliche Tools für deutsche Bürger. Ihre Daten bleiben bei Ihnen.`,
        keywords: [
          "über Taxered",
          "kostenlose Steuererklärungen",
          "offenes System",
          "über uns",
          "Mission",
          "Werte",
          "Datenschutz",
          "Deutschland",
        ],
      },
      pt: {
        title: `Über Taxered - Kostenloses Steuererklärungssystem Portugal ${currentYear}`,
        description: `Taxered ist ein kostenloses offenes Online-System zum Ausfüllen von Steuererklärungen. Ihre Daten bleiben bei Ihnen.`,
        keywords: ["über Taxered", "Portugal"],
      },
      es: {
        title: `Über Taxered - Kostenloses Steuererklärungssystem Spanien ${currentYear}`,
        description: `Taxered ist ein kostenloses offenes Online-System zum Ausfüllen von Steuererklärungen. Ihre Daten bleiben bei Ihnen.`,
        keywords: ["über Taxered", "Spanien"],
      },
      se: {
        title: `Über Taxered - Kostenloses Steuererklärungssystem Schweden ${currentYear}`,
        description: `Taxered ist ein kostenloses offenes Online-System zum Ausfüllen von Einkommenserklärungen. Ihre Daten bleiben bei Ihnen.`,
        keywords: ["über Taxered", "Schweden"],
      },
      gb: {
        title: `Über Taxered - Kostenloses Steuererklärungssystem Vereinigtes Königreich ${currentYear}`,
        description: `Taxered ist ein kostenloses offenes Online-System zum Ausfüllen von Steuererklärungen. Ihre Daten bleiben bei Ihnen.`,
        keywords: ["über Taxered", "Vereinigtes Königreich"],
      },
      us: {
        title: `Über Taxered - Kostenloses Steuererklärungssystem Vereinigte Staaten ${currentYear}`,
        description: `Taxered ist ein kostenloses offenes Online-System zum Ausfüllen von Steuererklärungen. Ihre Daten bleiben bei Ihnen.`,
        keywords: ["über Taxered", "USA"],
      },
      ca: {
        title: `Über Taxered - Kostenloses Steuererklärungssystem Kanada ${currentYear}`,
        description: `Taxered ist ein kostenloses offenes Online-System zum Ausfüllen von Steuererklärungen. Ihre Daten bleiben bei Ihnen.`,
        keywords: ["über Taxered", "Kanada"],
      },
    },
  }

  return metadata[language]?.[countryCode] || metadata.en[countryCode]
}

// Generate complete Next.js metadata object for about page
export function generateAboutMetadata(
  countryCode: CountryCode,
  language: Language,
  locale: string
): Metadata {
  const seo = generateAboutPageMetadata(countryCode, language)

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      type: "website",
      locale: `${language}_${countryCode.toUpperCase()}`,
      url: `https://taxered.com/${locale}/about`,
      title: seo.title,
      description: seo.description,
      siteName: "Taxered Tax Declaration",
      images: [
        {
          url: "/placeholder-logo.png",
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/placeholder-logo.png"],
      creator: "@monegoo",
    },
    alternates: {
      canonical: `https://taxered.com/${locale}/about`,
      languages: {
        "x-default": "https://taxered.com",
        "uk-UA": "/uk-ua/about",
        "en-US": "/en-us/about",
        "en-GB": "/en-gb/about",
        "en-CA": "/en-ca/about",
        "fr-FR": "/fr-fr/about",
        "pl-PL": "/pl-pl/about",
        "es-ES": "/es-es/about",
        "pt-PT": "/pt-pt/about",
        "de-DE": "/de-de/about",
        "sv-SE": "/sv-se/about",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

// Generate complete Next.js metadata object for help page
export function generateHelpMetadata(
  countryCode: CountryCode,
  language: Language,
  locale: string
): Metadata {
  const seo = generateHelpPageMetadata(countryCode, language)

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      type: "website",
      locale: `${language}_${countryCode.toUpperCase()}`,
      url: `https://taxered.com/${locale}/help`,
      title: seo.title,
      description: seo.description,
      siteName: "Taxered Tax Declaration",
      images: [
        {
          url: "/placeholder-logo.png",
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/placeholder-logo.png"],
      creator: "@monegoo",
    },
    alternates: {
      canonical: `https://taxered.com/${locale}/help`,
      languages: {
        "x-default": "https://taxered.com",
        "uk-UA": "/uk-ua/help",
        "en-US": "/en-us/help",
        "en-GB": "/en-gb/help",
        "en-CA": "/en-ca/help",
        "fr-FR": "/fr-fr/help",
        "pl-PL": "/pl-pl/help",
        "es-ES": "/es-es/help",
        "pt-PT": "/pt-pt/help",
        "de-DE": "/de-de/help",
        "sv-SE": "/sv-se/help",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

// Generate SEO metadata for the calculator page
export function generateCalculatorPageMetadata(
  countryCode: CountryCode,
  language: Language
): SEOMetadata {
  const currentYear = new Date().getFullYear()

  const metadata: Record<Language, Record<CountryCode, SEOMetadata>> = {
    uk: {
      ua: {
        title: `Податковий калькулятор ${currentYear} - Розрахунок податків онлайн | Taxered`,
        description: `Безкоштовний онлайн калькулятор податків для України та інших країн. Розрахуйте ПДФО, військовий збір, податок на інвестиції. Порівняйте ставки податків у різних країнах.`,
        keywords: [
          "податковий калькулятор",
          "розрахунок податків",
          "ПДФО калькулятор",
          "військовий збір",
          "податок на інвестиції",
          "податки Україна",
          "онлайн калькулятор",
        ],
      },
      pl: {
        title: `Kalkulator podatkowy ${currentYear} - Oblicz podatki online | Taxered`,
        description: `Bezpłatny kalkulator podatkowy online dla Polski i innych krajów. Oblicz PIT, ZUS, podatek od zysków kapitałowych. Porównaj stawki podatkowe w różnych krajach.`,
        keywords: [
          "kalkulator podatkowy",
          "obliczanie podatków",
          "kalkulator PIT",
          "podatek od inwestycji",
          "podatki Polska",
        ],
      },
      fr: {
        title: `Calculateur d'impôts ${currentYear} - Calculez vos impôts en ligne | Taxered`,
        description: `Calculateur d'impôts gratuit en ligne pour la France et d'autres pays. Calculez l'impôt sur le revenu, les cotisations sociales, la flat tax. Comparez les taux d'imposition.`,
        keywords: [
          "calculateur d'impôts",
          "calcul impôts",
          "simulateur fiscal",
          "flat tax",
          "impôts France",
        ],
      },
      de: {
        title: `Steuerrechner ${currentYear} - Steuern online berechnen | Taxered`,
        description: `Kostenloser Online-Steuerrechner für Deutschland und andere Länder. Berechnen Sie Einkommensteuer, Sozialabgaben, Kapitalertragsteuer. Vergleichen Sie Steuersätze.`,
        keywords: [
          "Steuerrechner",
          "Steuerberechnung",
          "Einkommensteuer Rechner",
          "Kapitalertragsteuer",
          "Steuern Deutschland",
        ],
      },
      pt: {
        title: `Calculadora de Impostos ${currentYear} - Calcule impostos online | Taxered`,
        description: `Calculadora de impostos gratuita online para Portugal e outros países. Calcule IRS, Segurança Social, mais-valias. Compare taxas de imposto em diferentes países.`,
        keywords: [
          "calculadora de impostos",
          "cálculo de impostos",
          "calculadora IRS",
          "mais-valias",
          "impostos Portugal",
        ],
      },
      es: {
        title: `Calculadora de Impuestos ${currentYear} - Calcula impuestos online | Taxered`,
        description: `Calculadora de impuestos gratuita online para España y otros países. Calcula IRPF, Seguridad Social, impuesto sobre ganancias. Compara tasas impositivas.`,
        keywords: [
          "calculadora de impuestos",
          "cálculo de impuestos",
          "calculadora IRPF",
          "ganancias de capital",
          "impuestos España",
        ],
      },
      se: {
        title: `Skattekalkylator ${currentYear} - Beräkna skatt online | Taxered`,
        description: `Gratis skattekalkylator online för Sverige och andra länder. Beräkna inkomstskatt, kommunalskatt, kapitalvinstskatt. Jämför skattesatser i olika länder.`,
        keywords: [
          "skattekalkylator",
          "skatteberäkning",
          "inkomstskatt kalkylator",
          "kapitalvinstskatt",
          "skatter Sverige",
        ],
      },
      gb: {
        title: `Tax Calculator ${currentYear} - Calculate taxes online | Taxered`,
        description: `Free online tax calculator for the UK and other countries. Calculate income tax, National Insurance, capital gains tax. Compare tax rates across countries.`,
        keywords: [
          "tax calculator",
          "tax calculation",
          "income tax calculator",
          "capital gains tax",
          "UK taxes",
        ],
      },
      us: {
        title: `Tax Calculator ${currentYear} - Calculate taxes online | Taxered`,
        description: `Free online tax calculator for the USA and other countries. Calculate federal income tax, FICA, capital gains tax. Compare tax rates across countries.`,
        keywords: [
          "tax calculator",
          "tax calculation",
          "income tax calculator",
          "capital gains tax",
          "US taxes",
        ],
      },
      ca: {
        title: `Tax Calculator ${currentYear} - Calculate taxes online | Taxered`,
        description: `Free online tax calculator for Canada and other countries. Calculate federal income tax, CPP, EI, capital gains tax. Compare tax rates across countries.`,
        keywords: [
          "tax calculator",
          "tax calculation",
          "income tax calculator",
          "capital gains tax",
          "Canadian taxes",
        ],
      },
    },
    en: {
      ua: {
        title: `Tax Calculator ${currentYear} - Calculate Taxes Online | Taxered`,
        description: `Free online tax calculator for Ukraine and other countries. Calculate personal income tax, military duty, investment tax. Compare tax rates across countries.`,
        keywords: [
          "tax calculator",
          "calculate taxes",
          "Ukraine tax calculator",
          "investment tax",
          "tax comparison",
        ],
      },
      pl: {
        title: `Tax Calculator ${currentYear} - Calculate Polish Taxes Online | Taxered`,
        description: `Free online tax calculator for Poland and other countries. Calculate PIT, ZUS contributions, capital gains tax. Compare tax rates across countries.`,
        keywords: [
          "tax calculator",
          "Poland tax calculator",
          "PIT calculator",
          "capital gains tax",
          "tax comparison",
        ],
      },
      fr: {
        title: `Tax Calculator ${currentYear} - Calculate French Taxes Online | Taxered`,
        description: `Free online tax calculator for France and other countries. Calculate income tax, social contributions, flat tax. Compare tax rates across countries.`,
        keywords: [
          "tax calculator",
          "France tax calculator",
          "income tax",
          "flat tax",
          "tax comparison",
        ],
      },
      de: {
        title: `Tax Calculator ${currentYear} - Calculate German Taxes Online | Taxered`,
        description: `Free online tax calculator for Germany and other countries. Calculate income tax, social insurance, capital gains tax. Compare tax rates across countries.`,
        keywords: [
          "tax calculator",
          "Germany tax calculator",
          "income tax",
          "capital gains tax",
          "tax comparison",
        ],
      },
      pt: {
        title: `Tax Calculator ${currentYear} - Calculate Portuguese Taxes Online | Taxered`,
        description: `Free online tax calculator for Portugal and other countries. Calculate IRS, social security, capital gains tax. Compare tax rates across countries.`,
        keywords: [
          "tax calculator",
          "Portugal tax calculator",
          "IRS calculator",
          "capital gains tax",
          "tax comparison",
        ],
      },
      es: {
        title: `Tax Calculator ${currentYear} - Calculate Spanish Taxes Online | Taxered`,
        description: `Free online tax calculator for Spain and other countries. Calculate IRPF, social security, savings tax. Compare tax rates across countries.`,
        keywords: [
          "tax calculator",
          "Spain tax calculator",
          "IRPF calculator",
          "savings tax",
          "tax comparison",
        ],
      },
      se: {
        title: `Tax Calculator ${currentYear} - Calculate Swedish Taxes Online | Taxered`,
        description: `Free online tax calculator for Sweden and other countries. Calculate municipal tax, state tax, capital gains tax. Compare tax rates across countries.`,
        keywords: [
          "tax calculator",
          "Sweden tax calculator",
          "income tax",
          "capital gains tax",
          "tax comparison",
        ],
      },
      gb: {
        title: `Tax Calculator ${currentYear} - Calculate UK Taxes Online | Taxered`,
        description: `Free online tax calculator for the UK and other countries. Calculate income tax, National Insurance, capital gains tax. Compare tax rates across countries.`,
        keywords: [
          "tax calculator",
          "UK tax calculator",
          "income tax",
          "capital gains tax",
          "tax comparison",
        ],
      },
      us: {
        title: `Tax Calculator ${currentYear} - Calculate US Taxes Online | Taxered`,
        description: `Free online tax calculator for the USA and other countries. Calculate federal income tax, FICA, capital gains tax. Compare tax rates across countries.`,
        keywords: [
          "tax calculator",
          "US tax calculator",
          "federal income tax",
          "capital gains tax",
          "tax comparison",
        ],
      },
      ca: {
        title: `Tax Calculator ${currentYear} - Calculate Canadian Taxes Online | Taxered`,
        description: `Free online tax calculator for Canada and other countries. Calculate federal income tax, CPP, EI, capital gains tax. Compare tax rates across countries.`,
        keywords: [
          "tax calculator",
          "Canada tax calculator",
          "income tax",
          "capital gains tax",
          "tax comparison",
        ],
      },
    },
    fr: {
      ua: {
        title: `Calculateur d'impôts ${currentYear} - Calculez les impôts ukrainiens | Taxered`,
        description: `Calculateur d'impôts gratuit pour l'Ukraine et d'autres pays. Calculez l'impôt sur le revenu, la taxe militaire.`,
        keywords: ["calculateur d'impôts", "impôts Ukraine"],
      },
      pl: {
        title: `Calculateur d'impôts ${currentYear} - Calculez les impôts polonais | Taxered`,
        description: `Calculateur d'impôts gratuit pour la Pologne. Calculez le PIT, les cotisations ZUS.`,
        keywords: ["calculateur d'impôts", "impôts Pologne"],
      },
      fr: {
        title: `Calculateur d'impôts ${currentYear} - Calculez vos impôts en ligne | Taxered`,
        description: `Calculateur d'impôts gratuit pour la France. Calculez l'impôt sur le revenu, les cotisations sociales, le PFU.`,
        keywords: ["calculateur d'impôts", "impôts France", "PFU"],
      },
      de: {
        title: `Calculateur d'impôts ${currentYear} - Calculez les impôts allemands | Taxered`,
        description: `Calculateur d'impôts gratuit pour l'Allemagne. Calculez l'impôt sur le revenu, les assurances sociales.`,
        keywords: ["calculateur d'impôts", "impôts Allemagne"],
      },
      pt: {
        title: `Calculateur d'impôts ${currentYear} - Calculez les impôts portugais | Taxered`,
        description: `Calculateur d'impôts gratuit pour le Portugal. Calculez l'IRS, la sécurité sociale.`,
        keywords: ["calculateur d'impôts", "impôts Portugal"],
      },
      es: {
        title: `Calculateur d'impôts ${currentYear} - Calculez les impôts espagnols | Taxered`,
        description: `Calculateur d'impôts gratuit pour l'Espagne. Calculez l'IRPF, la sécurité sociale.`,
        keywords: ["calculateur d'impôts", "impôts Espagne"],
      },
      se: {
        title: `Calculateur d'impôts ${currentYear} - Calculez les impôts suédois | Taxered`,
        description: `Calculateur d'impôts gratuit pour la Suède. Calculez l'impôt municipal, l'impôt d'État.`,
        keywords: ["calculateur d'impôts", "impôts Suède"],
      },
      gb: {
        title: `Calculateur d'impôts ${currentYear} - Calculez les impôts britanniques | Taxered`,
        description: `Calculateur d'impôts gratuit pour le Royaume-Uni. Calculez l'impôt sur le revenu, l'assurance nationale.`,
        keywords: ["calculateur d'impôts", "impôts UK"],
      },
      us: {
        title: `Calculateur d'impôts ${currentYear} - Calculez les impôts américains | Taxered`,
        description: `Calculateur d'impôts gratuit pour les États-Unis. Calculez l'impôt fédéral, FICA.`,
        keywords: ["calculateur d'impôts", "impôts USA"],
      },
      ca: {
        title: `Calculateur d'impôts ${currentYear} - Calculez les impôts canadiens | Taxered`,
        description: `Calculateur d'impôts gratuit pour le Canada. Calculez l'impôt fédéral, RPC, AE.`,
        keywords: ["calculateur d'impôts", "impôts Canada"],
      },
    },
    pl: {
      ua: {
        title: `Kalkulator podatkowy ${currentYear} - Oblicz podatki ukraińskie | Taxered`,
        description: `Bezpłatny kalkulator podatkowy dla Ukrainy. Oblicz podatek dochodowy, podatek wojskowy.`,
        keywords: ["kalkulator podatkowy", "podatki Ukraina"],
      },
      pl: {
        title: `Kalkulator podatkowy ${currentYear} - Oblicz podatki online | Taxered`,
        description: `Bezpłatny kalkulator podatkowy dla Polski. Oblicz PIT, składki ZUS, podatek od zysków kapitałowych.`,
        keywords: ["kalkulator podatkowy", "PIT", "ZUS", "podatki Polska"],
      },
      fr: {
        title: `Kalkulator podatkowy ${currentYear} - Oblicz podatki francuskie | Taxered`,
        description: `Bezpłatny kalkulator podatkowy dla Francji. Oblicz podatek dochodowy, składki społeczne.`,
        keywords: ["kalkulator podatkowy", "podatki Francja"],
      },
      de: {
        title: `Kalkulator podatkowy ${currentYear} - Oblicz podatki niemieckie | Taxered`,
        description: `Bezpłatny kalkulator podatkowy dla Niemiec. Oblicz podatek dochodowy, ubezpieczenia społeczne.`,
        keywords: ["kalkulator podatkowy", "podatki Niemcy"],
      },
      pt: {
        title: `Kalkulator podatkowy ${currentYear} - Oblicz podatki portugalskie | Taxered`,
        description: `Bezpłatny kalkulator podatkowy dla Portugalii. Oblicz IRS, ubezpieczenia społeczne.`,
        keywords: ["kalkulator podatkowy", "podatki Portugalia"],
      },
      es: {
        title: `Kalkulator podatkowy ${currentYear} - Oblicz podatki hiszpańskie | Taxered`,
        description: `Bezpłatny kalkulator podatkowy dla Hiszpanii. Oblicz IRPF, ubezpieczenia społeczne.`,
        keywords: ["kalkulator podatkowy", "podatki Hiszpania"],
      },
      se: {
        title: `Kalkulator podatkowy ${currentYear} - Oblicz podatki szwedzkie | Taxered`,
        description: `Bezpłatny kalkulator podatkowy dla Szwecji. Oblicz podatek komunalny, państwowy.`,
        keywords: ["kalkulator podatkowy", "podatki Szwecja"],
      },
      gb: {
        title: `Kalkulator podatkowy ${currentYear} - Oblicz podatki brytyjskie | Taxered`,
        description: `Bezpłatny kalkulator podatkowy dla Wielkiej Brytanii. Oblicz podatek dochodowy, NI.`,
        keywords: ["kalkulator podatkowy", "podatki UK"],
      },
      us: {
        title: `Kalkulator podatkowy ${currentYear} - Oblicz podatki amerykańskie | Taxered`,
        description: `Bezpłatny kalkulator podatkowy dla USA. Oblicz podatek federalny, FICA.`,
        keywords: ["kalkulator podatkowy", "podatki USA"],
      },
      ca: {
        title: `Kalkulator podatkowy ${currentYear} - Oblicz podatki kanadyjskie | Taxered`,
        description: `Bezpłatny kalkulator podatkowy dla Kanady. Oblicz podatek federalny, CPP, EI.`,
        keywords: ["kalkulator podatkowy", "podatki Kanada"],
      },
    },
    es: {
      ua: {
        title: `Calculadora de Impuestos ${currentYear} - Calcula impuestos ucranianos | Taxered`,
        description: `Calculadora de impuestos gratuita para Ucrania. Calcula el impuesto sobre la renta, el impuesto militar.`,
        keywords: ["calculadora de impuestos", "impuestos Ucrania"],
      },
      pl: {
        title: `Calculadora de Impuestos ${currentYear} - Calcula impuestos polacos | Taxered`,
        description: `Calculadora de impuestos gratuita para Polonia. Calcula PIT, cotizaciones ZUS.`,
        keywords: ["calculadora de impuestos", "impuestos Polonia"],
      },
      fr: {
        title: `Calculadora de Impuestos ${currentYear} - Calcula impuestos franceses | Taxered`,
        description: `Calculadora de impuestos gratuita para Francia. Calcula el impuesto sobre la renta, cotizaciones sociales.`,
        keywords: ["calculadora de impuestos", "impuestos Francia"],
      },
      de: {
        title: `Calculadora de Impuestos ${currentYear} - Calcula impuestos alemanes | Taxered`,
        description: `Calculadora de impuestos gratuita para Alemania. Calcula el impuesto sobre la renta, seguros sociales.`,
        keywords: ["calculadora de impuestos", "impuestos Alemania"],
      },
      pt: {
        title: `Calculadora de Impuestos ${currentYear} - Calcula impuestos portugueses | Taxered`,
        description: `Calculadora de impuestos gratuita para Portugal. Calcula IRS, seguridad social.`,
        keywords: ["calculadora de impuestos", "impuestos Portugal"],
      },
      es: {
        title: `Calculadora de Impuestos ${currentYear} - Calcula impuestos online | Taxered`,
        description: `Calculadora de impuestos gratuita para España. Calcula IRPF, Seguridad Social, impuesto del ahorro.`,
        keywords: ["calculadora de impuestos", "IRPF", "impuestos España"],
      },
      se: {
        title: `Calculadora de Impuestos ${currentYear} - Calcula impuestos suecos | Taxered`,
        description: `Calculadora de impuestos gratuita para Suecia. Calcula el impuesto municipal, estatal.`,
        keywords: ["calculadora de impuestos", "impuestos Suecia"],
      },
      gb: {
        title: `Calculadora de Impuestos ${currentYear} - Calcula impuestos británicos | Taxered`,
        description: `Calculadora de impuestos gratuita para Reino Unido. Calcula el impuesto sobre la renta, NI.`,
        keywords: ["calculadora de impuestos", "impuestos UK"],
      },
      us: {
        title: `Calculadora de Impuestos ${currentYear} - Calcula impuestos americanos | Taxered`,
        description: `Calculadora de impuestos gratuita para EE.UU. Calcula el impuesto federal, FICA.`,
        keywords: ["calculadora de impuestos", "impuestos USA"],
      },
      ca: {
        title: `Calculadora de Impuestos ${currentYear} - Calcula impuestos canadienses | Taxered`,
        description: `Calculadora de impuestos gratuita para Canadá. Calcula el impuesto federal, CPP, EI.`,
        keywords: ["calculadora de impuestos", "impuestos Canadá"],
      },
    },
    pt: {
      ua: {
        title: `Calculadora de Impostos ${currentYear} - Calcule impostos ucranianos | Taxered`,
        description: `Calculadora de impostos gratuita para a Ucrânia. Calcule o imposto sobre o rendimento, taxa militar.`,
        keywords: ["calculadora de impostos", "impostos Ucrânia"],
      },
      pl: {
        title: `Calculadora de Impostos ${currentYear} - Calcule impostos polacos | Taxered`,
        description: `Calculadora de impostos gratuita para a Polónia. Calcule PIT, contribuições ZUS.`,
        keywords: ["calculadora de impostos", "impostos Polónia"],
      },
      fr: {
        title: `Calculadora de Impostos ${currentYear} - Calcule impostos franceses | Taxered`,
        description: `Calculadora de impostos gratuita para a França. Calcule o imposto sobre o rendimento, contribuições sociais.`,
        keywords: ["calculadora de impostos", "impostos França"],
      },
      de: {
        title: `Calculadora de Impostos ${currentYear} - Calcule impostos alemães | Taxered`,
        description: `Calculadora de impostos gratuita para a Alemanha. Calcule o imposto sobre o rendimento, seguros sociais.`,
        keywords: ["calculadora de impostos", "impostos Alemanha"],
      },
      pt: {
        title: `Calculadora de Impostos ${currentYear} - Calcule impostos online | Taxered`,
        description: `Calculadora de impostos gratuita para Portugal. Calcule IRS, Segurança Social, mais-valias.`,
        keywords: ["calculadora de impostos", "IRS", "impostos Portugal"],
      },
      es: {
        title: `Calculadora de Impostos ${currentYear} - Calcule impostos espanhóis | Taxered`,
        description: `Calculadora de impostos gratuita para Espanha. Calcule IRPF, segurança social.`,
        keywords: ["calculadora de impostos", "impostos Espanha"],
      },
      se: {
        title: `Calculadora de Impostos ${currentYear} - Calcule impostos suecos | Taxered`,
        description: `Calculadora de impostos gratuita para a Suécia. Calcule o imposto municipal, estatal.`,
        keywords: ["calculadora de impostos", "impostos Suécia"],
      },
      gb: {
        title: `Calculadora de Impostos ${currentYear} - Calcule impostos britânicos | Taxered`,
        description: `Calculadora de impostos gratuita para o Reino Unido. Calcule o imposto sobre o rendimento, NI.`,
        keywords: ["calculadora de impostos", "impostos UK"],
      },
      us: {
        title: `Calculadora de Impostos ${currentYear} - Calcule impostos americanos | Taxered`,
        description: `Calculadora de impostos gratuita para os EUA. Calcule o imposto federal, FICA.`,
        keywords: ["calculadora de impostos", "impostos USA"],
      },
      ca: {
        title: `Calculadora de Impostos ${currentYear} - Calcule impostos canadenses | Taxered`,
        description: `Calculadora de impostos gratuita para o Canadá. Calcule o imposto federal, CPP, EI.`,
        keywords: ["calculadora de impostos", "impostos Canadá"],
      },
    },
    de: {
      ua: {
        title: `Steuerrechner ${currentYear} - Ukrainische Steuern berechnen | Taxered`,
        description: `Kostenloser Steuerrechner für die Ukraine. Berechnen Sie Einkommensteuer, Militärsteuer.`,
        keywords: ["Steuerrechner", "Steuern Ukraine"],
      },
      pl: {
        title: `Steuerrechner ${currentYear} - Polnische Steuern berechnen | Taxered`,
        description: `Kostenloser Steuerrechner für Polen. Berechnen Sie PIT, ZUS-Beiträge.`,
        keywords: ["Steuerrechner", "Steuern Polen"],
      },
      fr: {
        title: `Steuerrechner ${currentYear} - Französische Steuern berechnen | Taxered`,
        description: `Kostenloser Steuerrechner für Frankreich. Berechnen Sie Einkommensteuer, Sozialabgaben.`,
        keywords: ["Steuerrechner", "Steuern Frankreich"],
      },
      de: {
        title: `Steuerrechner ${currentYear} - Steuern online berechnen | Taxered`,
        description: `Kostenloser Steuerrechner für Deutschland. Berechnen Sie Einkommensteuer, Sozialversicherung, Kapitalertragsteuer.`,
        keywords: ["Steuerrechner", "Einkommensteuer", "Steuern Deutschland"],
      },
      pt: {
        title: `Steuerrechner ${currentYear} - Portugiesische Steuern berechnen | Taxered`,
        description: `Kostenloser Steuerrechner für Portugal. Berechnen Sie IRS, Sozialversicherung.`,
        keywords: ["Steuerrechner", "Steuern Portugal"],
      },
      es: {
        title: `Steuerrechner ${currentYear} - Spanische Steuern berechnen | Taxered`,
        description: `Kostenloser Steuerrechner für Spanien. Berechnen Sie IRPF, Sozialversicherung.`,
        keywords: ["Steuerrechner", "Steuern Spanien"],
      },
      se: {
        title: `Steuerrechner ${currentYear} - Schwedische Steuern berechnen | Taxered`,
        description: `Kostenloser Steuerrechner für Schweden. Berechnen Sie Gemeindesteuer, Staatssteuer.`,
        keywords: ["Steuerrechner", "Steuern Schweden"],
      },
      gb: {
        title: `Steuerrechner ${currentYear} - Britische Steuern berechnen | Taxered`,
        description: `Kostenloser Steuerrechner für Großbritannien. Berechnen Sie Einkommensteuer, NI.`,
        keywords: ["Steuerrechner", "Steuern UK"],
      },
      us: {
        title: `Steuerrechner ${currentYear} - Amerikanische Steuern berechnen | Taxered`,
        description: `Kostenloser Steuerrechner für die USA. Berechnen Sie Bundessteuer, FICA.`,
        keywords: ["Steuerrechner", "Steuern USA"],
      },
      ca: {
        title: `Steuerrechner ${currentYear} - Kanadische Steuern berechnen | Taxered`,
        description: `Kostenloser Steuerrechner für Kanada. Berechnen Sie Bundessteuer, CPP, EI.`,
        keywords: ["Steuerrechner", "Steuern Kanada"],
      },
    },
  }

  // Fallback to English if language/country combination not found
  const langMetadata = metadata[language] || metadata.en
  const countryMetadata = langMetadata[countryCode] || langMetadata.ua

  return countryMetadata
}

// Generate full Next.js Metadata for the calculator page
export function generateCalculatorMetadata(
  countryCode: CountryCode,
  language: Language,
  locale: string
): Metadata {
  const seo = generateCalculatorPageMetadata(countryCode, language)

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      type: "website",
      locale: `${language}_${countryCode.toUpperCase()}`,
      url: `https://taxered.com/${locale}/calculator`,
      title: seo.title,
      description: seo.description,
      siteName: "Taxered Tax Declaration",
      images: [
        {
          url: "/placeholder-logo.png",
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/placeholder-logo.png"],
      creator: "@monegoo",
    },
    alternates: {
      canonical: `https://taxered.com/${locale}/calculator`,
      languages: {
        "x-default": "https://taxered.com",
        "uk-UA": "/uk-ua/calculator",
        "en-US": "/en-us/calculator",
        "en-GB": "/en-gb/calculator",
        "en-CA": "/en-ca/calculator",
        "fr-FR": "/fr-fr/calculator",
        "pl-PL": "/pl-pl/calculator",
        "es-ES": "/es-es/calculator",
        "pt-PT": "/pt-pt/calculator",
        "de-DE": "/de-de/calculator",
        "sv-SE": "/sv-se/calculator",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

