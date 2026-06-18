import Header from "@/components/Header";
import ParcelForm from "@/components/ParcelForm";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-2" />
            TKGM Kadastro Verisi
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Parselinizi havadan tanıtın
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Parsel bilgilerini girin; uydu görüntülü 3D drone tanıtım videosunu
            tarayıcınızda saniyeler içinde oluşturun.
          </p>
        </div>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
          <h2 className="mb-5 text-lg font-semibold">Parsel Sorgulama</h2>
          <ParcelForm />
        </section>

        <p className="mt-6 text-center text-xs text-muted">
          Sanal Drone v2 · Faz 1 · Veriler T.C. Tapu ve Kadastro Genel
          Müdürlüğü&apos;ne aittir.
        </p>
      </main>
    </>
  );
}
