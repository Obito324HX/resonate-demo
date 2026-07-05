export default function Footer() {
  return (
    <footer className="border-t border-black/10 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-muted flex flex-col md:flex-row md:justify-between gap-2 text-center md:text-left">
        <p>© {new Date().getFullYear()} Resonate Audio. Demo store — no real purchases.</p>
        <p>Built by Cletus Bwalya</p>
      </div>
    </footer>
  );
}
