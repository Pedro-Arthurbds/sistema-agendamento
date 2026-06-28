import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const barbeiros = await prisma.barbeiro.findMany({
      where: { ativo: true },
      select: {
        id: true,
        nome: true,
        foto: true,
      },
      orderBy: { nome: "asc" },
    })

    return NextResponse.json(barbeiros)
  } catch {
    return NextResponse.json({ error: "Erro ao buscar barbeiros" }, { status: 500 })
  }
}