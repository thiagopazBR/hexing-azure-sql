import yargs from 'yargs/yargs'
import { IArgs } from '../interfaces/IArgs'
import { Logger } from 'winston'

const check_args = (args: string[], logger: Logger): IArgs | Promise<IArgs> => {
  const argv = yargs(args)
    .options({
      end_date: {
        alias: 'ed',
        describe: 'Start Date. Format "YYYY-MM-DD"',
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
        choices: ['commissioning_report', 'success_reading_rate_tou'] as const,
        demandOption: true,
        describe: '',
        type: 'string'
      }
    })
    .fail(msg => {
      logger.error(`${msg.toString().replace('\n', '').trim()}`)
      process.exit(1)
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

const args_validation = (args: string[], logger: Logger) => {
  const output = check_args(args, logger) as IArgs
  return output
}

export { args_validation }
