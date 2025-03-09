import { FastifyInstance } from 'fastify'
import {
  checkoutStripePortalService,
  checkoutStripeService,
} from '../services/checkout.service'

export default async function checkOutController(server: FastifyInstance) {
  server.get('/checkout/:id', checkoutStripeService),
    server.get('/portal/checkout/:id', checkoutStripePortalService)
}
