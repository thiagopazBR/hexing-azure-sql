import { join } from 'path'

const get_filename = (date: string, target_script: string, files_path: string): string => {
  // Ex: COMMISSIONING_REPORT_FILE = YYYY-MM-DD_commissioning_report.csv
  const file_name = `${date}_${target_script}.csv`

  const csv_full_name = join(files_path, file_name)

  return csv_full_name
}

export { get_filename }
