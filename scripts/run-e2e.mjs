import { spawnSync } from "node:child_process";

const runs = [
  { tag: "@open", now: "2026-10-01T12:00:00-03:00" },
  { tag: "@closed", now: "2026-10-04T00:00:01-03:00" },
];

for (const run of runs) {
  const result = spawnSync(
    "pnpm",
    ["exec", "playwright", "test", "--grep", run.tag],
    {
      cwd: process.cwd(),
      env: { ...process.env, PW_DEV_NOW: run.now },
      stdio: "inherit",
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
