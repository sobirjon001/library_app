// import libraries
const express = require("express");
const app = express();
const https = require("https");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const swagger_ui = require("swagger-ui-express");
const deploy_database = require("./api/database/database_deployment.js");

// API server settings
const env = process.env.ENV || "-dev";
const http_port = process.env.HTTP_PORT || 7000;
const https_port = process.env.HTTPS_PORT || 7443;
const credentials = {
  key: fs.readFileSync(path.resolve(__dirname, "ssl/private.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "ssl/certificate.crt")),
};
const user_router = require("./api/users_microservice/users.router");

// app settings
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cors());

// TO DO implement web server app
// app.use(`/app${env}`, express.static(path.resolve(__dirname, "app")));

// TO DO implement swagger documentation
// app.use(
//   `/doc${env}`,
//   swagger_ui.serve,
//   swagger_ui.setup(path.resolve(__dirname, "swagger/swagger.json"))
// );

// sanity check
app.get(`/api${env}/hello`, (rec, res) => {
  res.status(200);
  res.send("API server is up and running!");
});
app.post(`/api${env}/hello`, (rec, res) => {
  res.status(200);
  res.json({
    success: true,
    message: "API server is up and running!",
  });
});

// users microservice
app.use(`/api${env}/users`, user_router);

// start server
const start_server = () => {
  app.listen(http_port, (err) => {
    if (err) return console.log(err);
    console.log(`http server is listening on port ${http_port}`);
  });
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const https_server = https.createServer(credentials, app);
  https_server.listen(https_port, (err) => {
    if (err) return console.log(err);
    console.log(`https server is listening on port ${https_port}`);
  });
};

deploy_database(start_server);
