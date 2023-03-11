// import libraries
import Ajv, { ErrorObject } from 'ajv'
import { NextFunction, Request, Response } from 'express'
import { Obj } from '../../conf/types'
// const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const ajv = new Ajv({ allErrors: true })
import { create_user, create_account, create_role, sign_up, update_account, update_role, update_user } from './schemas'

// import schemas
ajv.addSchema(create_user, 'new-user')
ajv.addSchema(update_user, 'update-user')
ajv.addSchema(create_role, 'new-role')
ajv.addSchema(update_role, 'update-role')
ajv.addSchema(create_account, 'create-account')
ajv.addSchema(update_account, 'update-account')
ajv.addSchema(sign_up, 'sign-up')

/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
const errorResponse = (schemaErrors: ErrorObject<string, Record<string, any>, unknown>[] | null | undefined): Obj => {
  let r: Obj = {}
  if (schemaErrors) {
    const errors = schemaErrors.map((error) => {
      return {
        path: error.instancePath.substring(1),
        key: error.keyword,
        message: error.message,
      }
    })
    r = {
      success: false,
      message: 'invalid json schema',
      errors: errors,
    }
  }
  return r
}

/**
 * Validates incoming request bodies against the given schema,
 * providing an error response when validation fails
 * @param  {String} schemaName - name of the schema to validate
 */
export const validateSchema = (schemaName: string) => {
  return (req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | void => {
    const valid: boolean = ajv.validate(schemaName, req.body)
    if (!valid) {
      res.status(403).send(errorResponse(ajv.errors))
    }
    next()
  }
}
