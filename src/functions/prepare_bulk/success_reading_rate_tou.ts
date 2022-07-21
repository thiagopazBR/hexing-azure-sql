import { check_char, check_real } from '../sql_data_type_validation'
import { ICsvData } from '../../interfaces/ICsvData'
import { Table, Int, Date, Real, Char } from 'mssql'
import { check_device_id } from './check_device_id'

// 40197

export const success_reading_rate_tou = (csv_content: ICsvData[]): Table => {
  const table: Table = new Table('Persons')

  table.columns.add('DATE_', Date)
  table.columns.add('DEVICE_ID', Int, { nullable: false })
  table.columns.add('SUCCESS_RATE', Real)
  table.columns.add('WHITELISTED', Char, { length: 3 })

  const device_ids: { [key: string]: boolean } = {}

  let i = csv_content.length

  while (i--) {
    const row = csv_content[i]

    const device_id = row['METER_ID']

    const res_check_device_id: string | boolean = check_device_id(device_id)
    if (res_check_device_id === false) continue
    if (device_ids[res_check_device_id as string] !== undefined) continue
    device_ids[res_check_device_id as string] = true

    // 2022-05-15 00:00:00 to 2022-05-15
    const date_ = row['SYN_DATE'] ? row['SYN_DATE'].split(' ')[0] : undefined

    const success_rate = check_real(row['SUCCESS_RATE'])
    const whitelisted = check_char(row['WHITELISTED'], 3)

    table.rows.add(date_, device_id, success_rate, whitelisted)
  }

  return table
}
