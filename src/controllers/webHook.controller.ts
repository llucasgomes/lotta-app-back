import { FastifyInstance } from 'fastify'
import { webHookService } from '../services/webHook.service'

export default async function webHookController(server: FastifyInstance) {
  server.addContentTypeParser(
    'application/json',
    { parseAs: 'buffer' },
    (req, body, done) => done(null, body)
  )
  server.post('/', webHookService)
}
