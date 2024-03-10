import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ServersController = () => import('#apps/servers/controllers/servers_controller')

router
  .group(() => {
    router
      .group(() => {
        router.get('/', [ServersController, 'index'])
        router.get('/events', [ServersController, 'events'])
        router.get('/stats', [ServersController, 'stats'])
        router.get('/:id', [ServersController, 'show'])
        router.post('/', [ServersController, 'store'])
        router.delete('/:id', [ServersController, 'destroy'])
      })
      .prefix('servers')
  })
  .use(
    middleware.auth({
      guards: ['jwt'],
    })
  )
