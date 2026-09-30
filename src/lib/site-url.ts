/** Public site URL, without a trailing slash. */
export function getSiteUrl(): string {
  return (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

export function editUrl(token: string): string {
  return `${getSiteUrl()}/editar/${token}`;
}
