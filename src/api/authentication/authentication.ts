// import libraries
import { verify, sign, JwtPayload, VerifyErrors } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { MysqlError } from 'mysql'
import { compareSync } from 'bcrypt'
import { get_account_info_by_user_login_db } from '../users_microservice/roles.db.service'
import { Access_scope, Obj } from '../../conf/types'

// secretKey options
const secretKey = process.env.SECRET_KEY || 'abc1234'

export const login = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  get_account_info_by_user_login_db(req.body.user_login, (err: MysqlError | null, results: any) => {
    if (err) {
      console.log(err.message)
      return res.status(500).json({
        success: false,
        message: 'Database connection error',
      })
    }
    if (!results) {
      return res.status(401).json({
        success: false,
        message: 'Invalid user_login or password!',
      })
    }
    const result = compareSync(req.body.password, results[0].password)
    if (result) {
      results.password = undefined
      const jsontoken = sign({ result: results }, secretKey, {
        expiresIn: '4h',
      })
      return res.status(200).json({
        success: true,
        message: 'Login successfull',
        token: jsontoken,
      })
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid user_login or password',
      })
    }
  })
}

export const decodeUser = (req: Request, res: Response): Response<any, Record<string, any>> | void => {
  return res.status(200).json({
    success: true,
    message: 'Decode successfull',
    data: req.body.decodedUser.result[0],
  })
}

export const checkToken = (req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | void => {
  const authHeader = req.get('authorization')
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized! Please provide token',
    })
  }
  verify(token, secretKey, (error: VerifyErrors | null, decodedUser: string | JwtPayload | undefined) => {
    if (error) console.log(error.message)
    console.log(decodedUser)
    if (typeof decodedUser !== undefined) req.body.decodedUser = decodedUser
    console.log(req.body)
  })
  next()
}

const error_401 = (
  res: Response,
  restricted_accesses: Access_scope[],
  user_login: string,
  role: string
): Response<any, Record<string, any>> | void => {
  return res.status(401).json({
    success: false,
    message: `Your user_login of '${user_login}' with role of '${role}' has no clearance for '${restricted_accesses.reduce(
      (r: string[], e: Access_scope) => {
        r.push(e.replace('can_', ''))
        return r
      },
      []
    )}'`,
  })
}

export const clearance = (access_scopes: Access_scope[]) => {
  console.log('we are inside clearance')
  return (req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | void => {
    console.log('we are inside return')
    const decodedUser: Obj = req.body.decodedUser.result[0]
    const restricted_accesses: Access_scope[] = access_scopes.filter((p: Access_scope) => !decodedUser[p])

    if (restricted_accesses.length) error_401(res, restricted_accesses, decodedUser.user_login, decodedUser.role)
    else next()
  }
}
