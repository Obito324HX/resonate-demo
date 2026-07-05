export default function Footer() {
  return (
    <footer className="border-t border-black/10 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-muted flex justify-between">
        <p>© {new Date().getFullYear()} Resonate Audio. Demo store — no real purchases.</p>
        <p>Built with Next.js, Express &amp; PostgreSQL</p>
      </div>
    </footer>
  );
}
