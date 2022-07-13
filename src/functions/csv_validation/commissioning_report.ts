import { check_int, check_char, check_real, check_tinyint } from '../sql_data_type_validation'
import { ICsvData } from '../../interfaces/ICsvData'

export const commissioning_report = (data: ICsvData) => {
  const output: ICsvData = {}
  output['Date'] = data['Date'] ? data['Date'].split(' ')[0] : undefined // 2022-05-15 00:00:00 to 2022-05-15
  output['Device ID'] = check_int(data['Device ID'])
  // output['Device Model'] = check_length(data['Device Model'], 40)
  output['Device Type'] = check_char(data['Device Type'], 5) // AP, Relay or Meter
  // output['IP'] = check_length(data['IP'], 150)
  // outpu['Firmware Version'] = check_length(data['Firmware Version'], 100)
  // output['Meter Version'] = check_length(data['Meter Version'], 100)
  output['Gateway ID'] = check_int(data['Gateway ID'])
  // output['Gateway IP'] = check_length(data['Gateway IP'], 40)
  output['Parent'] = check_int(data['Parent'])
  output['RSSI'] = check_real(data['RSSI'])
  output['LQI'] = check_tinyint(data['LQI'])
  output['Device State'] = check_char(data['Device State'], 7)
  output['Online Rate'] = check_real(data['Online Rate'])
  // output['Total Offline Time'] = check_length(data['Total Offline Time'], 100)
  output['Registration Time'] = data['Registration Time']
  output['Route Level'] = check_tinyint(data['Route Level'])
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
