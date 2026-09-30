function unavailable() {
  return new Response("Not found", { status: 404 });
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development" || process.env.PW_MOCK_X !== "1") {
    return unavailable();
  }
  if (request.headers.get("authorization") !== "Bearer e2e-access-token") {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return Response.json({ data: { id: "900000000000000001", username: "e2e_builder" } });
}
