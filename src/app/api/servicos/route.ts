import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const servicos = await prisma.servico.findMany({
            where: { ativo: true},
            select: {
                id: true,
                nome: true,
                descricao: true,
                preco: true,
                duracaoMin: true,
            },
            orderBy: {nome: "asc"},
        })
        return NextResponse.json(servicos)
    } catch{
        return NextResponse.json({error: "Erro ao busco servicos"}, {status:500})
    }
}