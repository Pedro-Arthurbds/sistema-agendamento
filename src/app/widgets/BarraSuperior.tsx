import Link from "next/link"

const BarraSuperior = () => {
  return (
    <nav
      className="w-full flex items-center justify-between px-8 py-5 border-b fixed top-0 z-50 bg-[#111111]"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="text-lg tracking-[3px] text-[#f0ede6]" style={{ fontFamily: "var(--font-playfair)" }}>
        NAVALHA<span style={{ color: "var(--gold)" }}>&amp;</span>ARTE
      </div>

      <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[2px] uppercase" style={{ color: "var(--text-muted)" }}>
        <Link href="#inicio" className="hover:text-[#f0ede6] transition-colors">Início</Link>
        <Link href="#servicos" className="hover:text-[#f0ede6] transition-colors">Serviços</Link>
        <Link href="#agendar" className="hover:text-[#f0ede6] transition-colors">Barbeiros</Link>
        <Link href="#agendar" className="hover:text-[#f0ede6] transition-colors">Contato</Link>
        <Link
          href="#agendar"
          className="border px-5 py-2 transition-colors hover:bg-[#c9972e] hover:border-[#c9972e] hover:text-[#111]"
          style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
        >
          Agendar
        </Link>
      </div>
    </nav>
  )
}

export default BarraSuperior