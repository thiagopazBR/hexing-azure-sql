import { ICsvData } from '../interfaces/ICsvData'

const data_validation_commissioning_report = (data: ICsvData) => {
  data['Date'] = data['Date'] ? data['Date'].split(' ')[0] : undefined // 2022-05-15 00:00:00 to 2022-05-15
  data['Device ID'] = check_length(data['Device ID'], 16)
  data['Device Model'] = check_length(data['Device Model'], 40)
  data['Device Type'] = check_length(data['Device Type'], 40)
  data['IP'] = check_length(data['IP'], 150)
  data['Firmware Version'] = check_length(data['Firmware Version'], 100)
  data['Meter Version'] = check_length(data['Meter Version'], 100)
  data['Gateway ID'] = check_length(data['Gateway ID'], 16)
  data['Gateway IP'] = check_length(data['Gateway IP'], 40)
  data['Parent'] = check_length(data['Parent'], 16)
  data['RSSI'] = check_length(data['RSSI'], 16)
  data['LQI'] = check_length(data['LQI'], 16)
  data['Device State'] = check_length(data['Device State'], 16)
  data['Online Rate'] = check_length(data['Online Rate'], 16)
  data['Total Offline Time'] = check_length(data['Total Offline Time'], 100)
  data['Registration Time'] = check_length(data['Registration Time'], 16)
  data['Route Level'] = check_length(data['Route Level'], 16)
  // data['Last Commmunication Time'] = data['Last Commmunication Time']
  // data['Last Data Time'] = data['Last Data Time']
  data['Active energy(+) total [Daily]'] = check_length(
    data['Active energy(+) total [Daily]'],
    40
  )
  data['Active energy (+) tariff1 [Daily]'] = check_length(
    data['Active energy (+) tariff1 [Daily]'],
    40
  )
  data['Active energy (+) tariff2 [Daily]'] = check_length(
    data['Active energy (+) tariff2 [Daily]'],
    40
  )
  data['Active energy (+) tariff3 [Daily]'] = check_length(
    data['Active energy (+) tariff3 [Daily]'],
    40
  )
  data['Active energy (+) tariff4 [Daily]'] = check_length(
    data['Active energy (+) tariff4 [Daily]'],
    40
  )
  data['Active energy(-) total [Daily]'] = check_length(
    data['Active energy(-) total [Daily]'],
    40
  )
  data['Active energy(-) tariff1 [Daily]'] = check_length(
    data['Active energy(-) tariff1 [Daily]'],
    40
  )
  data['Active energy(-) tariff2 [Daily]'] = check_length(
    data['Active energy(-) tariff2 [Daily]'],
    40
  )
  data['Active energy(-) tariff3 [Daily]'] = check_length(
    data['Active energy(-) tariff3 [Daily]'],
    40
  )
  data['Active energy(-)'] = check_length(data['Active energy(-)'], 40)
  // data['First Communication Time'] = data['First Communication Time']

  return data
}

const check_length = (x: string, l: number): string | undefined => {
  if (x)
    if (x.trim().length > l) return undefined
    else return x.trim()
  else return undefined
}

export { data_validation_commissioning_report }
