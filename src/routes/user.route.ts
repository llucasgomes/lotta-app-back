import { FastifyInstance } from 'fastify'
import userController from '../controllers/user.controller'

export default async function userRouter(server: FastifyInstance) {
  server.register(userController, { prefix: '/user' })
}
