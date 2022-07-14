import { join } from 'path'
import { strict as assert } from 'assert'

const get_filename = (date: string, target_script: string, files_path: string): string => {
  const target_env = `${target_script.toUpperCase()}_FILE`

  assert(process.env[target_env], `${target_env} is invalid or undefined`)

  const file_name = process.env[target_env].replace('YYYY-MM-DD', date)

  // COMMISSIONING_REPORT_FILE = YYYY-MM-DD_commissioning_report.csv
  const csv_full_name = join(files_path, file_name)

  return csv_full_name
}

export { get_filename }
