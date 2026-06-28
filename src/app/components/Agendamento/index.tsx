"use client"
import { useState, useEffect } from "react"

interface Barbeiro {
  id: string
  nome: string
  foto: string | null
}

interface Servico {
  id: string
  nome: string
  descricao: string | null
  preco: number
  duracaoMin: number
}

interface FormData {
  barbeiro: Barbeiro | null
  servico: Servico | null
  data: string
  hora: string
  nome: string
  whatsapp: string
}

export default function Agendamento() {
  const [etapa, setEtapa] = useState(0)
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [horarios, setHorarios] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  const [form, setForm] = useState<FormData>({
    barbeiro: null,
    servico: null,
    data: "",
    hora: "",
    nome: "",
    whatsapp: "",
  })

  const etapas = ["Barbeiro", "Servico", "Data", "Horario", "Dados"]

  // Busca barbeiros na etapa 0
  useEffect(() => {
    fetch("/api/barbeiros")
      .then((r) => r.json())
      .then(setBarbeiros)
  }, [])

  // Busca servicos na etapa 1
  useEffect(() => {
    if (etapa === 1) {
      fetch("/api/servicos")
        .then((r) => r.json())
        .then(setServicos)
    }
  }, [etapa])

  // Busca horarios quando barbeiro e data estao selecionados
  useEffect(() => {
    if (etapa === 3 && form.barbeiro && form.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true)
      fetch(`/api/agendamentos/horarios-disponiveis?barbeiroId=${form.barbeiro.id}&data=${form.data}`)
        .then((r) => r.json())
        .then((d) => setHorarios(d.horariosDisponiveis || []))
        .finally(() => setLoading(false))
    }
  }, [etapa, form.barbeiro, form.data])

  async function confirmarAgendamento() {
    if (!form.barbeiro || !form.servico || !form.data || !form.hora || !form.nome || !form.whatsapp) {
      setErro("Preencha todos os campos")
      return
    }

    setLoading(true)
    setErro("")

    try {
      const res = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          whatsapp: form.whatsapp,
          barbeiroId: form.barbeiro.id,
          servicoId: form.servico.id,
          data: form.data,
          hora: form.hora,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.error || "Erro ao criar agendamento")
        return
      }

      // Abre WhatsApp com link de confirmacao
      window.open(data.whatsappUrl, "_blank")

      // Redireciona para pagina de pendente
      window.location.href = `/pendente?token=${data.agendamento.tokenConfirmacao}`
    } catch {
      setErro("Erro de conexao. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const btnStyle = (ativo: boolean) => ({
    padding: "12px 16px",
    background: ativo ? "#c9972e" : "#0d0d0d",
    color: ativo ? "#111" : "#888",
    border: `1px solid ${ativo ? "#c9972e" : "#1a1a1a"}`,
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    textAlign: "left" as const,
    transition: "all 0.2s",
    width: "100%",
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Stepper header */}
      <div style={{ display: "flex", background: "#050505", borderRadius: "6px", padding: "4px", marginBottom: "28px", border: "1px solid #1a1a1a" }}>
        {etapas.map((e, i) => (
          <button
            key={e}
            onClick={() => i < etapa && setEtapa(i)}
            style={{
              flex: 1,
              padding: "10px 4px",
              textAlign: "center",
              fontSize: "10px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              border: "none",
              borderRadius: "4px",
              color: i === etapa ? "#111" : i < etapa ? "#c9972e" : "#444",
              background: i === etapa ? "#c9972e" : "transparent",
              cursor: i < etapa ? "pointer" : "default",
              fontWeight: i === etapa ? "600" : "400",
              transition: "all 0.2s",
            }}
          >
            {i < etapa ? "✓" : i + 1}
          </button>
        ))}
      </div>

      {/* Titulo da etapa */}
      <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#555", marginBottom: "20px" }}>
        {etapas[etapa]}
      </div>

      {/* ETAPA 0 — Barbeiro */}
      {etapa === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {barbeiros.map((b) => (
            <button
              key={b.id}
              onClick={() => { setForm({ ...form, barbeiro: b, servico: null, data: "", hora: "" }); setEtapa(1) }}
              style={btnStyle(form.barbeiro?.id === b.id)}
            >
              {b.nome}
            </button>
          ))}
        </div>
      )}

      {/* ETAPA 1 — Servico */}
      {etapa === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {servicos.map((s) => (
            <button
              key={s.id}
              onClick={() => { setForm({ ...form, servico: s, data: "", hora: "" }); setEtapa(2) }}
              style={btnStyle(form.servico?.id === s.id)}
            >
              <div style={{ fontWeight: "500", marginBottom: "2px" }}>{s.nome}</div>
              <div style={{ fontSize: "11px", color: form.servico?.id === s.id ? "#333" : "#555" }}>
                R$ {s.preco.toFixed(2).replace(".", ",")} · {s.duracaoMin} min
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ETAPA 2 — Data */}
      {etapa === 2 && (
        <div>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value, hora: "" })}
            style={{ width: "100%", background: "#050505", border: "1px solid #1a1a1a", borderRadius: "4px", color: "#fff", padding: "14px", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "16px" }}
          />
          <button
            onClick={() => form.data && setEtapa(3)}
            disabled={!form.data}
            style={{ ...btnStyle(!!form.data), textAlign: "center" as const, opacity: form.data ? 1 : 0.4 }}
          >
            Continuar
          </button>
        </div>
      )}

      {/* ETAPA 3 — Horario */}
      {etapa === 3 && (
        <div>
          {loading && <p style={{ color: "#555", fontSize: "13px" }}>Buscando horarios...</p>}
          {!loading && horarios.length === 0 && (
            <p style={{ color: "#888", fontSize: "13px" }}>Nenhum horario disponivel nessa data. Tente outro dia.</p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {horarios.map((h) => (
              <button
                key={h}
                onClick={() => { setForm({ ...form, hora: h }); setEtapa(4) }}
                style={{ ...btnStyle(form.hora === h), textAlign: "center" as const, padding: "12px" }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ETAPA 4 — Dados pessoais */}
      {etapa === 4 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888", marginBottom: "8px", display: "block" }}>
              Seu nome completo
            </label>
            <input
              type="text"
              placeholder="Joao Silva"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              style={{ width: "100%", background: "#050505", border: "1px solid #1a1a1a", borderRadius: "4px", color: "#fff", padding: "14px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => e.target.style.borderColor = "#c9972e"}
              onBlur={(e) => e.target.style.borderColor = "#1a1a1a"}
            />
          </div>
          <div>
            <label style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888", marginBottom: "8px", display: "block" }}>
              WhatsApp
            </label>
            <input
              type="tel"
              placeholder="(27) 99999-0000"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              style={{ width: "100%", background: "#050505", border: "1px solid #1a1a1a", borderRadius: "4px", color: "#fff", padding: "14px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => e.target.style.borderColor = "#c9972e"}
              onBlur={(e) => e.target.style.borderColor = "#1a1a1a"}
            />
          </div>

          {erro && <p style={{ color: "#e05555", fontSize: "12px" }}>{erro}</p>}

          <p style={{ fontSize: "11px", color: "#444", lineHeight: "1.6" }}>
            Apos confirmar, voce recebera um link no WhatsApp para finalizar. O horario fica reservado por 15 minutos.
          </p>

          <button
            onClick={confirmarAgendamento}
            disabled={loading}
            style={{ background: "#c9972e", color: "#111", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", padding: "16px", fontWeight: "600", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer", width: "100%", border: "none", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Aguarde..." : "Confirmar Agendamento"}
          </button>
        </div>
      )}

    </div>
  )
}