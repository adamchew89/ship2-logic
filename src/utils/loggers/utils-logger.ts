import fs from "fs";
import winston from "winston";
import ENV from "z@Utils/env/utils-env";

const logDir = "logs";
const logDirAll = `${logDir}/all`;
const logDirError = `${logDir}/error`;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
  fs.mkdirSync(logDirAll);
  fs.mkdirSync(logDirError);
}

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

export const level = (isDev: boolean = ENV.isDevelopment) =>
  isDev ? "debug" : "http";

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
});

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: `${logDirError}/error_${
      new Date().toISOString().split("T")[0]
    }.log`,
    level: "error",
  }),
  new winston.transports.File({
    filename: `${logDirAll}/all_${new Date().toISOString().split("T")[0]}.log`,
  }),
];

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default Logger;
