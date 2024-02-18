import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthenticationController = () =>
  import('#apps/authentication/controllers/authentication_controller')

router
  .group(() => {
    router.post('/login', [AuthenticationController, 'login'])
    router.post('/register', [AuthenticationController, 'register'])

    router
      .group(() => {
        router.get('/me', [AuthenticationController, 'me'])
      })
      .use(middleware.auth())
  })
  .prefix('authentication')
