import migrationRunner from 'node-pg-migrate';
import { resolve } from 'node:path';
import database from 'infra/database';

export default async function migrations(req, res) {
  const allowedMethods = ['GET', 'POST'];

  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      error: `Method "${req.method}" not allowed`,
    });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const migrationConfig = {
      dbClient: dbClient,
      dir: resolve('infra', 'migrations'),
      direction: 'up',
      dryRun: true,
      verbose: true,
      migrationsTable: 'pgmigrations',
    };

    if (req.method === 'GET') {
      const pendingMigrations = await migrationRunner(migrationConfig);
      return res.status(200).json(pendingMigrations);
    }

    if (req.method === 'POST') {
      const migratedMigrations = await migrationRunner({
        ...migrationConfig,
        dryRun: false,
      });

      return migratedMigrations.length > 0
        ? res.status(201).json(migratedMigrations)
        : res.status(200).json(migratedMigrations);
    }
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  } finally {
    await dbClient.end();
  }
}
