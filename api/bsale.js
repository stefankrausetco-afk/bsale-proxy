export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const token = process.env.BSALE_TOKEN;
  if (!token) return res.status(500).json({ error: "Token no configurado" });

  const path = req.query.path || "documents.json";
  const params = { ...req.query };
  delete params.path;

  const qs = new URLSearchParams(params).toString();
  const url = `https://api.bsale.cl/v1/${path}${qs ? "?" + qs : ""}`;

  try {
    const response = await fetch(url, {
      headers: { "access_token": token, "Content-Type": "application/json" }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
