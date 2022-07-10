import moment from 'moment'

// type _Date = `${number}${number}${number}${number}-${number}${number}-${number}${number}`
import { IDate } from '../interfaces/IDate'

export const check_date_format = (d: IDate, date_format = 'YYYY-MM-DD'): boolean => {
  if (moment(d, date_format, true).isValid()) return true
  else throw new Error('Error: Incorrect date format. It should be YYYY-MM-DD')
}

export const check_if_date_is_greater_than = (d1: string, d2: string): boolean => {
  const _diff = moment(d2).diff(moment(d1), 'days')

  if (_diff >= 0) return true
  else throw new Error('Error: Start date cannot be greater than end date')
}

export const change_date_format = (d: string, date_format = 'YYYY-MM-DD'): string => {
  return moment(d).format(date_format)
}

/**
 * @param startDate The start date
 * @param endDate The end date
 */
export const generate_date_range = (
  startDate: string,
  endDate: string,
  date_format = 'YYYY-MM-DD'
): IDate[] => {
  const fromDate = moment(startDate)
  const toDate = moment(endDate)
  const diff = toDate.diff(fromDate, 'days') + 1

  const range: Array<IDate> = []

  for (let i = 0; i < diff; i++) {
    const d = <IDate>moment(startDate).add(i, 'days').format(date_format)
    range.push(d)
  }

  return range
}
