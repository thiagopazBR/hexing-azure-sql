import { existsSync } from 'fs'
import 'dotenv/config'

import * as path from 'path'

import { Mssql } from './classes/Mssql'
import * as date_validation from './functions/date_validations'
import { csv_validation } from './functions/csv_validation'
import { prepare_create_table } from './functions/prepare_create_table'
import { read_csv } from './functions/read_csv'
import { prepare_query } from './functions/prepare_query'
import { args_validation } from './functions/args_validation'

const args = args_validation(process.argv.slice(2))

/* target_script can be: commissioning_report, alarm_history, ect... */
const target_script = args.target
const start_date = args.start_date
const end_date = args.end_date

/* const script_dir: string = path.dirname(__filename) */
const target_path = '/workspaces/hexing-azure-sql/files' // Dir where is commissioning_report.csv files

date_validation.check_date_format(start_date)
date_validation.check_date_format(end_date)
date_validation.check_if_date_is_greater_than(start_date, end_date)

/*
 * ['2022-01-01', '2022-01-02', '2022-01-03', '2022-01-04', ...]
 */
const date_range = date_validation.generate_date_range(start_date, end_date)

;(async () => {
  const mssql = new Mssql()
  await mssql.init()

  for (const date of date_range) {
    console.log(date)
    const csv_file_path = path.join(target_path, `${date}_${target_script}.csv`)

    if (!existsSync(csv_file_path)) {
      console.log(`${date}_${target_script}.csv file does not exists`)
      continue
    }

    const csv_content = await read_csv(csv_file_path)

    // eslint-disable-next-line  no-constant-condition
    if (0 > 1) {
      // Yes, I know. I'm forcing to ignorer it
      const create_table = prepare_create_table[target_script](date)
      await mssql.select(create_table)
    }

    const device_ids: { [key: string]: boolean } = {}

    let i = csv_content.length
    while (i--) {
      let row = csv_content[i]

      if (target_script == 'commissioning_report') {
        const output_device_id: string = check_device_id(row['Device ID'])
        if (output_device_id == 'error') continue
        if (device_ids[output_device_id] !== undefined) continue
        device_ids[output_device_id] = true
      }
      row = csv_validation[target_script](row)
      const query: string = prepare_query(date, row)
      await mssql.select(query)
      // console.log(date, row['Device ID'], i)
    }
  }
})()
// const r = await mssql.select()
// r.recordset.forEach(v => console.log(v))

const check_device_id = (device_id: string): string => {
  if (!device_id.match(/^[0-9]+$/)) return 'error'

  if (device_id.length < 8) return 'error'

  const d: number = parseInt(device_id)
  if (d < -2147483648 || d > 2147483647) return 'error'

  if (device_id.startsWith('0000')) while (device_id.charAt(0) === '0') device_id = device_id.slice(1)

  return device_id
}
