/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import redis from '@adonisjs/redis/services/main'

router.get('/', async ({ response }) => {
  await redis.set('hello', 'world')

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
