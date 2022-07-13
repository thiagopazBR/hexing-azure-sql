import { quotation } from '../quotation_insert_values'
import { ICsvData } from '../../interfaces/ICsvData'

const commissioning_report = (data: ICsvData): string => {
  const table_name = 'COPEL_COMMISSIONING_REPORT'

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

export { commissioning_report }
