import { User } from '@prisma/client'
import Stripe from 'stripe'
import { config } from '../conf'
import { prisma } from './prisma'

export const stripe = new Stripe(config.stripe.secretKey || '', {
  apiVersion: '2025-02-24.acacia',
  httpClient: Stripe.createFetchHttpClient(),
})

export const getStripeCustomerByEmail = async (email: string) => {
  const customers = await stripe.customers.list({ email })
  return customers.data[0]
}

export const createStripeCustomer = async (user: {
  name?: string
  email: string
}) => {
  // let customer = await getStripeCustomerByEmail(user.email)
  // if (customer) return customer

  return stripe.customers.create({
    email: user.email,
    name: user.name,
  })
}

export const generateCheckoutSession = async (user: User) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      client_reference_id: user?.id,
      customer: user?.stripeCustumerId as string,
      success_url: `http://localhost:3000/success.html`,
      cancel_url: `http://localhost:3000/cancel.html`,
      line_items: [
        {
          price: config.stripe.proPriceId,
          quantity: 1,
        },
      ],
    })

    return {
      url: session.url,
    }
  } catch (error) {
    console.log(error)
  }
}

export const handleCheckoutSessionCompleted = async (event: {
  data: { object: Stripe.Checkout.Session }
}) => {
  const idUser = event.data.object.client_reference_id as string
  const stripeSubscriptionId = event.data.object.subscription as string
  const stripeCustumerId = event.data.object.customer as string
  const checkoutStatus = event.data.object.status

  if (checkoutStatus !== 'complete') return

  if (!idUser || !stripeSubscriptionId || !stripeCustumerId) {
    throw new Error(
      'idUser, stripeSubscriptionId, stripeCustumerId is required'
    )
  }

  const userExist = await prisma.user.findFirst({ where: { id: idUser } })
  console.log(userExist)

  if (!userExist) {
    throw new Error('user not found')
  }

  await prisma.user.update({
    where: {
      id: userExist.id,
    },
    data: {
      stripeCustumerId,
      stripeSubscriptionId,
    },
  })
}

export const handleSubscriptionSessionCompleted = async (event: {
  data: { object: Stripe.Subscription }
}) => {
  const subscriptionStatus = event.data.object.status
  const stripeCustumerId = event.data.object.customer as string
  const stripeSubscriptionId = event.data.object.id as string

  const userExist = await prisma.user.findFirst({
    where: { stripeCustumerId },
  })

  if (!userExist) {
    throw new Error('user stripeCustumerId not found')
  }

  await prisma.user.update({
    where: {
      id: userExist.id,
    },
    data: {
      stripeCustumerId,
      stripeSubscriptionId,
      stripeSubscriptionStatus: subscriptionStatus,
    },
  })
}

export const handleCancelPlan = async (event: {
  data: { object: Stripe.Subscription }
}) => {
  const stripeCustumerId = event.data.object.customer as string

  const userExist = await prisma.user.findFirst({
    where: { stripeCustumerId },
  })

  if (!userExist) {
    throw new Error('user stripeCustumerId not found')
  }

  await prisma.user.update({
    where: {
      id: userExist.id,
    },
    data: {
      stripeCustumerId,
      stripeSubscriptionStatus: null,
    },
  })
}

export const handleCancelSubscription = async (idSubscriptions: string) => {
  const subscription = await stripe.subscriptions.update(idSubscriptions, {
    cancel_at_period_end: true,
  })

  return subscription
}

export const createPortalCustomer = async (user: User) => {
  if (!user.stripeCustumerId) {
    throw new Error('O usuário não possui um Stripe Customer ID.')
  }
  try {
    await stripe.customers.retrieve(user.stripeCustumerId as string)

    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustumerId as string,
      return_url: 'http://localhost:3000/',
    })

    return portal
  } catch (error) {
    console.error('Erro ao criar portal do cliente:', error)
    throw new Error('Erro ao criar portal do cliente.')
  }
}
