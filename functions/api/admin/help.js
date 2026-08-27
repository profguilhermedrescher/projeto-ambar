const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});

function authorized(request, env) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return Boolean(env.ADMIN_TOKEN && token && token === env.ADMIN_TOKEN);
}

export async function onRequestGet({ request, env }) {
  if (!authorized(request, env)) return json({ error: "Não autorizado" }, 401);
  if (!env.DB) return json({ error: "Serviço indisponível" }, 503);
  const result = await env.DB.prepare(
    `SELECT id, message, latitude, longitude, accuracy, status, created_at, updated_at
     FROM help_requests ORDER BY created_at DESC LIMIT 100`
  ).all();
  return json({ requests: result.results || [] });
}

export async function onRequestPatch({ request, env }) {
  if (!authorized(request, env)) return json({ error: "Não autorizado" }, 401);
  if (!env.DB) return json({ error: "Serviço indisponível" }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Dados inválidos" }, 400); }
  const id = String(body.id || "");
  const status = String(body.status || "");
  if (!id || !["novo", "em_atendimento", "encerrado"].includes(status)) {
    return json({ error: "Dados inválidos" }, 400);
  }
  const result = await env.DB.prepare(
    "UPDATE help_requests SET status = ?, updated_at = datetime('now') WHERE id = ?"
  ).bind(status, id).run();
  if (!result.meta?.changes) return json({ error: "Chamado não encontrado" }, 404);
  return json({ ok: true });
}
