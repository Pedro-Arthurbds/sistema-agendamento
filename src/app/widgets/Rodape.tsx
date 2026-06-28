const Rodape = () => {
  return (
    <footer
      className="w-full border-t px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4"
      style={{ borderColor: "var(--border)" }}
    >
      <p className="text-[10px] tracking-[2px] uppercase" style={{ color: "var(--text-dim)" }}>
        2025 <span style={{ color: "var(--gold)" }}>Navalha e Arte</span>
      </p>
      <div className="flex gap-6 text-[10px] tracking-[2px] uppercase" style={{ color: "var(--text-dim)" }}>
        <a href="#" className="hover:text-[#f0ede6] transition-colors">Privacidade</a>
        <a href="#" className="hover:text-[#f0ede6] transition-colors">Termos</a>
        <a href="#" className="hover:text-[#f0ede6] transition-colors">Contato</a>
      </div>
    </footer>
  )
}

export default Rodape