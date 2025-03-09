import { prisma } from '../lib/prisma'

export const getUserByCPF = async (cpf: string) => {
  return await prisma.user.findUnique({ where: { cpf } })
}
export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } })
}

export const createUser = async (data: {
  name: string
  email: string
  cpf: string
  password: string
  stripeCustumerId: string
}) => {
  return await prisma.user.create({ data })
}
