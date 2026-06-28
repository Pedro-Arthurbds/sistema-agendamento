import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"], // Adicionado para suportar o <em> (itálico) do seu título
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Navalha & Arte | Barbearia Clássica",
  description: "Ambiente reservado e atendimento personalizado. Sem filas, agende seu horário online em menos de 2 minutos.",
  keywords: ["barbearia", "itarana", "corte de cabelo", "barba", "agendamento online"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body 
        className={`
          ${playfair.variable} 
          ${inter.variable} 
          font-sans 
          antialiased 
          text-[#f0ede6]
        `}
        style={{ 
          background: "var(--bg, #111111)",
          color: "var(--text, #f0ede6)" 
        }}
      >
        {children}
      </body>
    </html>
  )
} 