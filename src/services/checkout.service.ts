import { FastifyReply, FastifyRequest } from 'fastify'
import { createPortalCustomer, generateCheckoutSession } from '../lib/stripe'
import { getUserByCPF } from '../models/user.model'

export const checkoutStripeService = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { id } = req.params as { id: string }

  try {
    const user = await getUserByCPF(id)
    if (!user) {
      return res.status(404).send({ error: 'Usuário não encontrado' })
    }

    if (user.stripeSubscriptionStatus === 'active') {
      return res
        .status(400)
        .send({ error: 'Usuário já possui uma assinatura ativa' })
    }
    const checkout = await generateCheckoutSession(user)
    // const checkout = await createPortalCustomer(user)
    return res.status(200).send(checkout)
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: 'Erro ao gerar sessão de checkout' })
  }
}
export const checkoutStripePortalService = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { id } = req.params as { id: string }

  try {
    const user = await getUserByCPF(id)
    if (!user) {
      return res.status(404).send({ error: 'Usuário não encontrado' })
    }
    // const checkout = await generateCheckoutSession(user)
    const portal = await createPortalCustomer(user)
    return res.status(200).send(portal)
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: 'Erro ao criar portal ' })
  }
}
