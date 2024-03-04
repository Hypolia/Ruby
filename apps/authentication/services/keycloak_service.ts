import keycloak from '#config/keycloak'
import axios from 'axios'
import logger from '@adonisjs/core/services/logger'
import { errors as authErrors } from '@adonisjs/auth'
import {errors} from "@adonisjs/core";

type WellKnownKeyResponse = {
  keys: {
    kid: string
    kty: string
    alg: string
    use: string
    n: string
    e: string
    x5c: string[]
    x5t: string
    'x5t#S256': string
  }[]
}

type GetAdminTokenResponse = {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  'not-before-policy': number
  token_type: string
  scope: string
}

type KeycloakConfig = {
  realm?: string
  url?: string
  clientId?: string
  clientSecret?: string
  admin: {
    clientId?: string
    clientSecret?: string
  }
}

export default class KeycloakService {
  private readonly config: KeycloakConfig
  private publicCert?: string

  constructor() {
    this.config = keycloak
  }

  public async getPublicCert(): Promise<string> {
    return this.publicCert ?? (await this.fetchOidcCert())
  }

  private async fetchOidcCert(): Promise<string> {
    const url = `${this.config.url}/realms/${this.config.realm}/protocol/openid-connect/certs`
    const { data } = await axios.get<WellKnownKeyResponse>(url)
    const rs256key = data.keys.filter((key) => key.alg === 'RS256')

    if (!rs256key) {
      throw new Error("RS256 key not found")
    }

    this.publicCert = rs256key[0].x5c[0]

    return this.publicCert
  }

  private async getAdminToken(): Promise<string> {
    const url = `${this.config.url}/realms/${this.config.realm}/protocol/openid-connect/token`

    const data = {
      grant_type: 'client_credentials',
      client_id: this.config.admin.clientId,
      client_secret: this.config.admin.clientSecret,
    }

    const response = await axios.post<GetAdminTokenResponse>(url, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    return response.data.access_token
  }

  async createUser(user: any): Promise<string | undefined> {
    try {
      const url = `${this.config.url}/admin/realms/${this.config.realm}/users`

      const tokenResponse = await this.getAdminToken()

      const response = await axios.post(url, user, {
        headers: {
          Authorization: `Bearer ${tokenResponse}`,
          'Content-Type': 'application/json',
        },
      })

      if (![200, 204, 201].includes(response.status)) {
        throw new authErrors.E_UNAUTHORIZED_ACCESS("Failed to create user", { guardDriverName: "jwt" })
      }

      const locationHeader: string = response.headers['location']

      return locationHeader.split('/').pop()
    } catch (err) {
      logger.error({ message: err.message }, "failed to create user in keycloak")
      throw new errors.E_HTTP_EXCEPTION('Error failed to create user')
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const url = `${this.config.url}/admin/realms/${this.config.realm}/users/${userId}`

    const tokenResponse = await this.getAdminToken()

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${tokenResponse}`,
        'Content-Type': 'application/json',
      },
    })

    if (![200, 204, 201].includes(response.status)) {
      throw new authErrors.E_UNAUTHORIZED_ACCESS("Failed to delete user", { guardDriverName: "jwt" })
    }
  }

  async loginWithPassword(username: string, password: string) {
    logger.info(`User login: ${username}`)

    console.log(this.config, username, password)

    try {
      const resp = await axios.post(
        `${this.config.url}/realms/${this.config.realm}/protocol/openid-connect/token`,
        {
          grant_type: 'password',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          password: password,
          username: username,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          withCredentials: true,
          method: 'POST',
        }
      )

      return resp.data
    } catch (err) {
      throw new Error("Invalid Credentials")
    }
  }
}
