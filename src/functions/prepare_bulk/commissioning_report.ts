import {
  check_int,
  check_char,
  check_real,
  check_tinyint,
  small_datetime
} from '../sql_data_type_validation'
import { ICsvData } from '../../interfaces/ICsvData'
import { Table, Int, Date, Real, Char, TinyInt, SmallDateTime } from 'mssql'
import { check_device_id } from './check_device_id'

export const commissioning_report = (csv_content: ICsvData[]): Table => {
  const table = new Table('Persons2')

  table.columns.add('DATE_', Date)
  table.columns.add('DEVICE_ID', Int, { nullable: false })
  table.columns.add('DEVICE_TYPE', Char, { length: 5 })
  table.columns.add('GATEWAY_ID', Int)
  table.columns.add('PARENT', Int)
  table.columns.add('RSSI', Real)
  table.columns.add('LQI', TinyInt)
  table.columns.add('DEVICE_STATE', Char, { length: 7 })
  table.columns.add('ONLINE_RATE', Real)
  table.columns.add('REGISTRATION_TIME', SmallDateTime)
  table.columns.add('ROUTE_LEVEL', TinyInt)
  table.columns.add('LAST_COMMUNICATION_TIME', SmallDateTime)
  table.columns.add('LAST_DATA_TIME', SmallDateTime)

  const device_ids: { [key: string]: boolean } = {}

  let i = csv_content.length

  while (i--) {
    const row = csv_content[i]

    const device_id = row['Device ID']

    const res_check_device_id: string | boolean = check_device_id(device_id)
    if (res_check_device_id === false) continue
    if (device_ids[res_check_device_id as string] !== undefined) continue
    device_ids[res_check_device_id as string] = true

    // 2022-05-15 00:00:00 to 2022-05-15
    const date_ = row['Date'] ? row['Date'].split(' ')[0] : undefined

    const device_type = check_char(row['Device Type'], 5) // AP, Relay or Meter
    const gateway_id = check_int(row['Gateway ID'])
    const parent = check_int(row['Parent'])
    const rssi = check_real(row['RSSI'])
    const lqi = check_tinyint(row['LQI'])
    const device_state = check_char(row['Device State'], 7)
    const online_rate = check_real(row['Online Rate'])
    const registration_time = small_datetime(row['Registration Time'])
    const route_level = check_tinyint(row['Route Level'])
    const last_commmunication_time = small_datetime(row['Last Commmunication Time'])
    const last_data_time = small_datetime(row['Last Data Time'])

    table.rows.add(
      date_,
      device_id,
      device_type,
      gateway_id,
      parent,
      rssi,
      lqi,
      device_state,
      online_rate,
      registration_time,
      route_level,
      last_commmunication_time,
      last_data_time
    )
  }

  return table
}
