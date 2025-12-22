import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './configs/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
	url: "postgresql://neondb_owner:npg_dugQ4RPBX3zx@ep-empty-haze-adi5gori-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
  },
});