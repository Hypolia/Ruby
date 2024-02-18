import PermissionResolverBuilder from '#apps/shared/services/permissions/permission_resolver_builder'
import { ResourceAccess } from '#apps/authentication/contracts/jwt'

export default class PermissionResolver {

  async getResourceAccess(data: ResourceAccess, key: string): Promise<string[]> {
    return data[key]?.roles ?? []
  }

  public createResolve(resourceAccess: ResourceAccess, key: string): PermissionResolverBuilder {
    return new PermissionResolverBuilder(this, resourceAccess, key)
  }
}
