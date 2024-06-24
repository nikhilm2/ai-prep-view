/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://ai_owner:PZ3apuYHTEB6@ep-empty-breeze-a52kbttr.us-east-2.aws.neon.tech/ai-mock?sslmode=require',
    }
  };