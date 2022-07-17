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
      filename: 'logger.log',
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

export { logger }
