"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function Pendente() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [segundos, setSegundos] = useState(15 * 60)

  useEffect(() => {
    if (segundos <= 0) return
    const timer = setInterval(() => setSegundos((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [segundos])

  const min = Math.floor(segundos / 60).toString().padStart(2, "0")
  const seg = (segundos % 60).toString().padStart(2, "0")
  const expirado = segundos <= 0

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif", background: "#070707", color: "#f0ede6", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "20px", letterSpacing: "3px", color: "#f0ede6", marginBottom: "48px" }}>
          NAVALHA<span style={{ color: "#c9972e" }}>e</span>ARTE
        </div>

        {expirado ? (
          <div>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>Tempo esgotado</div>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "28px", color: "#fff", marginBottom: "12px" }}>Reserva expirada</h1>
            <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.8", marginBottom: "32px" }}>O tempo de confirmacao expirou e o horario foi liberado. Faca um novo agendamento.</p>
            <Link href="/#agendar" style={{ display: "inline-block", background: "#c9972e", color: "#111", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", padding: "14px 28px", fontWeight: "600", borderRadius: "4px", textDecoration: "none" }}>
              Novo agendamento
            </Link>
          </div>
        ) : (
          <div>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid #c9972e", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "24px" }}>
              ⏳
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "28px", color: "#fff", margin: "0 0 12px" }}>Quase la!</h1>
            <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.8", maxWidth: "340px", margin: "0 auto 32px" }}>
              Seu horario esta reservado. Confirme pelo link enviado no WhatsApp antes do tempo acabar.
            </p>
            <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "24px", marginBottom: "32px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#555", marginBottom: "8px" }}>Expira em</div>
              <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "48px", color: segundos <= 60 ? "#e05555" : "#c9972e", letterSpacing: "4px" }}>
                {min}:{seg}
              </div>
            </div>
            <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "16px", marginBottom: "24px", fontSize: "12px", color: "#666", lineHeight: "1.7", textAlign: "left" }}>
              <strong style={{ color: "#aaa", display: "block", marginBottom: "6px" }}>O que acontece agora?</strong>
              1. Abra o WhatsApp e procure a mensagem da Navalha e Arte<br />
              2. Clique no link de confirmacao<br />
              3. Seu horario sera confirmado automaticamente
            </div>
            {token && (
              <a href={"https://wa.me/"} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#1a1a1a", color: "#c9972e", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", padding: "14px", borderRadius: "4px", textDecoration: "none", marginBottom: "16px", border: "1px solid #2a2a2a" }}>
                Reabrir WhatsApp
              </a>
            )}
            <Link href="/" style={{ fontSize: "12px", color: "#555", textDecoration: "none" }}>
              Voltar ao inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}