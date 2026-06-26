import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed...")

  const senhaHash = await bcrypt.hash("admin123", 10)
  await prisma.admin.upsert({
    where: { email: "admin@barbearia.com" },
    update: {},
    create: { email: "admin@barbearia.com", senha: senhaHash },
  })
  console.log("✅ Admin criado: admin@barbearia.com / admin123")

  await prisma.servico.upsert({ where: { id: "servico-corte" }, update: {}, create: { id: "servico-corte", nome: "Corte Classico", descricao: "Elegancia atemporal.", preco: 50, duracaoMin: 30 } })
  await prisma.servico.upsert({ where: { id: "servico-barba" }, update: {}, create: { id: "servico-barba", nome: "Barba Completa", descricao: "Aparo e modelagem.", preco: 40, duracaoMin: 20 } })
  await prisma.servico.upsert({ where: { id: "servico-combo" }, update: {}, create: { id: "servico-combo", nome: "Combo Corte + Barba", descricao: "Visual completo.", preco: 80, duracaoMin: 50 } })
  await prisma.servico.upsert({ where: { id: "servico-moderno" }, update: {}, create: { id: "servico-moderno", nome: "Corte Moderno", descricao: "Estilos contemporaneos.", preco: 60, duracaoMin: 40 } })
  console.log("✅ Servicos criados")

  const joao = await prisma.barbeiro.upsert({ where: { id: "barbeiro-joao" }, update: {}, create: { id: "barbeiro-joao", nome: "Joao Silva" } })
  const carlos = await prisma.barbeiro.upsert({ where: { id: "barbeiro-carlos" }, update: {}, create: { id: "barbeiro-carlos", nome: "Carlos Mendes" } })
  console.log("✅ Barbeiros criados")

  for (const dia of [1, 2, 3, 4, 5, 6]) {
    await prisma.horarioFuncionamento.upsert({
      where: { id: `horario-joao-${dia}` }, update: {},
      create: { id: `horario-joao-${dia}`, barbeiroId: joao.id, diaSemana: dia, horaInicio: dia === 6 ? "08:00" : "09:00", horaFim: dia === 6 ? "15:00" : "19:00" },
    })
  }
  for (const dia of [2, 3, 4, 5, 6]) {
    await prisma.horarioFuncionamento.upsert({
      where: { id: `horario-carlos-${dia}` }, update: {},
      create: { id: `horario-carlos-${dia}`, barbeiroId: carlos.id, diaSemana: dia, horaInicio: "10:00", horaFim: "20:00" },
    })
  }
  console.log("✅ Horarios criados")

  console.log("\n🎉 Seed concluido!")
}

main()
  .catch((e) => { console.error("❌ Erro:", e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })