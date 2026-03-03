import { defineConfig } from '@prisma/config'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') })

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set. Please create a .env file with DATABASE_URL.')
}

export default defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: {
        url: databaseUrl,
    },
    migrations: {
        seed: 'npx tsx prisma/seed.ts',
    },
});
