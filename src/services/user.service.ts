import { FastifyReply, FastifyRequest } from 'fastify'
import { createStripeCustomer } from '../lib/stripe'
import { createUser, getUserByCPF } from '../models/user.model'

type schemaBody = {
  name: string
  email: string
  cpf: string
  password: string
}

export const createUserService = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const { cpf, email, name, password } = req.body as schemaBody

    const userExist = await getUserByCPF(cpf)

    if (userExist) {
      return res.status(400).send({ message: 'Usuário já cadastrado' })
    }

    const customer = await createStripeCustomer({ name, email })
    const user = await createUser({
      cpf,
      email,
      name,
      password,
      stripeCustumerId: customer.id,
    })
    return res.status(201).send(user)
  } catch (error) {
    console.log('Erro Interno no servidor', error)
    res.status(500).send({ message: 'Erro interno no servidor' })
  }
}

export const getUserByCPFService = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const { cpf } = req.body as { cpf: string }

    const userExist = await getUserByCPF(cpf)

    return res.status(200).send(userExist)
  } catch (error) {
    console.log('Erro Interno no servidor', error)
    res.status(500).send({ message: 'Erro interno no servidor' })
  }
}
