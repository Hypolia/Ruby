import router from '@adonisjs/core/services/router'
import {middleware} from "#start/kernel";

const UsersController = () => import("#apps/users/controllers/users_controller")

router.group(() => {
  router.get('/', [UsersController, 'index'])
  router.get('/:id', [UsersController, 'show'])
  router.post('/', [UsersController, 'store'])
}).prefix('users')
  .use(middleware.auth())
