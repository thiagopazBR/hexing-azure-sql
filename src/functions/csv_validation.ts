import { ICsvData } from '../interfaces/ICsvData'

// eslint-disable-next-line  @typescript-eslint/ban-types
export const csv_validation: { [key: string]: Function } = {
  commissioning_report: (data: ICsvData): ICsvData => {
    return commissioning_report(data)
  }
}

const commissioning_report = (data: ICsvData) => {
  const output: ICsvData = {}
  output['Date'] = data['Date'] ? data['Date'].split(' ')[0] : undefined // 2022-05-15 00:00:00 to 2022-05-15
  output['Device ID'] = check_int(data['Device ID']) ? data['Device ID'] : undefined
  // output['Device Model'] = check_length(data['Device Model'], 40)
  output['Device Type'] = check_char(data['Device Type'], 5) // AP, Relay or Meter
  // output['IP'] = check_length(data['IP'], 150)
  // outpu['Firmware Version'] = check_length(data['Firmware Version'], 100)
  // output['Meter Version'] = check_length(data['Meter Version'], 100)
  output['Gateway ID'] = check_int(data['Gateway ID']) ? data['Gateway ID'] : undefined
  // output['Gateway IP'] = check_length(data['Gateway IP'], 40)
  output['Parent'] = check_int(data['Parent']) ? data['Parent'] : undefined
  output['RSSI'] = check_real(data['RSSI'])
  output['LQI'] = check_tinyint(data['LQI']) ? data['LQI'] : undefined
  output['Device State'] = check_char(data['Device State'], 7) ? data['Device State'] : undefined
  output['Online Rate'] = check_real(data['Online Rate'])
  // output['Total Offline Time'] = check_length(data['Total Offline Time'], 100)
  output['Registration Time'] = data['Registration Time']
  output['Route Level'] = check_tinyint(data['Route Level']) ? data['Route Level'] : undefined
  output['Last Commmunication Time'] = data['Last Commmunication Time']
  output['Last Data Time'] = data['Last Data Time']
  // output['Active energy(+) total [Daily]'] = check_length(data['Active energy(+) total [Daily]'], 40)
  // output['Active energy (+) tariff1 [Daily]'] = check_length(data['Active energy (+) tariff1 [Daily]'], 40)
  // output['Active energy (+) tariff2 [Daily]'] = check_length(data['Active energy (+) tariff2 [Daily]'], 40)
  // output['Active energy (+) tariff3 [Daily]'] = check_length(data['Active energy (+) tariff3 [Daily]'], 40)
  // output['Active energy (+) tariff4 [Daily]'] = check_length(data['Active energy (+) tariff4 [Daily]'], 40)
  // output['Active energy(-) total [Daily]'] = check_length(data['Active energy(-) total [Daily]'], 40)
  // output['Active energy(-) tariff1 [Daily]'] = check_length(data['Active energy(-) tariff1 [Daily]'], 40)
  // output['Active energy(-) tariff2 [Daily]'] = check_length(data['Active energy(-) tariff2 [Daily]'], 40)
  // output['Active energy(-) tariff3 [Daily]'] = check_length(data['Active energy(-) tariff3 [Daily]'], 40)
  // output['Active energy(-)'] = check_length(data['Active energy(-)'], 40)
  // output['First Communication Time'] = data['First Communication Time']

  return output
}

// const check_length = (x: string, l: number): string | undefined => {
//   if (x)
//     if (x.trim().length > l) return undefined
//     else return x.trim()
//   else return undefined
// }

const check_char = (x: string, l: number): string | undefined => {
  if (x)
    if (x.trim().length > l) return undefined
    else return x.trim()
  else return undefined
}

const check_int = (data: string): boolean => {
  if (!data.match(/^[0-9]+$/)) return false
  const int: number = parseInt(data)

  if (int < -2147483648 || int > 2147483647) return false
  return true
}

const check_real = (data: string): string | undefined => {
  // Remove % sign of online rate and anythin less number, dash and dot
  const real = data.replace(/[^0-9.-]+/g, '')

  if (real.match(/^-?(0|[1-9]\d*)(\.\d+)?$/)) return real
  return undefined
}

const check_tinyint = (data: string): boolean => {
  if (!data.match(/^[0-9]+$/)) return false
  const tinyint: number = parseInt(data)

  if (tinyint > -1 && tinyint < 256) return true
  return false
}
