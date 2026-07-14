import dotenv from "dotenv";
import path from "path";

// Define an interface for the configuration object
interface Config {
  port: number;
  databaseUrl: string;
  saltRounds: number;
  jwtSecret: string;
}
// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), ".env") });


// Create a configuration object with proper type assertions
const config: Config = {
  port: Number(process.env.PORT) || 8000,
  databaseUrl: process.env.MongoDB_url as string,
  saltRounds: Number(process.env.SALT_ROUNDS) || 10,
  jwtSecret: process.env.JWT_SECRET || "default_secret",
};

export default config;