import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { nome, preco, duracaoMin } = await request.json()
    if (!nome?.trim() || !preco || !duracaoMin) return NextResponse.json({ error: "Preencha todos os campos" }, { status: 400 })
    const servico = await prisma.servico.create({ data: { nome: nome.trim(), preco: parseFloat(preco), duracaoMin: parseInt(duracaoMin) } })
    return NextResponse.json(servico, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro ao criar servico" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ativo } = await request.json()
    if (!id) return NextResponse.json({ error: "ID obrigatorio" }, { status: 400 })
    const servico = await prisma.servico.update({ where: { id }, data: { ativo } })
    return NextResponse.json(servico)
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar servico" }, { status: 500 })
  }
}