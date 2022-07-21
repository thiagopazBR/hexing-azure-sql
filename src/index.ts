import { existsSync } from 'fs'
import 'dotenv/config'
import { Mssql } from './classes/Mssql'
import * as date_validation from './functions/date_validation'
import { prepare_bulk } from './functions/prepare_bulk'
import { read_csv } from './functions/read_csv'
import { args_validation } from './functions/args_validation'
import { get_filename } from './functions/get_filename'
import { logger } from './functions/logger'

process.on('uncaughtException', err => {
  if (err.stack !== undefined) logger.error(err.stack)
  else logger.error(`${err.name}: ${err.message}`)
  process.exit(1)
})

const args = args_validation(process.argv.slice(2), logger)

/* target_script can be: commissioning_report, success_reading_rate_tou, ect... */
const target_script = args.target
const start_date = args.start_date
const end_date = args.end_date !== undefined ? args.end_date : start_date

/* const files_path: string = path.dirname(__filename) */
const files_path = '/files' // Dir where is commissioning_report.csv files

date_validation.check_date_format(start_date)
date_validation.check_date_format(end_date)
date_validation.check_if_date_is_greater_than(start_date, end_date)

/*
 * ['2022-01-01', '2022-01-02', '2022-01-03', '2022-01-04', ...]
 */
const date_range = date_validation.generate_date_range(start_date, end_date)

;(async () => {
  const mssql = new Mssql()
  await mssql.init(target_script, logger)

  for (const date of date_range) {
    const csv_file_path = get_filename(date, target_script, files_path)

    if (!existsSync(csv_file_path)) {
      logger.error(`index.ts - ${target_script} - ${date}_${target_script}.csv file does not exists`)
      continue
    }

    const csv_content = await read_csv(csv_file_path)

    const table_for_bulk = prepare_bulk[target_script](csv_content)

    await mssql.bulk(table_for_bulk, date)

    mssql.close()
  }
})()
