import { AuthClientResponse, GuardContract } from '@adonisjs/auth/types'
import { symbols } from '@adonisjs/auth'
import { HttpContext } from '@adonisjs/core/http'
import User from '#apps/users/models/user'
import { AccessTokensUserProviderContract } from '@adonisjs/auth/types/access_tokens'
import jwt from 'jsonwebtoken'
import { errors as authErrors } from '@adonisjs/auth'
import { inject } from '@adonisjs/core'
import KeycloakService from '#apps/authentication/services/keycloak_service'
import { JwtPayload } from '#apps/authentication/contracts/jwt'

@inject()
export class JwtGuard<UserProvider extends AccessTokensUserProviderContract<unknown>> implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]> {
  declare [symbols.GUARD_KNOWN_EVENTS]: {}

  public driverName: string = 'jwt'

  public authenticationAttempted: boolean = false
  public isAuthenticated: boolean = false
  public user?: UserProvider[typeof symbols.PROVIDER_REAL_USER]
  public payload?: JwtPayload | string

  constructor(
    private ctx: HttpContext,
    private userProvider: UserProvider,
    protected keycloakService: KeycloakService
  ) {}

  async authenticate() {
    const authHeader: string | undefined = this.ctx.request.header('authorization')
    if (!authHeader) {
      throw new authErrors.E_UNAUTHORIZED_ACCESS(
        'Unauthorized access', {
          guardDriverName: this.driverName
        })
    }

    const [, token] = authHeader.split('Bearer ')
    if (!token) {
      throw new authErrors.E_UNAUTHORIZED_ACCESS(
        'No access token was found', {
          guardDriverName: this.driverName
        })
    }

    this.payload = await this.verifyToken(token)
  }

  async authenticateAsClient(user: UserProvider[typeof symbols.PROVIDER_REAL_USER], ...args: any[]): Promise<AuthClientResponse> {
    const token = await this.userProvider.createToken(user, args)
    return {
      headers: {
        authorization: `Bearer ${token.value!.release()}`
      }
    } as AuthClientResponse
  }

  async check(): Promise<boolean> {
    await this.authenticate()
    return Promise.resolve(true)
  }

  public async getUserOrFail(): Promise<UserProvider[typeof symbols.PROVIDER_REAL_USER]> {
    return User.query().firstOrFail()
  }

  public async verifyToken(token: string): Promise<string | JwtPayload> {
    try {
      const key = await this.keycloakService.getPublicCert()

      
      const publicKey = `-----BEGIN CERTIFICATE-----\n${key}\n-----END CERTIFICATE-----`

      const decodedToken = jwt.decode(token, {complete: true})
      const algorithm = decodedToken?.header.alg as jwt.Algorithm

      return jwt.verify(token, publicKey, { algorithms: [algorithm] })
    } catch (e) {
      console.log(e);
      
      throw new authErrors.E_UNAUTHORIZED_ACCESS(
        'Unauthorized access', {
          guardDriverName: this.driverName
        })
    }
  }
}
