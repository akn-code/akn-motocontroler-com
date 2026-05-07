export const locales = ["pl", "en"] as const;
export type Locale = (typeof locales)[number];

export const translations = {
  pl: {
    // Nav
    appName: "Motocontroler",
    appSub: "tire-report",
    systemName: "System raportowania opon",

    // Page
    pageTitle: "Formularz raportu opon",
    pageDesc: "Wypełnij dane pojazdu oraz szczegóły każdej z czterech opon, a następnie wyślij raport.",

    // Tabs
    vehicle: "Pojazd",

    // Vehicle section
    vehicleSection: "Dane pojazdu",
    vehicleBrand: "Marka pojazdu",
    vehicleModel: "Model pojazdu",
    vehicleYear: "Rocznik",
    vehicleYearPlaceholder: "Wybierz rok",
    vehicleBrandPlaceholder: "Wybierz markę",
    vin: "VIN",
    vinHint: "17 znaków, bez liter I, O, Q",
    email: "E-mail",
    optional: "opcjonalne",
    emailPlaceholder: "kontakt@przyklad.pl",

    // Tires
    tireFL: "Przód Lewy (FL)",
    tireFR: "Przód Prawy (FR)",
    tireRL: "Tył Lewy (RL)",
    tireRR: "Tył Prawy (RR)",
    tireBrand: "Marka opony",
    tireBrandPlaceholder: "Wybierz markę",
    tireSize: "Rozmiar opony",
    tireSizeWidth: "Szer.",
    tireSizeProfile: "Prof.",
    tireSizeRim: "Felga",
    treadDepth: "Głębokość bieżnika (mm)",
    treadDepthPlaceholder: "np. 5.5",
    treadLegal: "Poniżej prawnego minimum 1,6 mm — opona nie nadaje się do użytku",
    treadLow: "Poniżej zalecanego minimum 3 mm — zalecana wymiana",
    dot: "DOT",
    dotHint: "tydzień (01–52) + rok, np. 2123 = tydz. 21, rok 2023",
    dotPlaceholder: "np. 2123",
    rating: "Ocena (1–5)",
    ratingPlaceholder: "Wybierz ocenę",
    ratings: ["Bardzo zła", "Zła", "Dostateczna", "Dobra", "Bardzo dobra"],
    notes: "Uwagi",
    notesPlaceholder: "Dodatkowe obserwacje dotyczące opony...",

    // Buttons
    next: "Dalej →",
    nextTires: "Dalej: Opony →",
    back: "← Wstecz",
    submit: "Wyślij raport",
    submitting: "Wysyłanie...",
    addAnother: "Dodaj kolejny raport",

    // States
    successTitle: "Raport wysłany!",
    successDesc: "Dziękujemy. Raport opon został pomyślnie zapisany w systemie Motocontroler.",
    errorPrefix: "Błąd:",
    errorGeneric: "Wystąpił błąd podczas wysyłania raportu.",

    // History
    historyTitle: "Historia wysłanych raportów",
    historyClear: "Wyczyść",

    // Auth
    loginTitle: "Logowanie",
    loginDesc: "Zaloguj się, aby uzyskać dostęp do formularza.",
    loginEmail: "E-mail",
    loginPassword: "Hasło",
    loginButton: "Zaloguj się",
    loginLoading: "Logowanie...",
    loginError: "Nieprawidłowy e-mail lub hasło.",
    logout: "Wyloguj",
    loggedInAs: "Zalogowano jako",

    // Errors
    errRequired: "To pole jest wymagane",
    errVinLength: "VIN musi mieć dokładnie 17 znaków",
    errVinChars: "VIN zawiera niedozwolone znaki (I, O, Q są zabronione)",
    errEmail: "Nieprawidłowy format e-mail",
    errTireSize: "Format: 205/55 R16",
    errTreadDepth: "Podaj wartość w mm",
    errDot: "Format DOT: TTRR (tydzień 01-52 + rok, np. 2123)",
    errRating: "Wybierz ocenę 1-5",

    // Footer
    footer: "System raportowania opon",
  },
  en: {
    appName: "Motocontroler",
    appSub: "tire-report",
    systemName: "Tire reporting system",

    pageTitle: "Tire Inspection Report",
    pageDesc: "Fill in the vehicle details and the condition of each of the four tires, then submit the report.",

    vehicle: "Vehicle",

    vehicleSection: "Vehicle details",
    vehicleBrand: "Vehicle make",
    vehicleModel: "Vehicle model",
    vehicleYear: "Year",
    vehicleYearPlaceholder: "Select year",
    vehicleBrandPlaceholder: "Select make",
    vin: "VIN",
    vinHint: "17 characters, letters I, O, Q not allowed",
    email: "E-mail",
    optional: "optional",
    emailPlaceholder: "contact@example.com",

    tireFL: "Front Left (FL)",
    tireFR: "Front Right (FR)",
    tireRL: "Rear Left (RL)",
    tireRR: "Rear Right (RR)",
    tireBrand: "Tire brand",
    tireBrandPlaceholder: "Select brand",
    tireSize: "Tire size",
    tireSizeWidth: "Width",
    tireSizeProfile: "Profile",
    tireSizeRim: "Rim",
    treadDepth: "Tread depth (mm)",
    treadDepthPlaceholder: "e.g. 5.5",
    treadLegal: "Below legal minimum of 1.6 mm — tire is unsafe for use",
    treadLow: "Below recommended minimum of 3 mm — replacement advised",
    dot: "DOT",
    dotHint: "week (01–52) + year, e.g. 2123 = week 21, year 2023",
    dotPlaceholder: "e.g. 2123",
    rating: "Rating (1–5)",
    ratingPlaceholder: "Select rating",
    ratings: ["Very poor", "Poor", "Fair", "Good", "Excellent"],
    notes: "Notes",
    notesPlaceholder: "Additional observations about the tire...",

    next: "Next →",
    nextTires: "Next: Tires →",
    back: "← Back",
    submit: "Submit report",
    submitting: "Submitting...",
    addAnother: "Add another report",

    successTitle: "Report submitted!",
    successDesc: "Thank you. The tire report has been successfully saved in the Motocontroler system.",
    errorPrefix: "Error:",
    errorGeneric: "An error occurred while submitting the report.",

    historyTitle: "Submitted reports history",
    historyClear: "Clear",

    loginTitle: "Sign in",
    loginDesc: "Sign in to access the inspection form.",
    loginEmail: "E-mail",
    loginPassword: "Password",
    loginButton: "Sign in",
    loginLoading: "Signing in...",
    loginError: "Invalid email or password.",
    logout: "Sign out",
    loggedInAs: "Signed in as",

    errRequired: "This field is required",
    errVinLength: "VIN must be exactly 17 characters",
    errVinChars: "VIN contains invalid characters (I, O, Q are not allowed)",
    errEmail: "Invalid email format",
    errTireSize: "Format: 205/55 R16",
    errTreadDepth: "Enter a value in mm",
    errDot: "DOT format: WWYR (week 01-52 + year, e.g. 2123)",
    errRating: "Select a rating from 1 to 5",

    footer: "Tire reporting system",
  },
} satisfies Record<Locale, Record<string, string | string[]>>;

export type Translations = (typeof translations)["pl"];
export type TranslationKey = keyof Translations;
