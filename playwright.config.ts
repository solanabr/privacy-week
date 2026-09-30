import { readFileSync } from "node:fs";
import { defineConfig } from "@playwright/test";

function localEnvValue(name: string): string | undefined {
  try {
    const lines = readFileSync(".env.local", "utf8").split(/\r?\n/);
    const line = lines.find((candidate) => candidate.startsWith(`${name}=`));
    if (!line) return undefined;
    const value = line.slice(name.length + 1).trim();
    return value.replace(/^(["'])(.*)\1$/, "$2");
  } catch {
    return undefined;
  }
}

if (!process.env.ADMIN_USERS) {
  process.env.ADMIN_USERS = localEnvValue("ADMIN_USERS") ?? "";
}

const firstAdmin = process.env.ADMIN_USERS.split(",")[0]?.trim() ?? "";
const separator = firstAdmin.indexOf(":");
if (separator <= 0) {
  throw new Error("Set ADMIN_USERS in .env.local before running the end-to-end tests.");
}

process.env.PW_ADMIN_USERNAME ??= firstAdmin.slice(0, separator).trim();
process.env.PW_ADMIN_PASSWORD ??= firstAdmin.slice(separator + 1);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 10_000 },
  reporter: "list",
  use: {
    baseURL: "http://localhost:3100",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm dev --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      DEV_NOW: process.env.PW_DEV_NOW ?? "2026-10-01T12:00:00-03:00",
      SITE_URL: "http://localhost:3100",
      IP_HASH_SALT: "",
      PW_MOCK_X: "1",
      X_CLIENT_ID: "e2e-client-id",
      X_CLIENT_SECRET: "e2e-client-secret",
    },
  },
});
