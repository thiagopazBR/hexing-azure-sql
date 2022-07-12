// eslint-disable-next-line  @typescript-eslint/ban-types
export const prepare_create_table: { [key: string]: Function } = {
  commissioning_report: (date: string): string => {
    return commissioning_report(date)
  }
}

const commissioning_report = (date: string) => {
  let table_name = 'COPEL_COMMISSIONING_REPORT_'
  table_name += date.replace(/-/g, '') // 2022-05-15 to 20220515

  const output = `CREATE TABLE ${table_name} (
    ID INT NOT NULL IDENTITY PRIMARY KEY,
    DATE_ DATE,
    DEVICE_ID VARCHAR(16),
    DEVICE_MODEL VARCHAR(40),
    DEVICE_TYPE VARCHAR(40),
    IP_ADDR VARCHAR(150),
    FIRMWARE_VERSION VARCHAR(100),
    METER_VERSION VARCHAR(100),
    GATEWAY_ID VARCHAR(16),
    GATEWAY_IP VARCHAR(40),
    PARENT VARCHAR(16),
    RSSI VARCHAR(16),
    LQI VARCHAR(16),
    DEVICE_STATE VARCHAR(16),
    ONLINE_RATE VARCHAR(16),
    TOTAL_OFFLINE_TIME VARCHAR(100),
    REGISTRATION_TIME DATETIME,
    ROUTE_LEVEL VARCHAR(16),
    LAST_COMMUNICATION_TIME DATETIME,
    LAST_DATA_TIME DATETIME,
    ACTIVE_ENERGY_PLUS_SIGN_TOTAL_DAILY VARCHAR(40),
    ACTIVE_ENERGY_PLUS_SIGN_TARIFF1_DAILY VARCHAR(40),
    ACTIVE_ENERGY_PLUS_SIGN_TARIFF2_DAILY VARCHAR(40),
    ACTIVE_ENERGY_PLUS_SIGN_TARIFF3_DAILY VARCHAR(40),
    ACTIVE_ENERGY_PLUS_SIGN_TARIFF4_DAILY VARCHAR(40),
    ACTIVE_ENERGY_MINUS_SIGN_TOTAL_DAILY VARCHAR(40),
    ACTIVE_ENERGY_MINUS_SIGN_TARIFF1_DAILY VARCHAR(40),
    ACTIVE_ENERGY_MINUS_SIGN_TARIFF2_DAILY VARCHAR(40),
    ACTIVE_ENERGY_MINUS_SIGN_TARIFF3_DAILY VARCHAR(40),
    ACTIVE_ENERGY_MINUS_SIGN VARCHAR(40),
    FIRST_COMMUNICATION_TIME DATETIME
  )`

  return output.replace(/(?:\r\n|\r|\n)/g, '')
}
