import { existsSync } from 'fs'
import 'dotenv/config'
import { join } from 'path'
import { Mssql } from './classes/Mssql'
import * as date_validation from './functions/date_validations'
import { csv_validation } from './functions/csv_validation'
import { prepare_create_table } from './functions/prepare_create_table'
import { read_csv } from './functions/read_csv'
import { prepare_query } from './functions/prepare_query'
import { args_validation } from './functions/args_validation'
import { get_filename } from './functions/get_filename'
import { logger } from './functions/logger'

process.on('uncaughtException', err => {
  if (err.stack !== undefined) logger.error(err.stack)
  else logger.error(`${err.name}: ${err.message}`)
  process.exit(1)
})
// .on('unhandledRejection', (reason, p) => {
//   console.log('p')
//   logger.error(`${reason.toString()} ${p}`)
//   process.exit(1)
// })

const args = args_validation(process.argv.slice(2))

/* target_script can be: commissioning_report, alarm_history, ect... */
const target_script = args.target
const start_date = args.start_date
const end_date = args.end_date

/* const files_path: string = path.dirname(__filename) */
const files_path = join(__dirname, '/files') // Dir where is commissioning_report.csv files

date_validation.check_date_format(start_date)
date_validation.check_date_format(end_date)
date_validation.check_if_date_is_greater_than(start_date, end_date)

/*
 * ['2022-01-01', '2022-01-02', '2022-01-03', '2022-01-04', ...]
 */
const date_range = date_validation.generate_date_range(start_date, end_date)

;(async () => {
  const mssql = new Mssql()
  await mssql.init(start_date, target_script, logger)

  for (const date of date_range) {
    console.log(date)
    const csv_file_path = get_filename(date, target_script, files_path)

    if (!existsSync(csv_file_path)) {
      logger.error(`index.ts - ${target_script} - ${date}_${target_script}.csv file does not exists}`)
      continue
    }

    const csv_content = await read_csv(csv_file_path)

    // eslint-disable-next-line  no-constant-condition
    if (0 > 1) {
      // Yes, I know. I'm forcing to ignorer it
      const create_table = prepare_create_table[target_script](date)
      await mssql.query(create_table, date, target_script, logger)
    }

    const device_ids: { [key: string]: boolean } = {}

    let i = csv_content.length
    while (i--) {
      const row = csv_content[i]

      if (target_script in ['commissioning_report', 'success_reading_rate_tou']) {
        let _device_id: string

        if (target_script == 'commissioning_report') _device_id = row['Device ID']
        else if (target_script == 'success_reading_rate_tou') _device_id = row['METER_ID']

        const output_device_id: string = check_device_id(_device_id)
        if (output_device_id == 'error') continue
        if (device_ids[output_device_id] !== undefined) continue
        device_ids[output_device_id] = true
      }

      const [row_validated, error] = csv_validation[target_script](row)

      // Checking if has some problems if deviceid or other NOT NULL columns
      if (error) continue
      // if (error) { console.log(row); console.log(row_validated); continue }

      const query: string = prepare_query[target_script](row_validated)
      await mssql.query(query, date, target_script, logger)
      // console.log(date, row['Device ID'], i)
    }
  }
})()
// const r = await mssql.select()
// r.recordset.forEach(v => console.log(v))

const check_device_id = (device_id: string): string => {
  if (!device_id.match(/^[0-9]+$/)) return 'error'

  const d: number = parseInt(device_id)
  if (d < -2147483648 || d > 2147483647) return 'error'

  if (device_id.startsWith('0000')) while (device_id.charAt(0) === '0') device_id = device_id.slice(1)

  if (device_id.length < 8) return 'error'

  return device_id
}
