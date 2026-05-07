import { TireReportForm } from "@/components/TireReportForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="4" fill="white" />
                <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              Moto<span className="text-primary">controler</span>
            </span>
          </div>
          <div className="h-6 w-px bg-gray-600" />
          <span className="text-sm text-gray-300">System raportowania opon</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Formularz raportu opon</h1>
          <p className="text-muted-foreground mt-1">
            Wypełnij dane pojazdu oraz szczegóły każdej z czterech opon, a następnie wyślij raport.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <TireReportForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-400 text-xs text-center py-4 mt-auto">
        &copy; {new Date().getFullYear()} Motocontroler &mdash; System raportowania opon
      </footer>
    </div>
  );
}
