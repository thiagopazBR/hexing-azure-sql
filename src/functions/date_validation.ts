import moment from 'moment'
import { Logger } from 'winston'

export const check_date_format = (
  d: string,
  target_script: string,
  logger: Logger,
  date_format = 'YYYY-MM-DD'
): void => {
  if (!moment(d, date_format, true).isValid()) {
    logger.error(`${target_script} - Incorrect date format. It should be ${date_format}. Given: ${d}`)
    process.exit(1)
  }
}

export const check_if_date_is_greater_than = (
  d1: string,
  d2: string,
  target_script: string,
  logger: Logger
): void => {
  const _diff = moment(d2).diff(moment(d1), 'days')

  if (_diff < 0) {
    logger.error(
      `${target_script} - Start date cannot be greater than end date. Given: start_date=${d1}, end_date=${d2}`
    )
    process.exit(1)
  }
}

/**
 * @param startDate The start date
 * @param endDate The end date
 */
export const generate_date_range = (
  startDate: string,
  endDate: string,
  date_format = 'YYYY-MM-DD'
): string[] => {
  const fromDate = moment(startDate)
  const toDate = moment(endDate)
  const diff = toDate.diff(fromDate, 'days') + 1

  const range: Array<string> = []

  for (let i = 0; i < diff; i++) {
    const d = <string>moment(startDate).add(i, 'days').format(date_format)
    range.push(d)
  }

  return range
}
