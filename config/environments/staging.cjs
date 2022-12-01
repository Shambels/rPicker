let config = {
  "db": {
    "user": process.env.DB_USER || "rpicker",
    "password": process.env.DB_PASSWORD,
    "host": process.env.DB_HOST || "localhost",
    "port": process.env.DB_PORT || 5432,
    "database": process.env.DB_NAME || "rpicker_staging",
    "threads": process.env.DB_THREADS || 5,
    "system": process.env.DB_SYSTEM || "postgres"
  },
  "app": {
    "port": process.env.APP_PORT || 3001,
  }
}

module.exports = config;
