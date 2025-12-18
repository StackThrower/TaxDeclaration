"use client"

import { useI18n } from "@/lib/i18n-context"
import { t } from "@/lib/i18n"
import { countries, type CountryCode } from "@/lib/countries"
import { useState } from "react"
import { useParams } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

export function Footer() {
  const { language } = useI18n()
  const params = useParams()
  const locale = params?.locale as string || `${language}-ua`
  const [expandedCountry, setExpandedCountry] = useState<CountryCode | null>(null)

  return (
    <footer className="bg-secondary text-secondary-foreground py-8 md:py-12 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">{t(language, "footer.about")}</h3>
            <ul className="space-y-2 text-xs md:text-sm opacity-75">
              <li>
                <a href={`/${locale}/about`} className="hover:opacity-100 transition-opacity hover:underline">
                  {t(language, "footer.about")}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/privacy`}
                  className="hover:opacity-100 transition-opacity hover:underline"
                >
                  {language === "uk" ? "Політика конфіденційності" :
                   language === "pl" ? "Polityka prywatności" :
                   language === "en" ? "Privacy Policy" :
                   language === "fr" ? "Politique de confidentialité" :
                   language === "de" ? "Datenschutzrichtlinie" :
                   language === "es" ? "Política de privacidad" :
                   language === "pt" ? "Política de Privacidade" :
                   "Privacy Policy"}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/terms`}
                  className="hover:opacity-100 transition-opacity hover:underline"
                >
                  {language === "uk" ? "Умови використання" :
                   language === "pl" ? "Warunki użytkowania" :
                   language === "en" ? "Terms of Use" :
                   language === "fr" ? "Conditions d'utilisation" :
                   language === "de" ? "Nutzungsbedingungen" :
                   language === "es" ? "Términos de uso" :
                   language === "pt" ? "Termos de Uso" :
                   "Terms of Use"}
                </a>
              </li>
              <li>
                <a href={`/${locale}/knowledge`} className="hover:opacity-100 transition-opacity hover:underline">
                  {t(language, "knowledge.base")}
                </a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {Object.values(countries).map((country) => (
                <div key={country.code} className="text-xs md:text-sm">
                  <button
                    onClick={() => setExpandedCountry(expandedCountry === country.code ? null : country.code)}
                    className="flex items-center gap-2 w-full text-left opacity-75 hover:opacity-100 transition-opacity font-medium"
                  >
                    <span>{country.flag} {country.name}</span>
                    {expandedCountry === country.code ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                  {expandedCountry === country.code && (
                    <ul className="mt-2 ml-6 space-y-1 opacity-75">
                      {country.taxForms.map((form) => (
                        <li key={form.id}>
                          <a
                            href={`/${language}-${country.code}#forms`}
                            className="hover:opacity-100 transition-opacity hover:underline"
                          >
                            {form.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Help</h3>
            <ul className="space-y-2 text-xs md:text-sm opacity-75">
              <li>
                <a href={`/${locale}/help`} className="hover:opacity-100 transition-opacity hover:underline">
                  {t(language, "help.title")}
                </a>
              </li>
            </ul>
            <h3 className="font-semibold mb-3 md:mb-4 mt-6 text-sm md:text-base">Contact</h3>
            <ul className="space-y-2 text-xs md:text-sm opacity-75">
              <li className="break-words">Email: 0x01code@gmail.com</li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://www.linkedin.com/groups/16413023/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-75 hover:opacity-100 transition-opacity"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/channel/UC-EGlDZD2b8cUOq6oDhR2Bw"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-75 hover:opacity-100 transition-opacity"
                aria-label="YouTube"
              >
                <YouTubeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-secondary/50 pt-6 md:pt-8 text-center text-xs md:text-sm opacity-75">
          <p>{t(language, "footer.copyright")}</p>
        </div>

        {/* Comprehensive Legal Disclaimer */}
        <div className="border-t border-secondary/50 mt-6 pt-4">
          <div className="text-[10px] leading-relaxed opacity-60 text-justify space-y-2">
            {language === "uk" && (
              <>
                <p className="font-semibold text-center mb-2">ЮРИДИЧНИЙ ДИСКЛЕЙМЕР ТА ОБМЕЖЕННЯ ВІДПОВІДАЛЬНОСТІ</p>
                <p>
                  <strong>1. ЗАГАЛЬНІ ПОЛОЖЕННЯ:</strong> Інформація, інструменти, калькулятори та матеріали, розміщені на веб-сайті monegoo.com (далі — "Сервіс"), надаються виключно в інформаційних та освітніх цілях і не є професійною юридичною, податковою, фінансовою або бухгалтерською консультацією. Використання Сервісу не створює відносин "консультант-клієнт" між користувачем та власником сайту.
                </p>
                <p>
                  <strong>2. НЕ Є ПРОФЕСІЙНОЮ КОНСУЛЬТАЦІЄЮ:</strong> Сервіс НЕ ЗАМІНЮЄ кваліфікованої консультації податкового радника, адвоката, бухгалтера або іншого ліцензованого фахівця. Законодавство України та інших країн є складним, постійно змінюється та має індивідуальні особливості застосування. Ми настійно рекомендуємо проконсультуватися з кваліфікованим спеціалістом перед поданням будь-яких податкових документів до Державної податкової служби України або інших податкових органів.
                </p>
                <p>
                  <strong>3. ВІДСУТНІСТЬ ГАРАНТІЙ ТОЧНОСТІ:</strong> Власник сайту не гарантує точність, повноту, актуальність або правильність будь-якої інформації, розрахунків або документів, згенерованих Сервісом. Інформація може містити технічні неточності, типографічні помилки або бути застарілою. Розрахунки виконуються автоматично на основі введених користувачем даних та можуть містити помилки алгоритму.
                </p>
                <p>
                  <strong>4. ПОВНА ВІДМОВА ВІД ВІДПОВІДАЛЬНОСТІ:</strong> Власник, розробник, оператор та всі пов'язані особи сайту monegoo.com НЕ НЕСУТЬ ЖОДНОЇ ВІДПОВІДАЛЬНОСТІ (включаючи, але не обмежуючись) за: (а) будь-які прямі, непрямі, випадкові, штрафні, спеціальні або наслідкові збитки; (б) втрату прибутку, доходу, даних або економії; (в) штрафи, пені, санкції або додаткові податкові нарахування від податкових органів; (г) помилки в розрахунках або документах; (д) будь-які дії або бездіяльність користувача, пов'язані з використанням Сервісу; (е) неможливість використання Сервісу або перебої в його роботі.
                </p>
                <p>
                  <strong>5. ВІДПОВІДАЛЬНІСТЬ КОРИСТУВАЧА:</strong> Користувач несе повну особисту відповідальність за: (а) достовірність та точність усіх введених даних; (б) правильність заповнення податкових форм; (в) перевірку всіх розрахунків та згенерованих документів перед поданням; (г) відповідність поданих документів чинному законодавству України та/або країни податкового резидентства; (д) своєчасну сплату всіх податкових зобов'язань. КОРИСТУВАЧ ВИКОРИСТОВУЄ СЕРВІС НА ВЛАСНИЙ РИЗИК.
                </p>
                <p>
                  <strong>6. ВІДСУТНІСТЬ ЗБЕРІГАННЯ ДАНИХ:</strong> Всі розрахунки виконуються локально в браузері користувача. Власник сайту не зберігає, не обробляє та не передає персональні або податкові дані користувачів на свої сервери. Користувач несе відповідальність за збереження та захист згенерованих документів.
                </p>
                <p>
                  <strong>7. ЗМІНИ ЗАКОНОДАВСТВА:</strong> Податкове законодавство України та інших країн постійно змінюється. Інформація на сайті може не відповідати актуальним законодавчим вимогам. Користувач зобов'язаний самостійно перевіряти актуальність інформації на офіційних ресурсах податкових органів.
                </p>
                <p>
                  <strong>8. НАДАННЯ "ЯК Є":</strong> Сервіс надається на принципах "як є" (AS IS) та "як доступно" (AS AVAILABLE) без будь-яких гарантій, явних чи неявних, включаючи, але не обмежуючись, гарантіями товарної придатності, придатності для конкретної мети та ненарушення прав третіх осіб.
                </p>
                <p>
                  <strong>9. ОБМЕЖЕННЯ ВІДПОВІДАЛЬНОСТІ:</strong> У максимальному обсязі, дозволеному чинним законодавством України, сукупна відповідальність власника сайту за будь-які претензії, що виникають у зв'язку з використанням Сервісу, обмежується сумою, фактично сплаченою користувачем за використання Сервісу (що становить 0 грн, оскільки Сервіс є безкоштовним).
                </p>
                <p>
                  <strong>10. ВІДСУТНІСТЬ ЛІЦЕНЗІЇ:</strong> Власник сайту не має ліцензії на надання юридичних, податкових або бухгалтерських послуг в Україні чи будь-якій іншій країні. Сервіс є виключно технічним інструментом для автоматизації заповнення документів.
                </p>
                <p className="text-center mt-3 font-semibold">
                  ВИКОРИСТОВУЮЧИ ЦЕЙ СЕРВІС, ВИ ПІДТВЕРДЖУЄТЕ, ЩО ПОВНІСТЮ ПРОЧИТАЛИ, ЗРОЗУМІЛИ ТА ПОГОДИЛИСЯ З УСІМА УМОВАМИ ДАНОГО ДИСКЛЕЙМЕРУ. ЯКЩО ВИ НЕ ЗГОДНІ З БУДЬ-ЯКОЮ ЧАСТИНОЮ, НЕГАЙНО ПРИПИНІТЬ ВИКОРИСТАННЯ СЕРВІСУ.
                </p>
              </>
            )}

            {language === "pl" && (
              <>
                <p className="font-semibold text-center mb-2">PRAWNE OŚWIADCZENIE I OGRANICZENIE ODPOWIEDZIALNOŚCI</p>
                <p>
                  <strong>1. POSTANOWIENIA OGÓLNE:</strong> Informacje, narzędzia, kalkulatory i materiały dostępne na stronie monegoo.com (dalej "Serwis") są udostępniane wyłącznie w celach informacyjnych i edukacyjnych i nie stanowią profesjonalnej porady prawnej, podatkowej, finansowej ani księgowej. Korzystanie z Serwisu nie tworzy relacji doradca-klient między użytkownikiem a właścicielem strony.
                </p>
                <p>
                  <strong>2. NIE STANOWI PROFESJONALNEJ PORADY:</strong> Serwis NIE ZASTĘPUJE wykwalifikowanej konsultacji doradcy podatkowego, prawnika, księgowego lub innego licencjonowanego specjalisty. Przepisy polskiego prawa podatkowego i innych krajów są złożone, stale się zmieniają i mają indywidualne cechy stosowania. Zdecydowanie zalecamy konsultację z wykwalifikowanym specjalistą przed złożeniem jakichkolwiek dokumentów podatkowych do Krajowej Administracji Skarbowej lub innych organów podatkowych.
                </p>
                <p>
                  <strong>3. BRAK GWARANCJI DOKŁADNOŚCI:</strong> Właściciel strony nie gwarantuje dokładności, kompletności, aktualności ani poprawności jakichkolwiek informacji, obliczeń lub dokumentów wygenerowanych przez Serwis. Informacje mogą zawierać nieścisłości techniczne, błędy typograficzne lub być nieaktualne. Obliczenia są wykonywane automatycznie na podstawie danych wprowadzonych przez użytkownika i mogą zawierać błędy algorytmu.
                </p>
                <p>
                  <strong>4. CAŁKOWITE WYŁĄCZENIE ODPOWIEDZIALNOŚCI:</strong> Właściciel, deweloper, operator i wszystkie powiązane osoby strony monegoo.com NIE PONOSZĄ ŻADNEJ ODPOWIEDZIALNOŚCI (w tym między innymi) za: (a) jakiekolwiek bezpośrednie, pośrednie, przypadkowe, karne, specjalne lub wtórne szkody; (b) utratę zysku, dochodu, danych lub oszczędności; (c) kary, grzywny, sankcje lub dodatkowe naliczenia podatkowe od organów podatkowych; (d) błędy w obliczeniach lub dokumentach; (e) jakiekolwiek działania lub zaniechania użytkownika związane z korzystaniem z Serwisu; (f) niemożność korzystania z Serwisu lub przerwy w jego działaniu.
                </p>
                <p>
                  <strong>5. ODPOWIEDZIALNOŚĆ UŻYTKOWNIKA:</strong> Użytkownik ponosi pełną osobistą odpowiedzialność za: (a) prawdziwość i dokładność wszystkich wprowadzonych danych; (b) poprawność wypełnienia formularzy podatkowych; (c) weryfikację wszystkich obliczeń i wygenerowanych dokumentów przed złożeniem; (d) zgodność złożonych dokumentów z obowiązującym prawem polskim i/lub kraju rezydencji podatkowej; (e) terminową zapłatę wszystkich zobowiązań podatkowych. UŻYTKOWNIK KORZYSTA Z SERWISU NA WŁASNE RYZYKO.
                </p>
                <p>
                  <strong>6. BRAK PRZECHOWYWANIA DANYCH:</strong> Wszystkie obliczenia są wykonywane lokalnie w przeglądarce użytkownika. Właściciel strony nie przechowuje, nie przetwarza i nie przekazuje danych osobowych ani podatkowych użytkowników na swoje serwery. Użytkownik jest odpowiedzialny za przechowywanie i ochronę wygenerowanych dokumentów.
                </p>
                <p>
                  <strong>7. ZMIANY PRZEPISÓW:</strong> Prawo podatkowe w Polsce i innych krajach stale się zmienia. Informacje na stronie mogą nie odpowiadać aktualnym wymogom prawnym. Użytkownik jest zobowiązany samodzielnie sprawdzać aktualność informacji na oficjalnych stronach organów podatkowych.
                </p>
                <p>
                  <strong>8. ŚWIADCZENIE "TAK JAK JEST":</strong> Serwis jest świadczony na zasadach "jak jest" (AS IS) i "jak dostępny" (AS AVAILABLE) bez jakichkolwiek gwarancji, wyraźnych lub dorozumianych, w tym między innymi gwarancji przydatności handlowej, przydatności do określonego celu i nienaruszania praw osób trzecich.
                </p>
                <p>
                  <strong>9. OGRANICZENIE ODPOWIEDZIALNOŚCI:</strong> W maksymalnym zakresie dozwolonym przez obowiązujące prawo polskie, łączna odpowiedzialność właściciela strony za wszelkie roszczenia wynikające z korzystania z Serwisu jest ograniczona do kwoty faktycznie zapłaconej przez użytkownika za korzystanie z Serwisu (która wynosi 0 PLN, ponieważ Serwis jest bezpłatny).
                </p>
                <p>
                  <strong>10. BRAK LICENCJI:</strong> Właściciel strony nie posiada licencji na świadczenie usług prawnych, podatkowych ani księgowych w Polsce ani w żadnym innym kraju. Serwis jest wyłącznie narzędziem technicznym do automatyzacji wypełniania dokumentów.
                </p>
                <p className="text-center mt-3 font-semibold">
                  KORZYSTAJĄC Z TEGO SERWISU, POTWIERDZASZ, ŻE W PEŁNI PRZECZYTAŁEŚ, ZROZUMIAŁEŚ I ZGODZIŁEŚ SIĘ ZE WSZYSTKIMI WARUNKAMI NINIEJSZEGO OŚWIADCZENIA. JEŚLI NIE ZGADZASZ SIĘ Z JAKĄKOLWIEK CZĘŚCIĄ, NATYCHMIAST ZAPRZESTAŃ KORZYSTANIA Z SERWISU.
                </p>
              </>
            )}

            {language === "en" && (
              <>
                <p className="font-semibold text-center mb-2">LEGAL DISCLAIMER AND LIMITATION OF LIABILITY</p>
                <p>
                  <strong>1. GENERAL PROVISIONS:</strong> The information, tools, calculators, and materials available on the monegoo.com website (the "Service") are provided solely for informational and educational purposes and do not constitute professional legal, tax, financial, or accounting advice. Use of the Service does not create an advisor-client relationship between the user and the website owner.
                </p>
                <p>
                  <strong>2. NOT PROFESSIONAL ADVICE:</strong> The Service DOES NOT REPLACE qualified consultation with a tax advisor, attorney, accountant, or other licensed professional. The laws of the United States and other countries are complex, constantly changing, and have individual application features. We strongly recommend consulting with a qualified specialist before filing any tax documents with the Internal Revenue Service (IRS) or other tax authorities.
                </p>
                <p>
                  <strong>3. NO WARRANTY OF ACCURACY:</strong> The website owner does not guarantee the accuracy, completeness, timeliness, or correctness of any information, calculations, or documents generated by the Service. Information may contain technical inaccuracies, typographical errors, or be outdated. Calculations are performed automatically based on user-entered data and may contain algorithm errors.
                </p>
                <p>
                  <strong>4. COMPLETE DISCLAIMER OF LIABILITY:</strong> The owner, developer, operator, and all related parties of the monegoo.com website SHALL NOT BE LIABLE (including but not limited to) for: (a) any direct, indirect, incidental, punitive, special, or consequential damages; (b) loss of profit, revenue, data, or savings; (c) penalties, fines, sanctions, or additional tax assessments from tax authorities; (d) errors in calculations or documents; (e) any actions or omissions of the user related to the use of the Service; (f) inability to use the Service or interruptions in its operation.
                </p>
                <p>
                  <strong>5. USER RESPONSIBILITY:</strong> The user bears full personal responsibility for: (a) the truthfulness and accuracy of all entered data; (b) the correctness of tax form completion; (c) verification of all calculations and generated documents before filing; (d) compliance of filed documents with applicable laws of the United States and/or country of tax residence; (e) timely payment of all tax obligations. THE USER USES THE SERVICE AT THEIR OWN RISK.
                </p>
                <p>
                  <strong>6. NO DATA STORAGE:</strong> All calculations are performed locally in the user's browser. The website owner does not store, process, or transmit users' personal or tax data to its servers. The user is responsible for storing and protecting generated documents.
                </p>
                <p>
                  <strong>7. CHANGES IN LEGISLATION:</strong> Tax laws in the United States and other countries are constantly changing. Information on the website may not comply with current legislative requirements. The user is obligated to independently verify the currency of information on official tax authority resources.
                </p>
                <p>
                  <strong>8. PROVIDED "AS IS":</strong> The Service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement of third-party rights.
                </p>
                <p>
                  <strong>9. LIMITATION OF LIABILITY:</strong> To the maximum extent permitted by applicable United States law, the website owner's aggregate liability for any claims arising in connection with the use of the Service is limited to the amount actually paid by the user for use of the Service (which is $0 USD, as the Service is free).
                </p>
                <p>
                  <strong>10. NO LICENSE:</strong> The website owner does not have a license to provide legal, tax, or accounting services in the United States or any other country. The Service is solely a technical tool for automating document completion.
                </p>
                <p className="text-center mt-3 font-semibold">
                  BY USING THIS SERVICE, YOU CONFIRM THAT YOU HAVE FULLY READ, UNDERSTOOD, AND AGREED TO ALL TERMS OF THIS DISCLAIMER. IF YOU DO NOT AGREE WITH ANY PART, IMMEDIATELY CEASE USING THE SERVICE.
                </p>
              </>
            )}

            {language === "fr" && (
              <>
                <p className="font-semibold text-center mb-2">AVIS JURIDIQUE ET LIMITATION DE RESPONSABILITÉ</p>
                <p>
                  <strong>1. DISPOSITIONS GÉNÉRALES :</strong> Les informations, outils, calculateurs et matériels disponibles sur le site monegoo.com (le "Service") sont fournis uniquement à des fins informatives et éducatives et ne constituent pas un conseil professionnel juridique, fiscal, financier ou comptable. L'utilisation du Service ne crée pas de relation conseiller-client entre l'utilisateur et le propriétaire du site.
                </p>
                <p>
                  <strong>2. N'EST PAS UN CONSEIL PROFESSIONNEL :</strong> Le Service NE REMPLACE PAS une consultation qualifiée avec un conseiller fiscal, un avocat, un comptable ou un autre professionnel agréé. Les lois fiscales françaises et d'autres pays sont complexes, en constante évolution et ont des caractéristiques d'application individuelles. Nous recommandons fortement de consulter un spécialiste qualifié avant de soumettre des documents fiscaux à la Direction Générale des Finances Publiques (DGFiP) ou à d'autres autorités fiscales.
                </p>
                <p>
                  <strong>3. AUCUNE GARANTIE D'EXACTITUDE :</strong> Le propriétaire du site ne garantit pas l'exactitude, l'exhaustivité, l'actualité ou la correction de toute information, calcul ou document généré par le Service. Les informations peuvent contenir des inexactitudes techniques, des erreurs typographiques ou être obsolètes. Les calculs sont effectués automatiquement sur la base des données saisies par l'utilisateur et peuvent contenir des erreurs d'algorithme.
                </p>
                <p>
                  <strong>4. EXCLUSION COMPLÈTE DE RESPONSABILITÉ :</strong> Le propriétaire, le développeur, l'opérateur et toutes les parties associées au site monegoo.com NE SONT PAS RESPONSABLES (y compris, mais sans s'y limiter) de : (a) tout dommage direct, indirect, accessoire, punitif, spécial ou consécutif ; (b) perte de profit, de revenus, de données ou d'économies ; (c) pénalités, amendes, sanctions ou cotisations fiscales supplémentaires des autorités fiscales ; (d) erreurs dans les calculs ou documents ; (e) toute action ou omission de l'utilisateur liée à l'utilisation du Service ; (f) impossibilité d'utiliser le Service ou interruptions de son fonctionnement.
                </p>
                <p>
                  <strong>5. RESPONSABILITÉ DE L'UTILISATEUR :</strong> L'utilisateur assume l'entière responsabilité personnelle pour : (a) la véracité et l'exactitude de toutes les données saisies ; (b) l'exactitude du remplissage des formulaires fiscaux ; (c) la vérification de tous les calculs et documents générés avant soumission ; (d) la conformité des documents soumis avec la législation française et/ou du pays de résidence fiscale ; (e) le paiement en temps opportun de toutes les obligations fiscales. L'UTILISATEUR UTILISE LE SERVICE À SES PROPRES RISQUES.
                </p>
                <p>
                  <strong>6. AUCUN STOCKAGE DE DONNÉES :</strong> Tous les calculs sont effectués localement dans le navigateur de l'utilisateur. Le propriétaire du site ne stocke pas, ne traite pas et ne transmet pas les données personnelles ou fiscales des utilisateurs sur ses serveurs. L'utilisateur est responsable du stockage et de la protection des documents générés.
                </p>
                <p>
                  <strong>7. CHANGEMENTS LÉGISLATIFS :</strong> La législation fiscale en France et dans d'autres pays évolue constamment. Les informations sur le site peuvent ne pas être conformes aux exigences législatives actuelles. L'utilisateur est tenu de vérifier indépendamment l'actualité des informations sur les ressources officielles des autorités fiscales.
                </p>
                <p>
                  <strong>8. FOURNI "TEL QUEL" :</strong> Le Service est fourni sur une base "TEL QUEL" (AS IS) et "TEL QUE DISPONIBLE" (AS AVAILABLE) sans aucune garantie, expresse ou implicite, y compris, mais sans s'y limiter, les garanties de qualité marchande, d'adéquation à un usage particulier et de non-violation des droits de tiers.
                </p>
                <p>
                  <strong>9. LIMITATION DE RESPONSABILITÉ :</strong> Dans la mesure maximale autorisée par la loi française applicable, la responsabilité globale du propriétaire du site pour toute réclamation découlant de l'utilisation du Service est limitée au montant effectivement payé par l'utilisateur pour l'utilisation du Service (qui est de 0 €, car le Service est gratuit).
                </p>
                <p>
                  <strong>10. ABSENCE DE LICENCE :</strong> Le propriétaire du site ne dispose pas de licence pour fournir des services juridiques, fiscaux ou comptables en France ou dans tout autre pays. Le Service est uniquement un outil technique pour automatiser le remplissage de documents.
                </p>
                <p className="text-center mt-3 font-semibold">
                  EN UTILISANT CE SERVICE, VOUS CONFIRMEZ AVOIR ENTIÈREMENT LU, COMPRIS ET ACCEPTÉ TOUS LES TERMES DE CET AVIS. SI VOUS N'ÊTES PAS D'ACCORD AVEC UNE PARTIE, CESSEZ IMMÉDIATEMENT D'UTILISER LE SERVICE.
                </p>
              </>
            )}

            {language === "de" && (
              <>
                <p className="font-semibold text-center mb-2">RECHTLICHER HAFTUNGSAUSSCHLUSS UND HAFTUNGSBESCHRÄNKUNG</p>
                <p>
                  <strong>1. ALLGEMEINE BESTIMMUNGEN:</strong> Die Informationen, Werkzeuge, Rechner und Materialien, die auf der Website monegoo.com (der "Dienst") verfügbar sind, werden ausschließlich zu Informations- und Bildungszwecken bereitgestellt und stellen keine professionelle Rechts-, Steuer-, Finanz- oder Buchhaltungsberatung dar. Die Nutzung des Dienstes begründet kein Berater-Kunden-Verhältnis zwischen dem Nutzer und dem Website-Betreiber.
                </p>
                <p>
                  <strong>2. KEINE PROFESSIONELLE BERATUNG:</strong> Der Dienst ERSETZT NICHT die qualifizierte Beratung durch einen Steuerberater, Rechtsanwalt, Buchhalter oder anderen lizenzierten Fachmann. Die Steuergesetze Deutschlands und anderer Länder sind komplex, ändern sich ständig und haben individuelle Anwendungsmerkmale. Wir empfehlen dringend, einen qualifizierten Spezialisten zu konsultieren, bevor Sie Steuerunterlagen beim Finanzamt oder anderen Steuerbehörden einreichen.
                </p>
                <p>
                  <strong>3. KEINE GEWÄHRLEISTUNG DER GENAUIGKEIT:</strong> Der Website-Betreiber garantiert nicht die Genauigkeit, Vollständigkeit, Aktualität oder Korrektheit von Informationen, Berechnungen oder vom Dienst generierten Dokumenten. Informationen können technische Ungenauigkeiten, typografische Fehler enthalten oder veraltet sein. Berechnungen werden automatisch auf Basis der vom Nutzer eingegebenen Daten durchgeführt und können Algorithmenfehler enthalten.
                </p>
                <p>
                  <strong>4. VOLLSTÄNDIGER HAFTUNGSAUSSCHLUSS:</strong> Der Eigentümer, Entwickler, Betreiber und alle verbundenen Parteien der Website monegoo.com HAFTEN NICHT (einschließlich, aber nicht beschränkt auf) für: (a) direkte, indirekte, zufällige, Straf-, besondere oder Folgeschäden; (b) Verlust von Gewinn, Einkommen, Daten oder Ersparnissen; (c) Strafen, Bußgelder, Sanktionen oder zusätzliche Steuerveranlagungen von Steuerbehörden; (d) Fehler in Berechnungen oder Dokumenten; (e) Handlungen oder Unterlassungen des Nutzers im Zusammenhang mit der Nutzung des Dienstes; (f) Unmöglichkeit der Nutzung des Dienstes oder Unterbrechungen seines Betriebs.
                </p>
                <p>
                  <strong>5. VERANTWORTUNG DES NUTZERS:</strong> Der Nutzer trägt die volle persönliche Verantwortung für: (a) Wahrhaftigkeit und Genauigkeit aller eingegebenen Daten; (b) Korrektheit beim Ausfüllen von Steuerformularen; (c) Überprüfung aller Berechnungen und generierten Dokumente vor Einreichung; (d) Einhaltung der geltenden deutschen Gesetze und/oder des Steueransässigkeitslandes bei eingereichten Dokumenten; (e) rechtzeitige Zahlung aller Steuerpflichten. DER NUTZER VERWENDET DEN DIENST AUF EIGENES RISIKO.
                </p>
                <p>
                  <strong>6. KEINE DATENSPEICHERUNG:</strong> Alle Berechnungen werden lokal im Browser des Nutzers durchgeführt. Der Website-Betreiber speichert, verarbeitet oder überträgt keine persönlichen oder steuerlichen Daten der Nutzer auf seine Server. Der Nutzer ist für die Speicherung und den Schutz generierter Dokumente verantwortlich.
                </p>
                <p>
                  <strong>7. GESETZESÄNDERUNGEN:</strong> Die Steuergesetze in Deutschland und anderen Ländern ändern sich ständig. Informationen auf der Website entsprechen möglicherweise nicht den aktuellen gesetzlichen Anforderungen. Der Nutzer ist verpflichtet, die Aktualität der Informationen auf offiziellen Ressourcen der Steuerbehörden selbstständig zu überprüfen.
                </p>
                <p>
                  <strong>8. BEREITSTELLUNG "WIE BESEHEN":</strong> Der Dienst wird auf "WIE BESEHEN" (AS IS) und "WIE VERFÜGBAR" (AS AVAILABLE) Basis ohne jegliche Garantien, ausdrücklich oder stillschweigend, bereitgestellt, einschließlich, aber nicht beschränkt auf Garantien der Marktgängigkeit, Eignung für einen bestimmten Zweck und Nichtverletzung von Rechten Dritter.
                </p>
                <p>
                  <strong>9. HAFTUNGSBESCHRÄNKUNG:</strong> Im maximalen nach deutschem Recht zulässigen Umfang ist die Gesamthaftung des Website-Betreibers für Ansprüche im Zusammenhang mit der Nutzung des Dienstes auf den vom Nutzer tatsächlich gezahlten Betrag für die Nutzung des Dienstes begrenzt (der 0 € beträgt, da der Dienst kostenlos ist).
                </p>
                <p>
                  <strong>10. KEINE LIZENZ:</strong> Der Website-Betreiber verfügt über keine Lizenz zur Erbringung von Rechts-, Steuer- oder Buchhaltungsdienstleistungen in Deutschland oder einem anderen Land. Der Dienst ist ausschließlich ein technisches Werkzeug zur Automatisierung des Dokumentenausfüllens.
                </p>
                <p className="text-center mt-3 font-semibold">
                  DURCH DIE NUTZUNG DIESES DIENSTES BESTÄTIGEN SIE, DASS SIE ALLE BEDINGUNGEN DIESES HAFTUNGSAUSSCHLUSSES VOLLSTÄNDIG GELESEN, VERSTANDEN UND AKZEPTIERT HABEN. WENN SIE MIT EINEM TEIL NICHT EINVERSTANDEN SIND, BEENDEN SIE DIE NUTZUNG DES DIENSTES SOFORT.
                </p>
              </>
            )}

            {language === "es" && (
              <>
                <p className="font-semibold text-center mb-2">DESCARGO DE RESPONSABILIDAD LEGAL Y LIMITACIÓN DE RESPONSABILIDAD</p>
                <p>
                  <strong>1. DISPOSICIONES GENERALES:</strong> La información, herramientas, calculadoras y materiales disponibles en el sitio web monegoo.com (el "Servicio") se proporcionan únicamente con fines informativos y educativos y no constituyen asesoramiento profesional legal, fiscal, financiero o contable. El uso del Servicio no crea una relación asesor-cliente entre el usuario y el propietario del sitio web.
                </p>
                <p>
                  <strong>2. NO ES ASESORAMIENTO PROFESIONAL:</strong> El Servicio NO REEMPLAZA la consulta calificada con un asesor fiscal, abogado, contador u otro profesional con licencia. Las leyes fiscales de España y otros países son complejas, cambian constantemente y tienen características de aplicación individuales. Recomendamos encarecidamente consultar con un especialista calificado antes de presentar documentos fiscales ante la Agencia Tributaria o cualquier otra autoridad fiscal.
                </p>
                <p>
                  <strong>3. SIN GARANTÍA DE PRECISIÓN:</strong> El propietario del sitio web no garantiza la precisión, integridad, actualidad o corrección de cualquier información, cálculos o documentos generados por el Servicio. La información puede contener inexactitudes técnicas, errores tipográficos o estar desactualizada. Los cálculos se realizan automáticamente según los datos ingresados por el usuario y pueden contener errores de algoritmo.
                </p>
                <p>
                  <strong>4. EXCLUSIÓN COMPLETA DE RESPONSABILIDAD:</strong> El propietario, desarrollador, operador y todas las partes relacionadas del sitio web monegoo.com NO SERÁN RESPONSABLES (incluyendo pero no limitándose a) por: (a) cualquier daño directo, indirecto, incidental, punitivo, especial o consecuente; (b) pérdida de beneficios, ingresos, datos o ahorros; (c) multas, sanciones o evaluaciones fiscales adicionales de las autoridades fiscales; (d) errores en cálculos o documentos; (e) cualquier acción u omisión del usuario relacionada con el uso del Servicio; (f) imposibilidad de usar el Servicio o interrupciones en su funcionamiento.
                </p>
                <p>
                  <strong>5. RESPONSABILIDAD DEL USUARIO:</strong> El usuario asume la responsabilidad personal completa por: (a) la veracidad y precisión de todos los datos ingresados; (b) la corrección del llenado de formularios fiscales; (c) la verificación de todos los cálculos y documentos generados antes de la presentación; (d) el cumplimiento de los documentos presentados con las leyes aplicables de España y/o del país de residencia fiscal; (e) el pago oportuno de todas las obligaciones fiscales. EL USUARIO UTILIZA EL SERVICIO BAJO SU PROPIO RIESGO.
                </p>
                <p>
                  <strong>6. SIN ALMACENAMIENTO DE DATOS:</strong> Todos los cálculos se realizan localmente en el navegador del usuario. El propietario del sitio web no almacena, procesa ni transmite los datos personales o fiscales de los usuarios a sus servidores. El usuario es responsable del almacenamiento y protección de los documentos generados.
                </p>
                <p>
                  <strong>7. CAMBIOS LEGISLATIVOS:</strong> La legislación fiscal en España y otros países cambia constantemente. La información en el sitio web puede no cumplir con los requisitos legislativos actuales. El usuario está obligado a verificar independientemente la actualidad de la información en los recursos oficiales de las autoridades fiscales.
                </p>
                <p>
                  <strong>8. PROPORCIONADO "TAL CUAL":</strong> El Servicio se proporciona "TAL CUAL" (AS IS) y "SEGÚN DISPONIBILIDAD" (AS AVAILABLE) sin garantías de ningún tipo, expresas o implícitas, incluyendo pero no limitándose a garantías de comerciabilidad, idoneidad para un propósito particular y no violación de derechos de terceros.
                </p>
                <p>
                  <strong>9. LIMITACIÓN DE RESPONSABILIDAD:</strong> En la medida máxima permitida por la ley española aplicable, la responsabilidad total del propietario del sitio web por cualquier reclamo que surja en relación con el uso del Servicio está limitada al monto realmente pagado por el usuario por el uso del Servicio (que es de 0 €, ya que el Servicio es gratuito).
                </p>
                <p>
                  <strong>10. SIN LICENCIA:</strong> El propietario del sitio web no tiene licencia para proporcionar servicios legales, fiscales o contables en España ni en ningún otro país. El Servicio es únicamente una herramienta técnica para automatizar el llenado de documentos.
                </p>
                <p className="text-center mt-3 font-semibold">
                  AL USAR ESTE SERVICIO, USTED CONFIRMA QUE HA LEÍDO, COMPRENDIDO Y ACEPTADO COMPLETAMENTE TODOS LOS TÉRMINOS DE ESTE DESCARGO DE RESPONSABILIDAD. SI NO ESTÁ DE ACUERDO CON ALGUNA PARTE, DEJE DE USAR EL SERVICIO INMEDIATAMENTE.
                </p>
              </>
            )}

            {language === "pt" && (
              <>
                <p className="font-semibold text-center mb-2">AVISO LEGAL E LIMITAÇÃO DE RESPONSABILIDADE</p>
                <p>
                  <strong>1. DISPOSIÇÕES GERAIS:</strong> As informações, ferramentas, calculadoras e materiais disponíveis no site monegoo.com (o "Serviço") são fornecidos exclusivamente para fins informativos e educacionais e não constituem aconselhamento profissional jurídico, fiscal, financeiro ou contábil. O uso do Serviço não cria uma relação consultor-cliente entre o usuário e o proprietário do site.
                </p>
                <p>
                  <strong>2. NÃO É ACONSELHAMENTO PROFISSIONAL:</strong> O Serviço NÃO SUBSTITUI a consulta qualificada com um consultor fiscal, advogado, contador ou outro profissional licenciado. As leis fiscais de Portugal e outros países são complexas, mudam constantemente e têm características de aplicação individuais. Recomendamos enfaticamente consultar um especialista qualificado antes de apresentar documentos fiscais à Autoridade Tributária e Aduaneira ou outras autoridades fiscais.
                </p>
                <p>
                  <strong>3. SEM GARANTIA DE PRECISÃO:</strong> O proprietário do site não garante a precisão, integridade, atualidade ou correção de quaisquer informações, cálculos ou documentos gerados pelo Serviço. As informações podem conter imprecisões técnicas, erros tipográficos ou estar desatualizadas. Os cálculos são realizados automaticamente com base nos dados inseridos pelo usuário e podem conter erros de algoritmo.
                </p>
                <p>
                  <strong>4. ISENÇÃO COMPLETA DE RESPONSABILIDADE:</strong> O proprietário, desenvolvedor, operador e todas as partes relacionadas do site monegoo.com NÃO SERÃO RESPONSÁVEIS (incluindo, mas não se limitando a) por: (a) quaisquer danos diretos, indiretos, incidentais, punitivos, especiais ou consequenciais; (b) perda de lucro, receita, dados ou economias; (c) multas, penalidades, sanções ou avaliações fiscais adicionais das autoridades fiscais; (d) erros em cálculos ou documentos; (e) quaisquer ações ou omissões do usuário relacionadas ao uso do Serviço; (f) impossibilidade de usar o Serviço ou interrupções em seu funcionamento.
                </p>
                <p>
                  <strong>5. RESPONSABILIDADE DO USUÁRIO:</strong> O usuário assume total responsabilidade pessoal por: (a) a veracidade e precisão de todos os dados inseridos; (b) a correção do preenchimento de formulários fiscais; (c) a verificação de todos os cálculos e documentos gerados antes da apresentação; (d) a conformidade dos documentos apresentados com as leis aplicáveis de Portugal e/ou do país de residência fiscal; (e) o pagamento oportuno de todas as obrigações fiscais. O USUÁRIO USA O SERVIÇO POR SUA PRÓPRIA CONTA E RISCO.
                </p>
                <p>
                  <strong>6. SEM ARMAZENAMENTO DE DADOS:</strong> Todos os cálculos são realizados localmente no navegador do usuário. O proprietário do site não armazena, processa ou transmite dados pessoais ou fiscais dos usuários para seus servidores. O usuário é responsável pelo armazenamento e proteção dos documentos gerados.
                </p>
                <p>
                  <strong>7. MUDANÇAS LEGISLATIVAS:</strong> A legislação fiscal em Portugal e outros países está em constante mudança. As informações no site podem não estar em conformidade com os requisitos legislativos atuais. O usuário é obrigado a verificar independentemente a atualidade das informações nos recursos oficiais das autoridades fiscais.
                </p>
                <p>
                  <strong>8. FORNECIDO "COMO ESTÁ":</strong> O Serviço é fornecido "COMO ESTÁ" (AS IS) e "CONFORME DISPONÍVEL" (AS AVAILABLE) sem quaisquer garantias, expressas ou implícitas, incluindo, mas não se limitando a, garantias de comercialização, adequação a um propósito específico e não violação de direitos de terceiros.
                </p>
                <p>
                  <strong>9. LIMITAÇÃO DE RESPONSABILIDADE:</strong> Na medida máxima permitida pela lei portuguesa aplicável, a responsabilidade total do proprietário do site por quaisquer reivindicações decorrentes do uso do Serviço é limitada ao valor efetivamente pago pelo usuário pelo uso do Serviço (que é de 0 €, pois o Serviço é gratuito).
                </p>
                <p>
                  <strong>10. SEM LICENÇA:</strong> O proprietário do site não possui licença para fornecer serviços jurídicos, fiscais ou contábeis em Portugal ou em qualquer outro país. O Serviço é exclusivamente uma ferramenta técnica para automatizar o preenchimento de documentos.
                </p>
                <p className="text-center mt-3 font-semibold">
                  AO USAR ESTE SERVIÇO, VOCÊ CONFIRMA QUE LEU, COMPREENDEU E CONCORDOU COMPLETAMENTE COM TODOS OS TERMOS DESTE AVISO. SE VOCÊ NÃO CONCORDAR COM QUALQUER PARTE, PARE DE USAR O SERVIÇO IMEDIATAMENTE.
                </p>
              </>
            )}

            {!["uk", "pl", "en", "fr", "de", "es", "pt"].includes(language) && (
              <>
                <p className="font-semibold text-center mb-2">LEGAL DISCLAIMER AND LIMITATION OF LIABILITY</p>
                <p>
                  <strong>1. GENERAL PROVISIONS:</strong> The information, tools, calculators, and materials available on the monegoo.com website (the "Service") are provided solely for informational and educational purposes and do not constitute professional legal, tax, financial, or accounting advice. Use of the Service does not create an advisor-client relationship between the user and the website owner.
                </p>
                <p>
                  <strong>2-10. [Full disclaimer text in English as default]</strong> Please refer to the English version for complete terms.
                </p>
                <p className="text-center mt-3 font-semibold">
                  BY USING THIS SERVICE, YOU CONFIRM THAT YOU HAVE FULLY READ, UNDERSTOOD, AND AGREED TO ALL TERMS OF THIS DISCLAIMER.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
