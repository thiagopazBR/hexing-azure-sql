import { join } from 'path'
import { execSync } from 'child_process'
import { strict as assert } from 'assert'
import { createLogger, format, transports } from 'winston'

assert(process.env.LOG_DIR, 'LOG_DIR is invalid or undefined')
assert(process.env.LOG_FILE_NAME, 'LOG_FILE_NAME is invalid or undefined')

// Get GMT Ex: -03
const gmt = execSync('date +"%Z"').toString().trim()

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({
      filename: join(process.env.LOG_DIR, process.env.LOG_FILE_NAME),
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.align(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${gmt} [${level.toUpperCase()}]: ${message}`
        })
      )
    })
  ]
})

// const add_logger_console = (logger_: Logger): void => {
//   if (process.env.NODE_ENV === 'production') return

//   logger_.add(
//     new transports.Console({
//       format: format.simple()
//     })
//   )
// }

export { logger }
