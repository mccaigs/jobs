import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Morning ingestion at 08:00 Europe/London time
// Cron expression: minute hour day month dayOfWeek
// "0 8 * * *" = At 08:00 every day
crons.cron(
  "ingest-morning",
  "0 8 * * *",
  internal.githubIngest.ingestLatestJobReport,
  { timezone: "Europe/London" }
);

// Afternoon ingestion at 16:00 Europe/London time
// "0 16 * * *" = At 16:00 every day
crons.cron(
  "ingest-afternoon",
  "0 16 * * *",
  internal.githubIngest.ingestLatestJobReport,
  { timezone: "Europe/London" }
);

export default crons;
