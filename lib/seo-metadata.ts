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
        title: `Податкова декларація F0100214 та F0121214 - Україна ${new Date().getFullYear()}`,
        description: `Заповніть податкову декларацію онлайн: F0100214 про майновий стан і доходи та F0121214 (Додаток Ф1) для розрахунку ПДФО та військового збору від інвестицій. Безкоштовний сервіс для громадян України.`,
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
      url: `https://monegoo.com/${locale}`,
      title: seo.title,
      description: seo.description,
      siteName: "Monegoo Tax Declaration",
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
      canonical: `https://monegoo.com/${locale}`,
      languages: {
        "uk-ua": "/uk-ua",
        "en-us": "/en-us",
        "en-gb": "/en-gb",
        "en-ca": "/en-ca",
        "fr-fr": "/fr-fr",
        "pl-pl": "/pl-pl",
        "es-es": "/es-es",
        "pt-pt": "/pt-pt",
        "de-de": "/de-de",
        "sv-se": "/sv-se",
      },
    },
  }
}

