import { strict as assert } from 'assert'
import * as mssql from 'mssql'

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
  server: process.env.AZURE_DB_HOST,
  user: process.env.AZURE_DB_USER
}

export class Mssql {
  connection: mssql.ConnectionPool

  async init(): Promise<void> {
    try {
      this.connection = await mssql.connect(config)
    } catch (err) {
      console.error('Connection failed: ' + err)
      process.exit()
    }
  }

  public async query(query: string) {
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
      }

    if (success) return Promise.resolve(result)
    else throw new Error(result.toString())
    // else return Promise.reject(result)
  }

  // public async get_AZURE_data(): Promise<IAZUREDataResponse> {
  //   const query = `
  //     SELECT
  //       p.serial,
  //       p.name as peripheral,
  //       pl.idrelayfield as idrelay
  //     FROM
  //       AZURE_peripherals as p
  //     LEFT JOIN
  //       AZURE_plugin_fields_peripheraldeviceconfigurations as pl ON pl.items_id = p.id
  //     WHERE
  //       p.is_deleted != 1
  //       AND p.peripheraltypes_id = '3';`

  //   const result = await this.select(query)
  //   const output: IAZUREDataResponse = {}

  //   for (const r of result.data)
  //     if (r.serial) {
  //       const relay_serial = r.serial
  //       const relay_name = r.peripheral
  //       const id_relay = r.idrelay ? r.idrelay : relay_serial

  //       output[relay_serial] = { id_relay: id_relay, name: relay_name }
  //     }

  //   return Promise.resolve(output)
  // }
}
