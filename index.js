const server = require("./src/app");
const { PORT } = process.env;

server.listen(PORT, async () => {
  console.log("Server raised in port: " + PORT);
});
