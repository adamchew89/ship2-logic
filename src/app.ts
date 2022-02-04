import AllRoutes from "z@Routes/route-root";
import Server from "z@Servers/server";
import ENV from "z@Utils/env/utils-env";
import UtilsLog from "z@Utils/loggers/utils-logger";

export const server = new Server(AllRoutes);

const PORT = 3000;

server.listen(PORT, () => {
  UtilsLog.info(`Running ${ENV.NODE_ENV}-server at https://localhost:${PORT}`);
});
