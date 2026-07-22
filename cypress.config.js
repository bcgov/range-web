const { defineConfig } = require('cypress');
const { Pool } = require('pg');

const requiredDbEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

const getDbConfig = () => {
  const missingVars = requiredDbEnvVars.filter((key) => !process.env[`CYPRESS_${key}`]);

  if (missingVars.length > 0) {
    throw new Error(`Missing Cypress DB environment variables: ${missingVars.join(', ')}`);
  }

  return {
    host: process.env.CYPRESS_DB_HOST,
    port: Number(process.env.CYPRESS_DB_PORT),
    database: process.env.CYPRESS_DB_NAME,
    user: process.env.CYPRESS_DB_USER,
    password: process.env.CYPRESS_DB_PASSWORD,
    ssl: process.env.CYPRESS_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
};

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on) {
      on('task', {
        async setUserRole({ username, roleId }) {
          if (!username || typeof username !== 'string') {
            throw new Error('setUserRole requires a non-empty username');
          }

          if (!Number.isInteger(roleId)) {
            throw new Error('setUserRole requires roleId as an integer');
          }

          const pool = new Pool(getDbConfig());

          try {
            const query = `
              UPDATE users
              SET role_id = $2
              WHERE sso_id = $1
              RETURNING id, sso_id, role_id;
            `;

            const result = await pool.query(query, [username, roleId]);

            if (result.rowCount !== 1) {
              throw new Error(`Expected exactly 1 updated row for sso_id='${username}', received ${result.rowCount}`);
            }

            return result.rows[0];
          } finally {
            await pool.end();
          }
        },
      });
    },
  },
  retries: {
    runMode: 1,
    openMode: 0,
  },
  video: true,
  screenshotOnRunFailure: true,
});
