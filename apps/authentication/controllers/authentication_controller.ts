import type { HttpContext } from '@adonisjs/core/http'
import {
  loginCredentialsValidator,
  registerAuthenticationValidator
} from '#apps/authentication/validators/authentication'
import { inject } from '@adonisjs/core'
import AuthenticationService from '#apps/authentication/services/authentication_service'
import KeycloakService from '#apps/authentication/services/keycloak_service'

@inject()
export default class AuthenticationController {
  constructor(
    protected authenticationService: AuthenticationService,
    protected keycloakService: KeycloakService
  ) {
  }

  async login({ request, response }: HttpContext) {
    const { username, password } = await request.validateUsing(loginCredentialsValidator)
    const token = await this.keycloakService.loginWithPassword(username, password)

    return response.send(token)
  }

  async register({request, response}: HttpContext) {
    const payload = await request.validateUsing(registerAuthenticationValidator)
    const user = await this.authenticationService.createUser(payload)

    return response.send(user)
  }

  async me({auth, response}: HttpContext) {
    const t = auth.use('jwt')
    return response.send({
      data: t.payload
    })
  }
}
