import morgan, { StreamOptions } from "morgan";
import ENV from "z@Utils/env/utils-env";
import Logger from "z@Utils/loggers/utils-logger";

export const stream: StreamOptions = {
  write: (message) => Logger.http(message),
};

export const skip = () => !ENV.isDevelopment;

const middlewareLogs = morgan(
  `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`,
  { stream }
);

export default middlewareLogs;
