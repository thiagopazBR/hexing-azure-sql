import { quotation } from '../quotation_insert_values'
import { ICsvData } from '../../interfaces/ICsvData'

const success_reading_rate = (data: ICsvData): string => {
  const table_name = 'COPEL_SUCCESS_READING_RATE_TOU'

  const output = `INSERT INTO ${table_name} (
      DATE_,
      DEVICE_ID,
      SUCCESS_RATE,
      WHITELISTED
    )

    values (
      ${quotation(data['SYN_DATE'])},
      ${quotation(data['METER_ID'])},
      ${quotation(data['SUCCESS_RATE'])},
      ${quotation(data['WHITELISTED'])}
    )
  `

  return output.replace(/(?:\r\n|\r|\n)/g, '')
}

export { success_reading_rate }
