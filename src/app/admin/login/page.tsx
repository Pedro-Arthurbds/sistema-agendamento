"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !senha) { setErro("Preencha todos os campos"); return }
    setLoading(true)
    setErro("")
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      })
      const data = await res.json()
      if (!res.ok) { setErro(data.error || "Erro ao fazer login"); return }
      router.push("/admin/dashboard")
    } catch {
      setErro("Erro de conexao")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif", background: "#070707", color: "#f0ede6", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "20px", letterSpacing: "3px", color: "#f0ede6", marginBottom: "8px", textAlign: "center" }}>
          NAVALHAeARTE
        </div>
        <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#555", textAlign: "center", marginBottom: "48px" }}>
          Painel Administrativo
        </div>
        <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "32px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888", marginBottom: "8px", display: "block" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@barbearia.com" style={{ width: "100%", background: "#050505", border: "1px solid #1a1a1a", borderRadius: "4px", color: "#fff", padding: "12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} onFocus={(e) => e.target.style.borderColor = "#c9972e"} onBlur={(e) => e.target.style.borderColor = "#1a1a1a"} />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888", marginBottom: "8px", display: "block" }}>Senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleLogin()} style={{ width: "100%", background: "#050505", border: "1px solid #1a1a1a", borderRadius: "4px", color: "#fff", padding: "12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} onFocus={(e) => e.target.style.borderColor = "#c9972e"} onBlur={(e) => e.target.style.borderColor = "#1a1a1a"} />
          </div>
          {erro && <p style={{ color: "#e05555", fontSize: "12px", marginBottom: "16px" }}>{erro}</p>}
          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", background: "#c9972e", color: "#111", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", padding: "14px", fontWeight: "600", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer", border: "none", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  )
}