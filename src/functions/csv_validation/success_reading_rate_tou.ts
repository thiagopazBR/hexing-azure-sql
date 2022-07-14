import { check_int, check_char, check_real } from '../sql_data_type_validation'
import { ICsvData } from '../../interfaces/ICsvData'

export const success_reading_rate_tou = (data: ICsvData) => {
  const output: ICsvData = {}
  output['SYN_DATE'] = data['SYN_DATE'] ? data['SYN_DATE'].split(' ')[0] : undefined // 2022-05-15 00:00:00 to 2022-05-15
  output['METER_ID'] = check_int(data['METER_ID'])
  output['SUCCESS_RATE'] = check_real(data['SUCCESS_RATE'])
  output['WHITELISTED'] = check_char(data['WHITELISTED'], 3)

  return output
}
