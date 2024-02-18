import type { HttpContext } from '@adonisjs/core/http'
import {inject} from '@adonisjs/core'
import UserService from '#apps/users/services/user_service'
import UserPolicy from '#apps/users/policies/user_policy'
import {createUserValidator} from "#apps/users/validators/user";
import KeycloakService from "#apps/authentication/services/keycloak_service";
import logger from "@adonisjs/core/services/logger";

@inject()
export default class UsersController {
  constructor(
    protected userService: UserService,
    protected keycloakService: KeycloakService
  ) {}

  async index({ request, response, bouncer }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('view' as never)
    const page = request.input('page', 1)
    const size = request.input('size', 30)

    const users = await this.userService.findAll({ page, size })


    return response.send(users)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    const user = await this.userService.create(payload)

    return response.send({
      data: user
    })
  }

  /**
   * Show individual record
   */
  async show({ params, request, response }: HttpContext) {
    const includeRole = request.input('includeRole', true)

    const user = await this.userService.findById(params.id, {
      includeRole
    })

    return response.send(user)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ }: HttpContext) {}

  /**
   * Delete record
   */
  async delete({ params, response }: HttpContext) {
    logger.info(`try to delete user: ${params.id}`)

    await this.userService.deleteById(params.id)

    return response.send({
      message: 'uspnper has been deleted'
    })
  }
}
