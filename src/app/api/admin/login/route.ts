import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { gerarToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json()

    if (!email || !senha) {
      return NextResponse.json({ error: "Email e senha obrigatorios" }, { status: 400 })
    }

    const admin = await prisma.admin.findUnique({ where: { email } })

    if (!admin) {
      return NextResponse.json({ error: "Credenciais invalidas" }, { status: 401 })
    }

    const senhaCorreta = await bcrypt.compare(senha, admin.senha)

    if (!senhaCorreta) {
      return NextResponse.json({ error: "Credenciais invalidas" }, { status: 401 })
    }

    const token = gerarToken({ id: admin.id, email: admin.email })

    const response = NextResponse.json({ ok: true })

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 horas
      path: "/",
    })

    return response
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}