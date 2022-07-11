import yargs from 'yargs/yargs'
import { IArgs } from '../interfaces/IArgs'

const check_args = (args: string[]): IArgs | Promise<IArgs> => {
  const argv = yargs(args)
    .options({
      end_date: {
        alias: 'ed',
        describe: 'Etart Date. Format "YYYY-MM-DD"',
        type: 'string'
      },
      start_date: {
        alias: 'sd',
        demandOption: true,
        describe: 'Start Date. Format "YYYY-MM-DD"',
        type: 'string'
      },
      target: {
        alias: 't',
        choices: ['commissioning_report', 'alert_history', 'tou'] as const,
        demandOption: true,
        describe: '',
        type: 'string'
      }
    })
    .example([
      ['$0 --target "commissioning_report" --start_date "YYYY-MM-DD"', 'For only one day'],
      [
        '$0 --target "commissioning_report" --start_date "YYYY-MM-DD" end_date "YYYY-MM-DD"',
        'For a date range. end_date cannot be greater than start date'
      ]
    ]).argv

  return argv
}

const args_validation = (args: string[]) => {
  const output = check_args(args) as IArgs
  return output
}

export { args_validation }
