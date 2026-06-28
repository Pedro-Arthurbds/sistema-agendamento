"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

interface Agendamento {
  id: string
  dataHora: string
  status: string
  cliente: { nome: string; whatsapp: string }
  barbeiro: { nome: string }
  servico: { nome: string; preco: number }
}

export default function Confirmar() {
  const params = useParams()
  const token = params.token as string
  const [status, setStatus] = useState<"loading" | "confirmado" | "ja_confirmado" | "expirado" | "erro">("loading")
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null)

  useEffect(() => {
    if (!token) return
    fetch(`/api/confirmar/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.agendamento) {
          setAgendamento(data.agendamento)
          if (data.message === "Agendamento ja confirmado") setStatus("ja_confirmado")
          else setStatus("confirmado")
        } else {
          setStatus("expirado")
        }
      })
      .catch(() => setStatus("erro"))
  }, [token])

  const dataFormatada = agendamento
    ? new Date(agendamento.dataHora).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })
    : ""
  const horaFormatada = agendamento
    ? new Date(agendamento.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : ""

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif", background: "#070707", color: "#f0ede6", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "20px", letterSpacing: "3px", color: "#f0ede6", marginBottom: "48px" }}>
          NAVALHA<span style={{ color: "#c9972e" }}>e</span>ARTE
        </div>

        {status === "loading" && (
          <p style={{ color: "#555", fontSize: "13px" }}>Confirmando seu agendamento...</p>
        )}

        {(status === "confirmado" || status === "ja_confirmado") && agendamento && (
          <div>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(201,151,46,0.1)", border: "2px solid #c9972e", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "28px" }}>
              ✓
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "28px", color: "#fff", margin: "0 0 8px" }}>
              {status === "ja_confirmado" ? "Ja confirmado!" : "Agendamento confirmado!"}
            </h1>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "32px" }}>
              {status === "ja_confirmado" ? "Seu horario ja estava confirmado." : "Te esperamos na data abaixo!"}
            </p>
            <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "28px", marginBottom: "32px", textAlign: "left" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#555", marginBottom: "4px" }}>Cliente</div>
                  <div style={{ fontSize: "14px", color: "#f0ede6" }}>{agendamento.cliente.nome}</div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#555", marginBottom: "4px" }}>Servico</div>
                  <div style={{ fontSize: "14px", color: "#f0ede6" }}>{agendamento.servico.nome}</div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#555", marginBottom: "4px" }}>Barbeiro</div>
                  <div style={{ fontSize: "14px", color: "#f0ede6" }}>{agendamento.barbeiro.nome}</div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#555", marginBottom: "4px" }}>Data e Hora</div>
                  <div style={{ fontSize: "14px", color: "#c9972e", fontWeight: "500" }}>{dataFormatada} as {horaFormatada}</div>
                </div>
              </div>
            </div>
            <Link href="/" style={{ fontSize: "12px", color: "#555", textDecoration: "none" }}>Voltar ao inicio</Link>
          </div>
        )}

        {status === "expirado" && (
          <div>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏰</div>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "28px", color: "#fff", marginBottom: "12px" }}>Link expirado</h1>
            <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.8", marginBottom: "32px" }}>
              Este link de confirmacao expirou ou o agendamento foi cancelado. Faca um novo agendamento.
            </p>
            <Link href="/#agendar" style={{ display: "inline-block", background: "#c9972e", color: "#111", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", padding: "14px 28px", fontWeight: "600", borderRadius: "4px", textDecoration: "none" }}>
              Novo agendamento
            </Link>
          </div>
        )}

        {status === "erro" && (
          <div>
            <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "28px", color: "#fff", marginBottom: "12px" }}>Algo deu errado</h1>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "32px" }}>Tente novamente ou entre em contato.</p>
            <Link href="/" style={{ fontSize: "12px", color: "#555", textDecoration: "none" }}>Voltar ao inicio</Link>
          </div>
        )}

      </div>
    </div>
  )
}