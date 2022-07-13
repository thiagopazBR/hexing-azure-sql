import { ICsvData } from '../interfaces/ICsvData'
import { commissioning_report } from './prepare_query/commissioning_report'
import { success_reading_rate } from './prepare_query/success_reading_rate'

// eslint-disable-next-line  @typescript-eslint/ban-types
const prepare_query: { [key: string]: Function } = {
  commissioning_report: (data: ICsvData): string => {
    return commissioning_report(data)
  },

  success_reading_rate: (data: ICsvData): string => {
    return success_reading_rate(data)
  }
}

export { prepare_query }
