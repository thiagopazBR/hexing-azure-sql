import { existsSync } from 'fs'
import 'dotenv/config'

import * as path from 'path'

import { Mssql } from './classes/Mssql'
import * as date_validation from './functions/date_validations'
import * as csv_validation from './functions/csv_validation'
import * as prepare_create_table from './functions/prepare_create_table'
import { read_csv } from './functions/read_csv'
import { prepare_query } from './functions/prepare_query'

// const script_dir: string = path.dirname(__filename)
const target_path = '/workspaces/hexing-azure-sql/files' // Dir where is commissioning_report.csv files

const start_date = '2022-06-01'
const end_date = '2022-06-06'

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
    const csv_file_path = path.join(target_path, `${date}_commissioning_report.csv`)

    if (!existsSync(csv_file_path)) {
      console.log(`${date}_commissioning_report.csv file does not exists`)
      continue
    }

    const csv_content = await read_csv(csv_file_path)

    const create_table = prepare_create_table['commissioning_report'](date)
    await mssql.select(create_table)

    let i = csv_content.length
    while (i--) {
      let row = csv_content[i]
      row = csv_validation['commissioning_report'](row)
      const query: string = prepare_query(date, row)
      await mssql.select(query)
      console.log(date, row['Device ID'], i)
    }
  }
})()
// const r = await mssql.select()
// r.recordset.forEach(v => console.log(v))
