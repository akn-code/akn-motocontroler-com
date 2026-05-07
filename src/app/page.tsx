import { auth } from "@/lib/auth";
import { TireReportForm } from "@/components/TireReportForm";
import { ReportHistory } from "@/components/ReportHistory";
import { AppHeader } from "@/components/AppHeader";
import { PageShell } from "@/components/PageShell";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fa]">
      <AppHeader user={session?.user ?? null} />
      <PageShell>
        <TireReportForm />
      </PageShell>
    </div>
  );
}
