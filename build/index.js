"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
require("dotenv/config");
const Mssql_1 = require("./classes/Mssql");
const date_validation = __importStar(require("./functions/date_validations"));
const csv_validation_1 = require("./functions/csv_validation");
const prepare_create_table_1 = require("./functions/prepare_create_table");
const read_csv_1 = require("./functions/read_csv");
const prepare_query_1 = require("./functions/prepare_query");
const args_validation_1 = require("./functions/args_validation");
const get_filename_1 = require("./functions/get_filename");
const logger_1 = require("./functions/logger");
process.on('uncaughtException', err => {
    if (err.stack !== undefined)
        logger_1.logger.error(err.stack);
    else
        logger_1.logger.error(`${err.name}: ${err.message}`);
    process.exit(1);
});
// .on('unhandledRejection', (reason, p) => {
//   console.log('p')
//   logger.error(`${reason.toString()} ${p}`)
//   process.exit(1)
// })
const args = (0, args_validation_1.args_validation)(process.argv.slice(2));
/* target_script can be: commissioning_report, alarm_history, ect... */
const target_script = args.target;
const start_date = args.start_date;
const end_date = args.end_date;
/* const script_dir: string = path.dirname(__filename) */
const files_path = '/workspaces/hexing-azure-sql/files'; // Dir where is commissioning_report.csv files
date_validation.check_date_format(start_date);
date_validation.check_date_format(end_date);
date_validation.check_if_date_is_greater_than(start_date, end_date);
/*
 * ['2022-01-01', '2022-01-02', '2022-01-03', '2022-01-04', ...]
 */
const date_range = date_validation.generate_date_range(start_date, end_date);
(async () => {
    const mssql = new Mssql_1.Mssql();
    await mssql.init(start_date, target_script, logger_1.logger);
    for (const date of date_range) {
        console.log(date);
        const csv_file_path = (0, get_filename_1.get_filename)(date, target_script, files_path);
        if (!(0, fs_1.existsSync)(csv_file_path)) {
            logger_1.logger.error(`index.ts - ${target_script} - ${date}_${target_script}.csv file does not exists}`);
            continue;
        }
        const csv_content = await (0, read_csv_1.read_csv)(csv_file_path);
        // eslint-disable-next-line  no-constant-condition
        if (0 > 1) {
            // Yes, I know. I'm forcing to ignorer it
            const create_table = prepare_create_table_1.prepare_create_table[target_script](date);
            await mssql.query(create_table, date, target_script, logger_1.logger);
        }
        const device_ids = {};
        let i = csv_content.length;
        while (i--) {
            const row = csv_content[i];
            if (target_script in ['commissioning_report', 'success_reading_rate_tou']) {
                let _device_id;
                if (target_script == 'commissioning_report')
                    _device_id = row['Device ID'];
                else if (target_script == 'success_reading_rate_tou')
                    _device_id = row['METER_ID'];
                const output_device_id = check_device_id(_device_id);
                if (output_device_id == 'error')
                    continue;
                if (device_ids[output_device_id] !== undefined)
                    continue;
                device_ids[output_device_id] = true;
            }
            const [row_validated, error] = csv_validation_1.csv_validation[target_script](row);
            // Checking if has some problems if deviceid or other NOT NULL columns
            if (error)
                continue;
            // if (error) { console.log(row); console.log(row_validated); continue }
            const query = prepare_query_1.prepare_query[target_script](row_validated);
            await mssql.query(query, date, target_script, logger_1.logger);
            // console.log(date, row['Device ID'], i)
        }
    }
})();
// const r = await mssql.select()
// r.recordset.forEach(v => console.log(v))
const check_device_id = (device_id) => {
    if (!device_id.match(/^[0-9]+$/))
        return 'error';
    const d = parseInt(device_id);
    if (d < -2147483648 || d > 2147483647)
        return 'error';
    if (device_id.startsWith('0000'))
        while (device_id.charAt(0) === '0')
            device_id = device_id.slice(1);
    if (device_id.length < 8)
        return 'error';
    return device_id;
};
//# sourceMappingURL=index.js.map