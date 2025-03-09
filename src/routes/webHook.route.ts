import { FastifyInstance } from 'fastify'
import webHookController from '../controllers/webHook.controller'

export default async function webHookRoute(server: FastifyInstance) {
  server.register(webHookController, { prefix: '/webhook' })
}
