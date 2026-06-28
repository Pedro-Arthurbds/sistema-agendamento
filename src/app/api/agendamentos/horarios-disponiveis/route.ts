import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const barbeiroId = searchParams.get("barbeiroId")
  const data = searchParams.get("data") // formato: 2025-06-27

  if (!barbeiroId || !data) {
    return NextResponse.json({ error: "barbeiroId e data sao obrigatorios" }, { status: 400 })
  }

  try {
    const dataObj = new Date(data)
    const diaSemana = dataObj.getDay() // 0=domingo, 1=segunda...

    // Busca horário de funcionamento do barbeiro nesse dia
    const horario = await prisma.horarioFuncionamento.findFirst({
      where: { barbeiroId, diaSemana, ativo: true },
    })

    if (!horario) {
      return NextResponse.json({ horariosDisponiveis: [] })
    }

    // Busca agendamentos já existentes nesse dia para esse barbeiro
    const inicioDia = new Date(data)
    inicioDia.setHours(0, 0, 0, 0)
    const fimDia = new Date(data)
    fimDia.setHours(23, 59, 59, 999)

    const agendamentosExistentes = await prisma.agendamento.findMany({
      where: {
        barbeiroId,
        dataHora: { gte: inicioDia, lte: fimDia },
        status: { in: ["PENDENTE", "CONFIRMADO"] },
      },
      include: { servico: true },
    })

    // Busca bloqueios do barbeiro nesse dia
    const bloqueios = await prisma.bloqueio.findMany({
      where: {
        barbeiroId,
        data: { gte: inicioDia, lte: fimDia },
      },
    })

    // Gera slots de 30 em 30 minutos dentro do horário de funcionamento
    const slots: string[] = []
    const [horaInicio, minInicio] = horario.horaInicio.split(":").map(Number)
    const [horaFim, minFim] = horario.horaFim.split(":").map(Number)

    let atual = horaInicio * 60 + minInicio
    const fim = horaFim * 60 + minFim

    while (atual < fim) {
      const h = Math.floor(atual / 60).toString().padStart(2, "0")
      const m = (atual % 60).toString().padStart(2, "0")
      slots.push(`${h}:${m}`)
      atual += 30
    }

    // Filtra slots ocupados
    const horariosOcupados = new Set<string>()

    for (const ag of agendamentosExistentes) {
      const horaAg = ag.dataHora.getHours().toString().padStart(2, "0")
      const minAg = ag.dataHora.getMinutes().toString().padStart(2, "0")
      const slotInicio = `${horaAg}:${minAg}`
      const inicioMin = ag.dataHora.getHours() * 60 + ag.dataHora.getMinutes()
      const duracaoMin = ag.servico.duracaoMin

      // Bloqueia todos os slots que esse agendamento ocupa
      for (let i = 0; i < duracaoMin; i += 30) {
        const slotMin = inicioMin + i
        const sh = Math.floor(slotMin / 60).toString().padStart(2, "0")
        const sm = (slotMin % 60).toString().padStart(2, "0")
        horariosOcupados.add(`${sh}:${sm}`)
      }
    }

    // Filtra bloqueios manuais
    for (const bloqueio of bloqueios) {
      if (!bloqueio.horaInicio || !bloqueio.horaFim) {
        // Dia inteiro bloqueado
        return NextResponse.json({ horariosDisponiveis: [] })
      }
      const [bhi, bmi] = bloqueio.horaInicio.split(":").map(Number)
      const [bhf, bmf] = bloqueio.horaFim.split(":").map(Number)
      let bAtual = bhi * 60 + bmi
      const bFim = bhf * 60 + bmf
      while (bAtual < bFim) {
        const sh = Math.floor(bAtual / 60).toString().padStart(2, "0")
        const sm = (bAtual % 60).toString().padStart(2, "0")
        horariosOcupados.add(`${sh}:${sm}`)
        bAtual += 30
      }
    }

    const horariosDisponiveis = slots.filter((slot) => !horariosOcupados.has(slot))

    return NextResponse.json({ horariosDisponiveis })
  } catch {
    return NextResponse.json({ error: "Erro ao buscar horarios" }, { status: 500 })
  }
}