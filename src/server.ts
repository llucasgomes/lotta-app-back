import fastifyCors from '@fastify/cors'
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import checkOutRoute from './routes/checkout.route'
import userRouter from './routes/user.route'
import webHookRoute from './routes/webHook.route'

//Instaciar o servidor
const server: FastifyInstance = fastify()

//Plugins

server.register(fastifyCors)

//rotas
server.get('/', (req: FastifyRequest, replay: FastifyReply) => {
  replay.status(200).send({ message: 'servidor ok' })
})

server.register(webHookRoute)
server.register(userRouter)
server.register(checkOutRoute)

//configurações de porta
server.listen(
  {
    port: 3000,
  },
  (err, address) => {
    console.log(`Server runnig in ${address}`)
  }
)
