import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import ServerService from '#apps/servers/services/server_service'
import {
  createServerValidator,
  getServerStatsValidator,
  getServerValidator,
} from '#apps/servers/validators/server'
import ServerPolicy from '#apps/servers/policies/server_policy'

@inject()
export default class ServersController {
  constructor(private serverService: ServerService) {}

  /**
   * Display a list of resource
   */
  async index({ bouncer, request }: HttpContext) {
    await bouncer.with(ServerPolicy).authorize('view' as never)
    const dto = await request.validateUsing(getServerValidator)

    return this.serverService.findAll(dto)
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
