import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.weekly(
  "Cleanup expired publication access tokens",
  {
    dayOfWeek: "sunday",
    hourUTC: 2,
    minuteUTC: 0
  },
  internal.publications.cleanupExpiredTokens
);

export default crons;