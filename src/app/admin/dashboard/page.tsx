"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Agendamento {
  id: string
  dataHora: string
  status: string
  cliente: { nome: string; whatsapp: string }
  barbeiro: { nome: string }
  servico: { nome: string; preco: number }
}

const STATUS_COR: Record<string, string> = {
  CONFIRMADO: "#22c55e",
  PENDENTE: "#c9972e",
  CANCELADO: "#e05555",
  EXPIRADO: "#444",
}

export default function Dashboard() {
  const router = useRouter()
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState("TODOS")

  useEffect(() => {
    fetch("/api/agendamentos")
      .then((r) => r.json())
      .then((data) => { setAgendamentos(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  const hoje = new Date().toLocaleDateString("pt-BR")

  const filtrados = agendamentos.filter((a) => {
    const dataAg = new Date(a.dataHora).toLocaleDateString("pt-BR")
    const ehHoje = dataAg === hoje
    if (filtro === "TODOS") return ehHoje
    return ehHoje && a.status === filtro
  })

  const contadores = {
    CONFIRMADO: agendamentos.filter((a) => new Date(a.dataHora).toLocaleDateString("pt-BR") === hoje && a.status === "CONFIRMADO").length,
    PENDENTE: agendamentos.filter((a) => new Date(a.dataHora).toLocaleDateString("pt-BR") === hoje && a.status === "PENDENTE").length,
    CANCELADO: agendamentos.filter((a) => new Date(a.dataHora).toLocaleDateString("pt-BR") === hoje && a.status === "CANCELADO").length,
    EXPIRADO: agendamentos.filter((a) => new Date(a.dataHora).toLocaleDateString("pt-BR") === hoje && a.status === "EXPIRADO").length,
  }

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif", background: "#070707", color: "#f0ede6", minHeight: "100vh" }}>

      <nav style={{ padding: "16px 32px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "18px", letterSpacing: "2px" }}>NAVALHAeARTE</div>
        <div style={{ display: "flex", gap: "24px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888" }}>
          <span style={{ color: "#c9972e", cursor: "default" }}>Dashboard</span>
          <span style={{ cursor: "pointer" }} onClick={() => router.push("/admin/barbeiros")}>Barbeiros</span>
          <span style={{ cursor: "pointer" }} onClick={() => router.push("/admin/servicos")}>Servicos</span>
          <span style={{ cursor: "pointer", color: "#e05555" }} onClick={handleLogout}>Sair</span>
        </div>
      </nav>

      <div style={{ padding: "32px" }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#555", marginBottom: "4px" }}>Hoje — {hoje}</div>
          <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "28px", color: "#fff", margin: 0 }}>Agendamentos do dia</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {Object.entries(contadores).map(([status, count]) => (
            <div key={status} onClick={() => setFiltro(filtro === status ? "TODOS" : status)} style={{ background: "#0d0d0d", border: filtro === status ? "1px solid " + STATUS_COR[status] : "1px solid #1a1a1a", borderRadius: "8px", padding: "20px", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontSize: "28px", fontWeight: "600", color: STATUS_COR[status], marginBottom: "4px" }}>{count}</div>
              <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#555" }}>{status}</div>
            </div>
          ))}
        </div>

        {loading && <p style={{ color: "#555" }}>Carregando...</p>}

        {!loading && filtrados.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px", color: "#444", fontSize: "13px" }}>
            Nenhum agendamento encontrado para hoje.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtrados.map((ag) => (
            <div key={ag.id} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "20px", display: "grid", gridTemplateColumns: "120px 1fr 1fr 1fr 120px", alignItems: "center", gap: "16px" }}>
              <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "22px", color: "#c9972e" }}>
                {new Date(ag.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div>
                <div style={{ fontSize: "13px", color: "#f0ede6", marginBottom: "2px" }}>{ag.cliente.nome}</div>
                <div style={{ fontSize: "11px", color: "#555" }}>{ag.cliente.whatsapp}</div>
              </div>
              <div>
                <div style={{ fontSize: "13px", color: "#f0ede6", marginBottom: "2px" }}>{ag.servico.nome}</div>
                <div style={{ fontSize: "11px", color: "#555" }}>R$ {ag.servico.preco.toFixed(2).replace(".", ",")}</div>
              </div>
              <div style={{ fontSize: "13px", color: "#888" }}>{ag.barbeiro.nome}</div>
              <div style={{ fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", color: STATUS_COR[ag.status], fontWeight: "600" }}>
                {ag.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}