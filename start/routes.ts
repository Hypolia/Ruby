/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import rabbit from '#apps/shared/services/rabbit'
import router from '@adonisjs/core/services/router'
import redis from '@adonisjs/redis/services/main'
import transmit from '@adonisjs/transmit/services/main'

router.get('/', async ({ response }) => {
  return response.send({
    hello: 'world',
  })
})

router.get('/get', async ({ response }) => {
  const value = await redis.get('hello')
  return response.send({
    value,
  })
})

transmit.on('broadcast', (channel) => {
  console.log('broadcast', channel)
})

transmit.on('connect', ({ uid }) => {
  console.log('connect', uid)
})

rabbit.consumeFrom('test2', async (message, channel) => {
  transmit.broadcast('servers', {
    message: 'result',
  })
  channel.ack(message)
})
