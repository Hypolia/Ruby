import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ServerService from '#apps/servers/services/server_service'
import {
  createServerValidator,
  getServerStatsValidator,
  getServerValidator,
} from '#apps/servers/validators/server'
import ServerPolicy from '#apps/servers/policies/server_policy'
import rabbit from '#apps/shared/services/rabbit'
import logger from '@adonisjs/core/services/logger'
import redis from '@adonisjs/redis/services/main'

@inject()
export default class ServersController {
  constructor(private serverService: ServerService) {}

  /**
   * Display a list of resource
   */
  async index({ bouncer, request }: HttpContext) {
    await bouncer.with(ServerPolicy).authorize('view' as never)
    const dto = await request.validateUsing(getServerValidator)
    console.log(dto);
    

    //return this.serverService.findAll(dto)

    logger.info('Sending message to rabbit')
    //transmit.broadcast('servers', { data: [{ name: 'test' }] })

    try {
      const servers = [
        {
          id: 1,
          name: 'Server 1',
        },
        {
          id: 2,
          name: 'Server 2',
        },
      ]
      await redis.set('servers', JSON.stringify(servers))
      await rabbit.sendToQueue('test2', {
        message: 'Hello World',
      })
    } catch (error) {
      console.log(error)
    }
  }

  async events(ctx: HttpContext) {
    console.log(ctx.request.id())

  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, bouncer }: HttpContext) {
    await bouncer.with(ServerPolicy).authorize('store' as never)
    const payload = await request.validateUsing(createServerValidator)

    return this.serverService.create(payload)
  }

  async stats({ request, bouncer }: HttpContext) {
    await bouncer.with(ServerPolicy).authorize('view' as never)
    const dto = await request.validateUsing(getServerStatsValidator)

    return this.serverService.getServersStatistics(dto)
  }

  /**
   * Show individual record
   */
  async show({ params, bouncer }: HttpContext) {
    await bouncer.with(ServerPolicy).authorize('view' as never)
    return this.serverService.findById(params.id)
  }

  /**
   * Handle form submission for the edit action
   */
  //async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params, bouncer }: HttpContext) {
    await bouncer.with(ServerPolicy).authorize('delete' as never)

    await this.serverService.deleteById(params.id)
  }
}
