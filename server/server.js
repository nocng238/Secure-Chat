require("dotenv").config();
const http = require("./src/app");
const logger = require("./src/v1/utils/logger");

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => {
  logger.info(`WSV start with port ${PORT}`);
});
