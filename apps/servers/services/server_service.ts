import { inject } from '@adonisjs/core'
import app from '@adonisjs/core/services/app'
import {
  type CreateServersSchema,
  GetServersSchema,
  GetServersStatsSchema,
} from '#apps/servers/validators/server'
import ResourceNotFoundException from '#apps/shared/exceptions/resource_not_found_exception'
import { ServerKey } from '#apps/servers/contracts/index'

@inject()
export default class ServerService {
  #collection = 'servers'

  async findAll(dto: GetServersSchema) {
    const mongo = await app.container.make('mongo')

    const query: { [p: string]: string } = {}

    if (dto.type) {
      query['minecraft_server.type'] = dto.type
    }
    if (dto.status) {
      query['network.status'] = dto.status
    }

    return mongo.find('servers', query)
  }

  async getServersStatistics(dto: GetServersStatsSchema) {
    const mongo = await app.container.make('mongo')
    const pipeline: { [p: string]: any }[] = []

    if (dto.type) {
      pipeline.push({ $match: { 'minecraft_server.type': dto.type } })
    }

    if (dto.status) {
      pipeline.push({ $match: { 'network.status': dto.status } })
    }

    return mongo.aggregate(this.#collection, [
      ...pipeline,
      {
        $group: {
          _id: `$${ServerKey[dto.key]}`,
          count: { $sum: 1 },
          servers_groups: {
            $push: '$$ROOT',
          },
        },
      },
    ])
  }

  async findById(serverId: string) {
    const mongo = await app.container.make('mongo')

    try {
      const result = await mongo.findById(this.#collection, serverId)

      if (!result) {
        throw new ResourceNotFoundException(`Server ${serverId} does not exist`)
      }

      return result
    } catch (e) {
      throw new ResourceNotFoundException(`Server ${serverId} does not exist`)
    }
  }

  async create(payload: CreateServersSchema) {
    const mongo = await app.container.make('mongo')

    return mongo.insertData(this.#collection, payload)
  }

  async deleteById(serverId: string) {
    const mongo = await app.container.make('mongo')
    try {
      const result = await mongo.deleteById(this.#collection, serverId)

      if (!result.deletedCount) {
        throw new ResourceNotFoundException(`Server ${serverId} does not exist`)
      }

      return result
    } catch (e) {
      throw new ResourceNotFoundException(`Server ${serverId} does not exist`)
    }
  }
}
