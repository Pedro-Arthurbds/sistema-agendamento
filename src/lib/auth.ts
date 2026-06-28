import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "segredo-local"

export function gerarToken(payload: { id: string; email: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: "8h" })
}

export function verificarToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { id: string; email: string }
  } catch {
    return null
  }
}