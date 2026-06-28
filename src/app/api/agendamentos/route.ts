import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, whatsapp, barbeiroId, servicoId, data, hora } = body

    // Validações básicas
    if (!nome || !whatsapp || !barbeiroId || !servicoId || !data || !hora) {
      return NextResponse.json({ error: "Todos os campos sao obrigatorios" }, { status: 400 })
    }

    // Valida formato do WhatsApp (mínimo 10 dígitos)
    const whatsappLimpo = whatsapp.replace(/\D/g, "")
    if (whatsappLimpo.length < 10 || whatsappLimpo.length > 11) {
      return NextResponse.json({ error: "WhatsApp invalido" }, { status: 400 })
    }

    // Monta a data/hora do agendamento
    const [ano, mes, dia] = data.split("-").map(Number)
    const [horaNum, minNum] = hora.split(":").map(Number)
    const dataHora = new Date(ano, mes - 1, dia, horaNum, minNum, 0)

    // Não permite agendamento no passado
    if (dataHora < new Date()) {
      return NextResponse.json({ error: "Data e hora invalidas" }, { status: 400 })
    }

    // Verifica se o horário ainda está disponível
    const servicoSelecionado = await prisma.servico.findUnique({
      where: { id: servicoId },
    })

    if (!servicoSelecionado) {
      return NextResponse.json({ error: "Servico nao encontrado" }, { status: 404 })
    }

    const fimAgendamento = new Date(dataHora.getTime() + servicoSelecionado.duracaoMin * 60000)

    const conflito = await prisma.agendamento.findFirst({
      where: {
        barbeiroId,
        status: { in: ["PENDENTE", "CONFIRMADO"] },
        AND: [
          { dataHora: { lt: fimAgendamento } },
          { dataHora: { gte: dataHora } },
        ],
      },
    })

    if (conflito) {
      return NextResponse.json({ error: "Horario nao disponivel" }, { status: 409 })
    }

    // Cria ou busca o cliente
    const cliente = await prisma.cliente.upsert({
      where: { whatsapp: whatsappLimpo },
      update: { nome },
      create: { nome, whatsapp: whatsappLimpo },
    })

    // Define expiração em 15 minutos
    const expiraEm = new Date(Date.now() + 15 * 60 * 1000)

    // Cria o agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        clienteId: cliente.id,
        barbeiroId,
        servicoId,
        dataHora,
        expiraEm,
        status: "PENDENTE",
      },
      include: {
        cliente: true,
        barbeiro: true,
        servico: true,
      },
    })

    // Monta link de confirmação
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    const linkConfirmacao = `${baseUrl}/confirmar/${agendamento.tokenConfirmacao}`

    // Monta mensagem do WhatsApp
    const dataFormatada = dataHora.toLocaleDateString("pt-BR")
    const horaFormatada = dataHora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

    const mensagem = encodeURIComponent(
      `Ola ${nome}! Seu agendamento na Navalha & Arte foi recebido.\n\n` +
      `Servico: ${servicoSelecionado.nome}\n` +
      `Barbeiro: ${agendamento.barbeiro.nome}\n` +
      `Data: ${dataFormatada} as ${horaFormatada}\n\n` +
      `Para CONFIRMAR seu horario, clique no link abaixo (valido por 15 minutos):\n` +
      `${linkConfirmacao}\n\n` +
      `Se nao confirmar, o horario sera liberado automaticamente.`
    )

    const whatsappUrl = `https://wa.me/55${whatsappLimpo}?text=${mensagem}`

    return NextResponse.json({
      agendamento,
      linkConfirmacao,
      whatsappUrl,
    }, { status: 201 })

  } catch {
    return NextResponse.json({ error: "Erro ao criar agendamento" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        cliente: true,
        barbeiro: true,
        servico: true,
      },
      orderBy: { dataHora: "asc" },
    })

    return NextResponse.json(agendamentos)
  } catch {
    return NextResponse.json({ error: "Erro ao buscar agendamentos" }, { status: 500 })
  }
}