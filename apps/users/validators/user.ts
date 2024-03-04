import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

/**
 * Validator to validate the payload when creating
 * a new user.
 */
export const createUserValidator = vine.compile(
  vine.object({
    username: vine.string().unique(async (db, value) => {
      return !(await db.from('users').select('username').where('username', value).first())
    }),
    email: vine.string().email(),
    firstname: vine.string().trim().escape(),
    lastname: vine.string().trim().escape(),
    password: vine.string().trim().escape(),
    roleIds: vine
      .array(
        vine.string().exists(async (db, value) => {
          return !!(await db.from('roles').select('id').where('id', value).first())
        })
      )
      .optional(),
  })
)

export type CreateUserSchema = Infer<typeof createUserValidator>

/**
 * Validator to validate the payload when updating
 * an existing user.
 */
export const updateUserValidator = vine.compile(vine.object({}))
