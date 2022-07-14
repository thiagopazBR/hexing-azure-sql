import { ICsvData } from '../interfaces/ICsvData'
import { commissioning_report } from './csv_validation/commissioning_report'
import { success_reading_rate_tou } from './csv_validation/success_reading_rate_tou'

// eslint-disable-next-line  @typescript-eslint/ban-types
const csv_validation: { [key: string]: Function } = {
  commissioning_report: (data: ICsvData): ICsvData => {
    return commissioning_report(data)
  },
  success_reading_rate_tou: (data: ICsvData): ICsvData => {
    return success_reading_rate_tou(data)
  }
}

export { csv_validation }
