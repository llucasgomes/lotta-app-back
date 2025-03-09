import { FastifyInstance } from 'fastify'
import checkOutController from '../controllers/checkout.controller'

export default async function checkOutRoute(server: FastifyInstance) {
  server.register(checkOutController, { prefix: '/stripe' })
}
