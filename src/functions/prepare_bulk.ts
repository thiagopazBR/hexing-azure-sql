import { ICsvData } from '../interfaces/ICsvData'
import { commissioning_report } from './prepare_bulk/commissioning_report'
import { success_reading_rate_tou } from './prepare_bulk/success_reading_rate_tou'

// eslint-disable-next-line  @typescript-eslint/ban-types
const prepare_bulk: { [key: string]: Function } = {
  commissioning_report: (csv_content: ICsvData[]) => {
    const output = commissioning_report(csv_content)
    return output
  },
  success_reading_rate_tou: (csv_content: ICsvData[]) => {
    const output = success_reading_rate_tou(csv_content)
    return output
  }
}

export { prepare_bulk }
