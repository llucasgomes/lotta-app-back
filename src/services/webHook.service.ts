import { FastifyReply, FastifyRequest } from 'fastify'
import { config } from '../conf'
import {
  handleCancelPlan,
  handleCheckoutSessionCompleted,
  handleSubscriptionSessionCompleted,
  stripe,
} from '../lib/stripe'

export const webHookService = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const signature = req.headers['stripe-signature'] as string
  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe.webhookSecret
    )
  } catch (err) {
    res.status(400).send(`Webhook Error`)
    return
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event)
      break
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionSessionCompleted(event)
      break
    case 'customer.subscription.deleted':
      await handleCancelPlan(event)
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.send()
}
