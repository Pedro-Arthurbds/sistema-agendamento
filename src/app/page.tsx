"use client"
import { useState } from "react"
import Image from "next/image"
import BarraSuperior from "./widgets/BarraSuperior"
import Agendamento from "./components/Agendamento"

export default function Home() {
  const [cardHover, setCardHover] = useState<number | null>(null)
  const [btnHeroHover, setBtnHeroHover] = useState(false)


  // Dados dos serviços premium adaptados
  const servicos = [
    { numero: "01", title: "Corte Clássico", price: "R$ 50", desc: "Elegância atemporal com lavagem e finalização personalizada." },
    { numero: "02", title: "Barba Completa", price: "R$ 40", desc: "Aparo e modelagem com ritual de toalha quente e óleos essenciais." },
    { numero: "03", title: "Combo Corte + Barba", price: "R$ 80", desc: "A experiência completa de cuidados com nossa assinatura tradicional." },
    { numero: "04", title: "Corte Moderno", price: "R$ 60", desc: "Estilos contemporâneos projetados sob medida pelo visagismo." }
  ]

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif", background: "#070707", color: "#f0ede6", minHeight: "100vh" }}>
      
      <BarraSuperior />

      {/* HERO SECTION - Imersiva e com Alto Contraste */}
      <section id="inicio" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", minHeight: "calc(100vh - 80px)", borderBottom: "1px solid #161616" }}>
        <div style={{ padding: "64px 48px", display: "flex", flexDirection: "column", justifyContent: "center", background: "linear-gradient(135deg, #0d0d0d 0%, #070707 100%)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "#c9972e", marginBottom: "24px" }}>
            <span style={{ width: "20px", height: "1px", background: "#c9972e" }} />
            Barbearia Premium · Desde 2015
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "52px", lineHeight: "1.1", color: "#ffffff", margin: "0 0 24px", fontWeight: "700" }}>
            Muito mais que um corte.<br />Seu momento de <br /><em style={{ fontStyle: "italic", color: "#c9972e", fontWeight: "400" }}>fazer história.</em>
          </h1>
          <p style={{ fontSize: "14px", color: "#999", lineHeight: "1.8", maxWidth: "420px", marginBottom: "40px" }}>
            Ambiente reservado e atendimento rigorosamente pontual. Um refúgio de estilo com cafés especiais e os melhores mestres visagistas da região.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <a 
              href="#agendar"
              onMouseEnter={() => setBtnHeroHover(true)}
              onMouseLeave={() => setBtnHeroHover(false)}
              style={{ 
                display: "inline-block", background: "#c9972e", color: "#111", fontSize: "12px", 
                letterSpacing: "2px", textTransform: "uppercase", padding: "16px 36px", fontWeight: "600", 
                width: "fit-content", cursor: "pointer", transition: "all 0.3s ease", borderRadius: "4px",
                textDecoration: "none", textAlign: "center",
                transform: btnHeroHover ? "translateY(-2px)" : "none",
                boxShadow: btnHeroHover ? "0 8px 24px rgba(201, 151, 46, 0.25)" : "none"
              }}
            >
              Agendar Experiência
            </a>
            
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#555", letterSpacing: "1px" }}>
              <span style={{ color: "#c9972e" }}>●</span> Seg–Sáb, 09h às 20h — Sem filas, sem pressa.
            </div>
          </div>
        </div>
        
        {/* HERO IMAGE CONTAINER (Estilo Dinastia) */}
        <div style={{ background: "#111", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <Image src="/hero.jpg" fill priority sizes="50vw" alt="Barbearia Premium" style={{ objectFit: "cover", opacity: 0.5 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #070707 0%, transparent 30%, transparent 80%, #070707 100%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "32px", right: "32px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.05)", padding: "12px 18px", borderRadius: "4px", fontSize: "11px", letterSpacing: "2px", color: "#aaa", textTransform: "uppercase" }}>
            Itarana, ES
          </div>
        </div>
      </section>

      {/* DIVIDER/LABEL SERVIÇOS */}
      <div style={{ padding: "18px 48px", background: "#0a0a0a", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#666", borderBottom: "1px solid #161616", display: "flex", justifyContent: "space-between" }}>
        <span>Cardápio de Serviços</span>
        <span>04 Opções Selecionadas</span>
      </div>

      {/* CARDS DE SERVIÇOS - Tridimensionais com Elevação e Sombra (Luxury Clean) */}
      <section id="servicos" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", padding: "40px 48px", background: "#070707", borderBottom: "1px solid #161616" }}>
        {servicos.map((servico, index) => (
          <div 
            key={servico.numero}
            onMouseEnter={() => setCardHover(index)}
            onMouseLeave={() => setCardHover(null)}
            style={{ 
              padding: "36px 28px", 
              background: "#0d0d0d",
              borderRadius: "6px",
              border: cardHover === index ? "1px solid #c9972e" : "1px solid #161616",
              cursor: "default",
              transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
              transform: cardHover === index ? "translateY(-6px)" : "none",
              boxShadow: cardHover === index ? "0 12px 30px rgba(0,0,0,0.7)" : "none"
            }}
          >
            <div style={{ fontSize: "11px", color: "#c9972e", fontWeight: "600", letterSpacing: "2px", marginBottom: "20px" }}>{servico.numero}</div>
            <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "19px", color: "#fff", marginBottom: "10px", margin: "0 0 10px 0", fontWeight: "600" }}>{servico.title}</h3>
            <div style={{ fontSize: "24px", color: "#c9972e", fontWeight: "600", marginBottom: "16px", fontFamily: "var(--font-playfair)" }}>{servico.price}</div>
            <p style={{ fontSize: "12px", color: "#777", lineHeight: "1.7", margin: 0 }}>{servico.desc}</p>
          </div>
        ))}
      </section>

      {/* DIVIDER/LABEL AGENDAMENTO */}
      <div style={{ padding: "18px 48px", background: "#0a0a0a", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#666", borderBottom: "1px solid #161616", display: "flex", justifyContent: "space-between" }}>
        <span>Agendamento Online</span>
        <span>Conveniência em poucos cliques</span>
      </div>

      {/* AGENDAMENTO - Layout Checkout de Alto Padrão */}
      <section id="agendar" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#070707" }}>
        <div style={{ padding: "64px 48px", borderRight: "1px solid #161616", display: "flex", flexDirection: "column", justifyContent: "center", background: "linear-gradient(to bottom, #0a0a0a, #070707)" }}>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "36px", margin: "0 0 16px", color: "#ffffff", lineHeight: "1.2", fontWeight: "600" }}>
            Garanta a sua<br/>conveniência online
          </h2>
          <p style={{ fontSize: "14px", color: "#888", lineHeight: "1.8", maxWidth: "340px", margin: "0 0 40px 0" }}>
            Sem filas de espera. Escolha o especialista, monte o combo ideal e defina seu horário de forma simples, rápida e exclusiva.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", fontSize: "13px", color: "#aaa" }}>
              <span style={{ color: "#c9972e" }}>📍</span>
              <div>
                <strong style={{ color: "#fff", display: "block", marginBottom: "2px" }}>Endereço Principal</strong>
                Av. Principal, 750 — Centro Executivo, Itarana - ES
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", fontSize: "13px", color: "#aaa" }}>
              <span style={{ color: "#c9972e" }}>📞</span>
              <div>
                <strong style={{ color: "#fff", display: "block", marginBottom: "2px" }}>Central WhatsApp</strong>
                (27) 99999-8888
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ padding: "64px 48px", background: "#0c0c0c", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* STEPPER MODERNO ENVELOPADO */}

        <div style={{ padding: "64px 48px", background: "#0c0c0c", display: "flex", flexDirection: "column" }}>
          <Agendamento />
        </div>

        </div>
      </section>

      {/* FOOTER INSTITUCIONAL */}
      <footer style={{ padding: "32px 48px", background: "#050505", borderTop: "1px solid #161616", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", letterSpacing: "1px", color: "#555" }}>
        <span>© 2026 <span style={{ color: "#c9972e", fontWeight: "500" }}>Navalha & Arte</span>. Todos os direitos reservados.</span>
        <div style={{ display: "flex", gap: "24px", textTransform: "uppercase", fontSize: "10px", letterSpacing: "2px" }}>
          <span>Privacidade</span>
          <span>Termos</span>
        </div>
      </footer>

    </div>
  )
}