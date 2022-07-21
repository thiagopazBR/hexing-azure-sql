import { strict as assert } from 'assert'
import * as mssql from 'mssql'
import { Logger } from 'winston'

assert(process.env.AZURE_DB_HOST, 'AZURE_DB_HOST is invalid or undefined')
assert(process.env.AZURE_DB_NAME, 'AZURE_DB_NAME is invalid or undefined')
assert(process.env.AZURE_DB_USER, 'AZURE_DB_USER is invalid or undefined')
assert(process.env.AZURE_DB_PASS, 'AZURE_DB_PASS is invalid or undefined')

const config = {
  database: process.env.AZURE_DB_NAME,
  options: {
    encrypt: true, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  },
  password: process.env.AZURE_DB_PASS,
  pool: {
    idleTimeoutMillis: 30000,
    max: 10,
    min: 0
  },
  requestTimeout: 60000,
  server: process.env.AZURE_DB_HOST,
  user: process.env.AZURE_DB_USER
}

export class Mssql {
  connection: mssql.ConnectionPool

  async init(date: string, target_script: string, logger: Logger): Promise<void> {
    try {
      this.connection = await mssql.connect(config)
    } catch (err) {
      logger.error(`MSSQL - ${target_script} - ${date} ${err}`)
      process.exit(1)
    }
  }

  public async query(query: string, start_date: string, target_script: string, logger: Logger) {
    const retries = 3
    let i = 1
    let success = false

    let result: mssql.IResult<object>

    while (i <= retries)
      try {
        result = await this.connection.query(query)
        success = true
        break
      } catch (error) {
        result = error
        i = i + 1
        await new Promise(resolve => setTimeout(resolve, 60000)) // sleep
      }

    if (success) return Promise.resolve(result)

    logger.error(`MSSQL - ${target_script} - ${start_date} ${result.toString()}`)
    process.exit(1)
  }

  public async bulk(table: mssql.Table, start_date: string, target_script: string, logger: Logger) {
    const request = new mssql.Request()
    try {
      await request.bulk(table)
      logger.info(
        `${target_script} - ${start_date} - ${table.rows.length} rows added to ${target_script} table`
      )
      return Promise.resolve(true)
    } catch (error) {
      logger.error(`MSSQL - ${target_script} - ${start_date} - bulk - ${error.toString()}`)
      return Promise.resolve(false)
    }
  }
}
