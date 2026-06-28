import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  try {
    const agendamento = await prisma.agendamento.findUnique({
      where: { tokenConfirmacao: token },
      include: {
        cliente: true,
        barbeiro: true,
        servico: true,
      },
    })

    if (!agendamento) {
      return NextResponse.json({ error: "Agendamento nao encontrado" }, { status: 404 })
    }

    if (agendamento.status === "CONFIRMADO") {
      return NextResponse.json({ message: "Agendamento ja confirmado", agendamento })
    }

    if (agendamento.status === "EXPIRADO" || agendamento.status === "CANCELADO") {
      return NextResponse.json({ error: "Agendamento expirado ou cancelado" }, { status: 410 })
    }

    const agora = new Date()
    const expira = new Date(agendamento.expiraEm)

    console.log("Agora:", agora.toISOString())
    console.log("Expira:", expira.toISOString())
    console.log("Expirado?", agora > expira)

    if (agora > expira) {
      await prisma.agendamento.update({
        where: { id: agendamento.id },
        data: { status: "EXPIRADO" },
      })
      return NextResponse.json({ error: "Agendamento expirado" }, { status: 410 })
    }

    // Confirma o agendamento
    const atualizado = await prisma.agendamento.update({
      where: { id: agendamento.id },
      data: { status: "CONFIRMADO" },
      include: {
        cliente: true,
        barbeiro: true,
        servico: true,
      },
    })

    return NextResponse.json({ message: "Agendamento confirmado com sucesso!", agendamento: atualizado })
  } catch {
    return NextResponse.json({ error: "Erro ao confirmar agendamento" }, { status: 500 })
  }
}