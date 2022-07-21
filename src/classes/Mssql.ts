import * as mssql from 'mssql'
import { Logger } from 'winston'

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

  target_script: string
  logger: Logger

  async init(target_script: string, logger: Logger): Promise<void> {
    this.target_script = target_script
    this.logger = logger

    this.check_env_variables()

    try {
      this.connection = await mssql.connect(config)
    } catch (err) {
      logger.error(`MSSQL - ${target_script} - ${err}`)
      process.exit(1)
    }
  }

  public async query(query: string, date: string) {
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

    this.logger.error(`MSSQL - ${this.target_script} - ${date} ${result.toString()}`)
    process.exit(1)
  }

  public async bulk(table: mssql.Table, date: string) {
    const request = new mssql.Request()
    try {
      await request.bulk(table)
      this.logger.info(
        `${this.target_script} - ${date} - ${table.rows.length} rows added to ${this.target_script} table`
      )
      return Promise.resolve(true)
    } catch (error) {
      this.logger.error(`MSSQL - ${this.target_script} - ${date} - bulk - ${error.toString()}`)
      return Promise.resolve(false)
    }
  }

  public close(): void {
    this.connection.close()
  }

  private check_env_variables(): void {
    this.validate_env_variables('AZURE_DB_HOST', process.env.AZURE_DB_HOST)
    this.validate_env_variables('AZURE_DB_NAME', process.env.AZURE_DB_NAME)
    this.validate_env_variables('AZURE_DB_USER', process.env.AZURE_DB_USER)
    this.validate_env_variables('AZURE_DB_PASS', process.env.AZURE_DB_PASS)
  }

  private validate_env_variables(env_var_name: string, env_var: string | undefined) {
    if (typeof env_var != 'string') {
      this.logger.error(
        `MSSQL - ${this.target_script} - ${env_var_name} env variabe is invalid or undefined`
      )
      process.exit(1)
    }
  }
}
