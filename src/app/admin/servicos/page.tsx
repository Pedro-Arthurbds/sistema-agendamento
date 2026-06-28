"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Servico {
  id: string
  nome: string
  preco: number
  duracaoMin: number
  ativo: boolean
}

export default function Servicos() {
  const router = useRouter()
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ nome: "", preco: "", duracaoMin: "" })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")

  function carregar() {
    fetch("/api/servicos")
      .then((r) => r.json())
      .then((data) => { setServicos(data); setLoading(false) })
  }

  useEffect(() => { carregar() }, [])

  async function adicionar() {
    if (!form.nome || !form.preco || !form.duracaoMin) { setErro("Preencha todos os campos"); return }
    setSalvando(true)
    setErro("")
    const res = await fetch("/api/admin/servicos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: form.nome, preco: parseFloat(form.preco), duracaoMin: parseInt(form.duracaoMin) }),
    })
    if (res.ok) { setForm({ nome: "", preco: "", duracaoMin: "" }); carregar() }
    else { const d = await res.json(); setErro(d.error || "Erro") }
    setSalvando(false)
  }

  async function alternarAtivo(id: string, ativo: boolean) {
    await fetch("/api/admin/servicos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ativo: !ativo }),
    })
    carregar()
  }

  const inputStyle = { background: "#050505", border: "1px solid #1a1a1a", borderRadius: "4px", color: "#fff" as const, padding: "12px", fontSize: "13px", outline: "none", width: "100%", boxSizing: "border-box" as const }

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif", background: "#070707", color: "#f0ede6", minHeight: "100vh" }}>
      <nav style={{ padding: "16px 32px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "18px", letterSpacing: "2px" }}>NAVALHAeARTE</div>
        <div style={{ display: "flex", gap: "24px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888" }}>
          <span style={{ cursor: "pointer" }} onClick={() => router.push("/admin/dashboard")}>Dashboard</span>
          <span style={{ cursor: "pointer" }} onClick={() => router.push("/admin/barbeiros")}>Barbeiros</span>
          <span style={{ color: "#c9972e", cursor: "default" }}>Servicos</span>
        </div>
      </nav>
      <div style={{ padding: "32px", maxWidth: "700px" }}>
        <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "28px", color: "#fff", marginBottom: "32px" }}>Servicos</h1>
        <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "24px", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "13px", color: "#888", marginBottom: "16px", fontWeight: "400" }}>Adicionar servico</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", color: "#555", marginBottom: "6px", display: "block" }}>Nome</label>
              <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Corte Classico" style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#c9972e"} onBlur={(e) => e.target.style.borderColor = "#1a1a1a"} />
            </div>
            <div>
              <label style={{ fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", color: "#555", marginBottom: "6px", display: "block" }}>Preco R$</label>
              <input type="number" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} placeholder="50" style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#c9972e"} onBlur={(e) => e.target.style.borderColor = "#1a1a1a"} />
            </div>
            <div>
              <label style={{ fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", color: "#555", marginBottom: "6px", display: "block" }}>Duracao min</label>
              <input type="number" value={form.duracaoMin} onChange={(e) => setForm({ ...form, duracaoMin: e.target.value })} placeholder="30" style={inputStyle} onFocus={(e) => e.target.style.borderColor = "#c9972e"} onBlur={(e) => e.target.style.borderColor = "#1a1a1a"} />
            </div>
          </div>
          {erro && <p style={{ color: "#e05555", fontSize: "12px", marginBottom: "12px" }}>{erro}</p>}
          <button onClick={adicionar} disabled={salvando} style={{ background: "#c9972e", color: "#111", border: "none", borderRadius: "4px", padding: "12px 24px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "600", cursor: "pointer" }}>
            {salvando ? "..." : "Adicionar"}
          </button>
        </div>
        {loading && <p style={{ color: "#555" }}>Carregando...</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {servicos.map((s) => (
            <div key={s.id} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", color: s.ativo ? "#f0ede6" : "#444" }}>{s.nome}</div>
                <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>R$ {s.preco.toFixed(2).replace(".", ",")} · {s.duracaoMin} min</div>
              </div>
              <button onClick={() => alternarAtivo(s.id, s.ativo)} style={{ background: s.ativo ? "#1a1a1a" : "#c9972e", color: s.ativo ? "#e05555" : "#111", border: "1px solid " + (s.ativo ? "#e05555" : "#c9972e"), borderRadius: "4px", padding: "8px 16px", fontSize: "11px", cursor: "pointer" }}>
                {s.ativo ? "Desativar" : "Ativar"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}