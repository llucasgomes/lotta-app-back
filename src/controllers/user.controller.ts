import { FastifyInstance } from 'fastify'
import { createUserService } from '../services/user.service'

export default async function userController(server: FastifyInstance) {
  server.post('/', createUserService)
  // server.post('/teste', getUserByCPFService)
}
