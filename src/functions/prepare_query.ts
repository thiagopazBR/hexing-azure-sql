import { ICsvData } from '../interfaces/ICsvData'

const prepare_query = (date: string, data: ICsvData): string => {
  const table_name = 'COPEL_COMMISSIONING_REPORT'
  // table_name += date.replace(/-/g, '') // 2022-05-15 to 20220515

  const output = `INSERT INTO ${table_name} (
    DATE_,
    DEVICE_ID,
    DEVICE_TYPE,
    GATEWAY_ID,
    PARENT,
    RSSI,
    LQI,
    DEVICE_STATE,
    ONLINE_RATE,
    REGISTRATION_TIME,
    ROUTE_LEVEL,
    LAST_COMMUNICATION_TIME,
    LAST_DATA_TIME
  )

    values (
      ${quotation(data['Date'])},
      ${quotation(data['Device ID'])},
      ${quotation(data['Device Type'])},
      ${quotation(data['Gateway ID'])},
      ${quotation(data['Parent'])},
      ${quotation(data['RSSI'])},
      ${quotation(data['LQI'])},
      ${quotation(data['Device State'])},
      ${quotation(data['Online Rate'])},
      ${quotation(data['Registration Time'])},
      ${quotation(data['Route Level'])},
      ${quotation(data['Last Commmunication Time'])},
      ${quotation(data['Last Data Time'])}
    )
  `

  return output.replace(/(?:\r\n|\r|\n)/g, '')
}

const quotation = (x: string | undefined): string | undefined => {
  if (x) return `'${x}'`
  else return 'null'
}

export { prepare_query }
