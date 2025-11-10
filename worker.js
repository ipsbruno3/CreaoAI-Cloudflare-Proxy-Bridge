/*
 * 🌐 Creao.AI + Cloudflare Proxy Bridge
 * -------------------------------------
 * A lightweight Cloudflare Worker that connects your Creao.AI frontend
 * to Cloudflare’s global edge network for speed, protection, and scalability.
 *
 * ⚙️ CONFIGURATION:
 *  - Set BASE to your Creao.AI project URL (must end with "/dist/").
 *  - You can verify the correct path by checking the iframe source inside Creao.AI’s Preview URL.
 *  - Example:
 *      const BASE = "https://dede3phc22dgx.cloudfront.net/builds/yyyyyy-yyyyy-yyyyyy-yyyyy-yy/xxxx/xxxx/dist/";
 *
 * 💡 TIPS:
 *  - Use Cloudflare Cache to offload traffic and protect your project at the DNS level.
 *  - Handle up to 100,000 free requests per day with Cloudflare’s global edge.
 *  - Combine Workers with Cloudflare services like:
 *      • R2 — Object storage
 *      • Hyperdrive — Database accelerator
 *      • D1 — Serverless SQL
 *      • Queues & Pipelines — Event-driven workflows
 *
 * 🔗 Bridge maintained by: ipsbruno  •  bsbruno@pm.me
 * Pull requests are welcome
 */

export default {
  async fetch(req) {
    let BASE = "https://dede3phc22dgx.cloudfront.net/builds/yyyyyy-yyyyy-yyyyyy-yyyyy-yy/xxxx/xxxx/dist/";
    const REDIR = true;
    if (!BASE.endsWith("/")) BASE += "/";
    const u = new URL(BASE), REL = u.pathname.replace(/\/$/, ""), ABS = u.origin + REL;
    const url = new URL(req.url); let p = url.pathname || "/";
    if (p === "/__health") return new Response("ok", { status: 204, headers: { "x-worker": "v3" } });
    if (REDIR && p.startsWith("/builds/")) {
      const i = p.indexOf("/dist"), clean = i >= 0 ? p.slice(i + 5) || "/" : "/";
      return Response.redirect(url.origin + clean + url.search, 301);
    }
    const hasExt = /\.[a-z0-9]+$/i.test(p);
    if (p === "/" || !p) p = "/index.html";
    else if (p.endsWith("/")) p += "index.html";
    const dest = BASE + p.slice(1) + url.search, h = new Headers({
      "Accept": "*/*",
      "Accept-Language": req.headers.get("Accept-Language") || "en",
      "User-Agent": "cf-proxy",
      "Accept-Encoding": "identity"
    });
    let r;
    try {
      r = await fetch(dest, { headers: h, redirect: "manual", cf: { cacheEverything: 1, cacheTtlByStatus: { "200-299": 3600, "404": 60 } } });
    } catch (e) { return new Response("fetch " + e, { status: 502 }); }
    if (!hasExt && r.status === 404) r = await fetch(BASE + "index.html", { headers: h });

    const strip = s => s.replaceAll(ABS + "/", "/").replaceAll(ABS, "").replaceAll(REL + "/", "/").replaceAll(REL, "");

    const ext = p.split(".").pop();
    const re = new Headers(r.headers);
    if (p.endsWith("index.html")) {
      const t = strip(await r.text());
      re.set("content-type", "text/html;charset=utf-8");
      re.set("Cache-Control", "no-cache");
      re.set("x-worker", "html");
      return new Response(t, { headers: re });
    }
    if (["js","mjs","css","svg","json","map"].includes(ext)) {
      let t = strip(await r.text());
      t = t.replaceAll('basepath:""', 'basepath:"/"')
           .replaceAll("basepath:''", "basepath:'/'")
           .replaceAll("basepath:``", "basepath:`/`");
      const types = { js: "application/javascript", mjs: "application/javascript", css: "text/css", svg: "image/svg+xml", json: "application/json", map: "application/json" };
      re.set("content-type", types[ext] + ";charset=utf-8");
      re.set("Cache-Control", "no-cache");
      re.set("x-worker", "asset");
      return new Response(t, { headers: re });
    }
    if (!re.has("Cache-Control")) re.set("Cache-Control", "public,max-age=300,s-maxage=86400");
    re.set("x-worker", "proxy");
    return new Response(await r.arrayBuffer(), { status: r.status, headers: re });
  }
}
