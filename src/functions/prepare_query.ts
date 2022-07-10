import { ICsvData } from '../interfaces/ICsvData'
import { IDate } from '../interfaces/IDate'

const prepare_query = (date: IDate, data: ICsvData): string => {
  let table_name = 'COPEL_COMMISSIONING_REPORT_'
  table_name += date.replace(/-/g, '') // 2022-05-15 to 20220515

  const output = `INSERT INTO ${table_name} (
      DATE_,
      DEVICE_ID,
      DEVICE_MODEL,
      DEVICE_TYPE,
      IP_ADDR,
      FIRMWARE_VERSION,
      METER_VERSION,
      GATEWAY_ID,
      GATEWAY_IP,
      PARENT,
      RSSI,
      LQI,
      DEVICE_STATE,
      ONLINE_RATE,
      TOTAL_OFFLINE_TIME,
      REGISTRATION_TIME,
      ROUTE_LEVEL,
      LAST_COMMMUNICATION_TIME,
      LAST_DATA_TIME,
      ACTIVE_ENERGY_PLUS_SIGN_TOTAL_DAILY,
      ACTIVE_ENERGY_PLUS_SIGN_TARIFF1_DAILY,
      ACTIVE_ENERGY_PLUS_SIGN_TARIFF2_DAILY,
      ACTIVE_ENERGY_PLUS_SIGN_TARIFF3_DAILY,
      ACTIVE_ENERGY_PLUS_SIGN_TARIFF4_DAILY,
      ACTIVE_ENERGY_MINUS_SIGN_TOTAL_DAILY,
      ACTIVE_ENERGY_MINUS_SIGN_TARIFF1_DAILY,
      ACTIVE_ENERGY_MINUS_SIGN_TARIFF2_DAILY,
      ACTIVE_ENERGY_MINUS_SIGN_TARIFF3_DAILY,
      ACTIVE_ENERGY_MINUS_SIGN,
      FIRST_COMMUNICATION_TIME
    )

    values (
      ${quotation(data['Date'])},
      ${quotation(data['Device ID'])},
      ${quotation(data['Device Model'])},
      ${quotation(data['Device Type'])},
      ${quotation(data['IP'])},
      ${quotation(data['Firmware Version'])},
      ${quotation(data['Meter Version'])},
      ${quotation(data['Gateway ID'])},
      ${quotation(data['Gateway IP'])},
      ${quotation(data['Parent'])},
      ${quotation(data['RSSI'])},
      ${quotation(data['LQI'])},
      ${quotation(data['Device State'])},
      ${quotation(data['Online Rate'])},
      ${quotation(data['Total Offline Time'])},
      ${quotation(data['Registration Time'])},
      ${quotation(data['Route Level'])},
      ${quotation(data['Last Commmunication Time'])},
      ${quotation(data['Last Data Time'])},
      ${quotation(data['Active energy(+) total [Daily]'])},
      ${quotation(data['Active energy (+) tariff1 [Daily]'])},
      ${quotation(data['Active energy (+) tariff2 [Daily]'])},
      ${quotation(data['Active energy (+) tariff3 [Daily]'])},
      ${quotation(data['Active energy (+) tariff4 [Daily]'])},
      ${quotation(data['Active energy(-) total [Daily]'])},
      ${quotation(data['Active energy(-) tariff1 [Daily]'])},
      ${quotation(data['Active energy(-) tariff2 [Daily]'])},
      ${quotation(data['Active energy(-) tariff3 [Daily]'])},
      ${quotation(data['Active energy(-)'])},
      ${quotation(data['First Communication Time'])}
    )
  `

  return output.replace(/(?:\r\n|\r|\n)/g, '')
}

const quotation = (x: string | undefined): string | undefined => {
  if (x) return `'${x}'`
  else return 'null'
}

export { prepare_query }
