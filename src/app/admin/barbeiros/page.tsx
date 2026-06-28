"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Barbeiro {
  id: string
  nome: string
  ativo: boolean
}

export default function Barbeiros() {
  const router = useRouter()
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState("")
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")

  function carregar() {
    fetch("/api/barbeiros")
      .then((r) => r.json())
      .then((data) => { setBarbeiros(data); setLoading(false) })
  }

  useEffect(() => { carregar() }, [])

  async function adicionar() {
    if (!nome.trim()) { setErro("Nome obrigatorio"); return }
    setSalvando(true)
    setErro("")
    const res = await fetch("/api/admin/barbeiros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    })
    if (res.ok) { setNome(""); carregar() }
    else { const d = await res.json(); setErro(d.error || "Erro") }
    setSalvando(false)
  }

  async function alternarAtivo(id: string, ativo: boolean) {
    await fetch("/api/admin/barbeiros", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ativo: !ativo }),
    })
    carregar()
  }

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif", background: "#070707", color: "#f0ede6", minHeight: "100vh" }}>
      <nav style={{ padding: "16px 32px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "18px", letterSpacing: "2px" }}>NAVALHAeARTE</div>
        <div style={{ display: "flex", gap: "24px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888" }}>
          <span style={{ cursor: "pointer" }} onClick={() => router.push("/admin/dashboard")}>Dashboard</span>
          <span style={{ color: "#c9972e", cursor: "default" }}>Barbeiros</span>
          <span style={{ cursor: "pointer" }} onClick={() => router.push("/admin/servicos")}>Servicos</span>
        </div>
      </nav>
      <div style={{ padding: "32px", maxWidth: "700px" }}>
        <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "28px", color: "#fff", marginBottom: "32px" }}>Barbeiros</h1>
        <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "24px", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "13px", color: "#888", marginBottom: "16px", fontWeight: "400" }}>Adicionar barbeiro</h2>
          <div style={{ display: "flex", gap: "12px" }}>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} onKeyDown={(e) => e.key === "Enter" && adicionar()} placeholder="Nome do barbeiro" style={{ flex: 1, background: "#050505", border: "1px solid #1a1a1a", borderRadius: "4px", color: "#fff", padding: "12px", fontSize: "13px", outline: "none" }} onFocus={(e) => e.target.style.borderColor = "#c9972e"} onBlur={(e) => e.target.style.borderColor = "#1a1a1a"} />
            <button onClick={adicionar} disabled={salvando} style={{ background: "#c9972e", color: "#111", border: "none", borderRadius: "4px", padding: "12px 24px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "600", cursor: "pointer" }}>
              {salvando ? "..." : "Adicionar"}
            </button>
          </div>
          {erro && <p style={{ color: "#e05555", fontSize: "12px", marginTop: "8px" }}>{erro}</p>}
        </div>
        {loading && <p style={{ color: "#555" }}>Carregando...</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {barbeiros.map((b) => (
            <div key={b.id} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", color: b.ativo ? "#f0ede6" : "#444" }}>{b.nome}</div>
                <div style={{ fontSize: "11px", color: b.ativo ? "#22c55e" : "#555", marginTop: "2px" }}>{b.ativo ? "Ativo" : "Inativo"}</div>
              </div>
              <button onClick={() => alternarAtivo(b.id, b.ativo)} style={{ background: b.ativo ? "#1a1a1a" : "#c9972e", color: b.ativo ? "#e05555" : "#111", border: "1px solid " + (b.ativo ? "#e05555" : "#c9972e"), borderRadius: "4px", padding: "8px 16px", fontSize: "11px", cursor: "pointer" }}>
                {b.ativo ? "Desativar" : "Ativar"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}