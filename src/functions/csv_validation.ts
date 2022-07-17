import { ICsvData } from '../interfaces/ICsvData'
import { commissioning_report } from './csv_validation/commissioning_report'
import { success_reading_rate_tou } from './csv_validation/success_reading_rate_tou'

// eslint-disable-next-line  @typescript-eslint/ban-types
const csv_validation: { [key: string]: Function } = {
  commissioning_report: (data: ICsvData): (ICsvData | boolean)[] => {
    const output = commissioning_report(data)
    const error: boolean = output['Device ID'] ? false : true
    return [output, error]
  },
  success_reading_rate_tou: (data: ICsvData): (ICsvData | boolean)[] => {
    const output = success_reading_rate_tou(data)
    const error: boolean = output['METER_ID'] ? false : true
    return [output, error]
  }
}

export { csv_validation }
