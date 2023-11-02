const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    DB_HOST: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_PASS: Joi.string().required(),
    DB_DIALECT: Joi.string().required(),
    PORT: Joi.number().default(3001),
    DB_URL: Joi.string().required().description("DB url"),
    SALT_ROUNDS: Joi.number().required().description("Salt for hashing"),
    BASE_URL: Joi.string(),
    ENCRYPTION_kEY: Joi.required(),
    API_KEY: Joi.string().required(),
    COOKIE_SECRET: Joi.string().required(),
    COOKIE_NAME: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  cookie_name: envVars.COOKIE_NAME,
  cookie_secret: envVars.COOKIE_SECRET,
  apiKey: envVars.API_KEY,
  env: envVars.NODE_ENV,
  salt: envVars.SALT_ROUNDS,
  encryptionKey: envVars.ENCRYPTION_kEY,
  port: envVars.PORT,
  baseUrl: envVars.BASE_URL,
  sequelize: {
    url: envVars.DB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
    host: envVars.DB_HOST,
    database: envVars.DB_NAME,
    user: envVars.DB_USER,
    password: envVars.DB_PASS,
    dialect: envVars.DIALECT,
  },
};
