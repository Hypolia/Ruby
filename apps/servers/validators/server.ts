import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import { ServerKey } from '#apps/servers/contracts/index'

/**
 * Validator to validate the payload when creating
 * a new server.ts.
 */
export const createServerValidator = vine.compile(
  vine.object({
    name: vine.string(),
    network: vine.object({
      ip: vine.string(),
      port: vine.number(),
      status: vine.enum(['online', 'offline', 'terminating', 'paused']),
    }),
    pod: vine.object({
      pod_name: vine.string(),
      namespace: vine.string(),
    }),
    image: vine.object({
      repository: vine.string(),
      tag: vine.string(),
    }),
    minecraft_server: vine.object({
      version: vine.string(),
      players: vine.number(),
      max_players: vine.number(),
      world: vine.string(),
      type: vine.string(),
    }),
    parent: vine.object({}),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing server.ts.
 */
export const updateServerValidator = vine.compile(vine.object({}))

export const getServerValidator = vine.compile(
  vine.object({
    type: vine.string().optional(),
    status: vine.string().optional(),
    key: vine
      .enum<(keyof typeof ServerKey)[]>([...(Object.keys(ServerKey) as (keyof typeof ServerKey)[])])
      .optional(),
  })
)

export const getServerStatsValidator = vine.compile(
  vine.object({
    key: vine.enum<(keyof typeof ServerKey)[]>([
      ...(Object.keys(ServerKey) as (keyof typeof ServerKey)[]),
    ]),
    type: vine.string().optional(),
    status: vine.string().optional(),
  })
)

export type CreateServersSchema = Infer<typeof createServerValidator>
export type UpdateServersSchema = Infer<typeof updateServerValidator>
export type GetServersSchema = Infer<typeof getServerValidator>
export type GetServersStatsSchema = Infer<typeof getServerStatsValidator>
