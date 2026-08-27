const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "Serviço indisponível" }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Dados inválidos" }, 400);
  }

  const message = String(body.message || "").trim().slice(0, 500);
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);
  const accuracy = Number(body.accuracy);
  if (!message || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
      !Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
      !Number.isFinite(accuracy) || accuracy < 0) {
    return json({ error: "Dados inválidos" }, 400);
  }

  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO help_requests
      (id, message, latitude, longitude, accuracy, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'novo', datetime('now'), datetime('now'))`
  ).bind(id, message, latitude, longitude, accuracy).run();

  return json({ ok: true, id }, 201);
}
