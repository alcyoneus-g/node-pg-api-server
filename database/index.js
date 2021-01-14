import pkg from "pg";
const { Pool } = pkg;

let pool = null;

export function connectDatabase() {
  pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  });
}

/**
 * DB Query
 * @param {object} req
 * @param {object} res
 * @returns {object} object
 */

const query = async (text, params) => {
  const res = await pool.query(text, params);
  return res;
};

export { query };
