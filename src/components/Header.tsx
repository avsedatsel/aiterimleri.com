import ThemeToggle from "./ThemeToggle";
import InstallButton from "./InstallButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-2 text-white shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2.5" />
              <path d="M5 5l3.5 3.5M19 5l-3.5 3.5M5 19l3.5-3.5M19 19l-3.5-3.5" />
              <circle cx="4" cy="4" r="2" />
              <circle cx="20" cy="4" r="2" />
              <circle cx="4" cy="20" r="2" />
              <circle cx="20" cy="20" r="2" />
            </svg>
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">Sanal Drone</p>
            <p className="text-[11px] text-muted">Parsel Tanıtım Stüdyosu</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <InstallButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
