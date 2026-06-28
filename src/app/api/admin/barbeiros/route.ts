import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { nome } = await request.json()
    if (!nome?.trim()) return NextResponse.json({ error: "Nome obrigatorio" }, { status: 400 })
    const barbeiro = await prisma.barbeiro.create({ data: { nome: nome.trim() } })
    return NextResponse.json(barbeiro, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro ao criar barbeiro" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ativo } = await request.json()
    if (!id) return NextResponse.json({ error: "ID obrigatorio" }, { status: 400 })
    const barbeiro = await prisma.barbeiro.update({ where: { id }, data: { ativo } })
    return NextResponse.json(barbeiro)
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar barbeiro" }, { status: 500 })
  }
}