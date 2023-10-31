import redoc from "redoc-express";
import app from "./app/index.js";
import logger from "./app/config/logger.js";
import pkg from "./app/config/baseConfigs.cjs";
import { errorHandler } from "./app/middlewares/errorHandler.js";
const { port } = pkg;

process.on("uncaughtException", (error) => {
  errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) {
    process.exit(1);
  }
});

// serve your swagger.json file
app.get("/docs/swagger.json", (req, res) => {
  res.sendFile("docs.json", { root: "." });
});

// define title and specUrl location
// serve redoc
app.get(
  "/docs",
  redoc({
    title: "API Docs",
    specUrl: "/docs/swagger.json",
    nonce: "", // <= it is optional,we can omit this key and value
    // we are now start supporting the redocOptions object
    // you can omit the options object if you don't need it
    // https://redocly.com/docs/api-reference-docs/configuration/functionality/
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: "#6EC5AB",
          },
        },
        typography: {
          fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
          fontSize: "16px",
          lineHeight: "1.5",
          code: {
            code: "#87E8C7",
            backgroundColor: "#4D4D4E",
          },
        },
        menu: {
          backgroundColor: "#ffffff",
        },
      },
    },
  })
);

app.listen(port, () => {
  logger.info(`Server running on ${port}`);
});
