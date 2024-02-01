import {BasePolicy} from '@adonisjs/bouncer'
import User from '#apps/users/models/user'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { inject } from '@adonisjs/core'
import PermissionResolver from '#apps/shared/services/permissions/permission_resolver'

@inject()
export default class PermissionPolicy extends BasePolicy {
  constructor(protected permissionResolver: PermissionResolver) {
    super()
  }

  async before(user: User | null) {
    if (user) {
      const permissions = await this.permissionResolver.getPermissions(user)

      if (permissions.includes('admin')) return true
    }
  }

  async view(user: User): Promise<AuthorizerResponse> {
    return this.permissionResolver
      .createResolve(user, 'role')
      .verifyAccess('view')
  }
}
