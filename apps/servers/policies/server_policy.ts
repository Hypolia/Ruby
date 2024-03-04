import { allowGuest, BasePolicy } from '@adonisjs/bouncer'
import { inject } from '@adonisjs/core'
import { JwtPayload } from '#apps/authentication/contracts/jwt'
import PermissionResolver from '#apps/shared/services/permissions/permission_resolver'
import { HttpContext } from '@adonisjs/core/http'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

@inject()
export default class ServerPolicy extends BasePolicy {
  protected payload: JwtPayload

  constructor(
    protected permissionResolver: PermissionResolver,
    protected ctx: HttpContext
  ) {
    super()
    this.payload = ctx.auth.use('jwt').payload! as JwtPayload
  }

  async before(): Promise<boolean | undefined> {
    if (
      await this.permissionResolver
        .createResolve(this.payload?.resource_access, 'server-service')
        .verifyAccess('manage-servers')
    ) {
      return true
    }
  }

  @allowGuest()
  async view(): Promise<AuthorizerResponse> {
    return this.permissionResolver
      .createResolve(this.payload?.resource_access, 'server-service')
      .verifyAccess('view-servers')
  }

  @allowGuest()
  async create(): Promise<AuthorizerResponse> {
    return this.permissionResolver
      .createResolve(this.payload?.resource_access, 'server-service')
      .verifyAccess('create-servers')
  }

  @allowGuest()
  async delete(): Promise<AuthorizerResponse> {
    return this.permissionResolver
      .createResolve(this.payload?.resource_access, 'server-service')
      .verifyAccess('delete-servers')
  }
}
