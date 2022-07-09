import 'dotenv/config'

import * as path from 'path'

import { Mssql } from './classes/Mssql'
import { data_validation_commissioning_report } from './functions/data_validation'
import { read_csv } from './functions/read_csv'

// const script_dir: string = path.dirname(__filename)
const target_path = '/workspaces/hexing-azure-sql/files' // Dir where is commissioning_report.csv files

const csv_file_path = path.join(
  target_path,
  '2022-06-07_commissioning_report.csv'
)

const mssql = new Mssql()

;(async () => {
  await mssql.init()
  // let r = await mssql.select()
  // r.recordset.forEach(v => console.log(v))

  const csv_content = await read_csv(csv_file_path)
  let i = csv_content.length
  while (i--) {
    let row = csv_content[i]
    row = data_validation_commissioning_report(row)
    // const device_type: string = row['Device Type']
    // const relay_orca_serial: string = row['Device ID']
    // const last_communication_time: string = row['Last Commmunication Time']

    console.log(row)
  }
})()
