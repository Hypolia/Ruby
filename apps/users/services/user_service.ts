import User from '#apps/users/models/user'
import {FindAll, FindById} from "#apps/users/contracts/user";
import {CreateUserSchema} from "#apps/users/validators/user";
import {inject} from "@adonisjs/core";
import KeycloakService from "#apps/authentication/services/keycloak_service";
import logger from "@adonisjs/core/services/logger";

@inject()
export default class UserService {
  constructor(protected keycloakService: KeycloakService) {}

  async findAll({ page = 1, size = 10 }: FindAll): Promise<User[]> {
    return User
      .query()
      .paginate(page, size)
  }

  async findById(userId: string, { }: FindById): Promise<User> {
    return User.query()
      .where('id', userId)
      .firstOrFail()
  }

  async create(payload: CreateUserSchema): Promise<User> {
    logger.info("[*] UserService: created this")

    const id = await this.keycloakService.createUser({
      username: payload.username,
      firstName: payload.firstname,
      lastName: payload.lastname,
      enabled: true,
      emailVerified: true,
      email: payload.email,
      credentials: [
        {
          type: 'password',
          value: payload.password,
          temporary: false
        }
      ]
    })
    logger.info(`User create in keycloak with id ${id}`)
    return await User.create({
      username: payload.username,
      email: payload.email,
      lastname: payload.lastname,
      firstname: payload.firstname,
      id: id
    })
  }

  async deleteById(userId: string) {
    await this.keycloakService.deleteUser(userId)

    const user = await User.findOrFail(userId)
    await user.delete()
  }
}
