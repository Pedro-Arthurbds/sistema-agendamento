interface CardServicoProps {
  numero: string
  title: string
  price: string
  description: string
  className?: string
}

const CardServico = ({ numero, title, price, description, className = "" }: CardServicoProps) => {
  return (
    <div
      className={`group p-7 flex flex-col gap-3 hover:bg-[#1a1a1a] transition-colors duration-300 cursor-default ${className}`}
      style={{ borderColor: "var(--border)" }}
    >
      <span className="text-[10px] tracking-[2px] uppercase" style={{ color: "var(--text-dim)" }}>
        {numero}
      </span>
      <h3 className="font-(--font-playfair) text-lg text-[#f0ede6] group-hover:text-[#e0b84a] transition-colors">
        {title}
      </h3>
      <p className="text-2xl font-light" style={{ color: "var(--gold)" }}>
        R$ {price}
      </p>
      <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
    </div>
  )
}

export default CardServico