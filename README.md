# Hello everyone 


> **Today’s tutorial shows you how to connect your [Creao.ai](https://creao.ai) application to [Cloudflare](https://cloudflare.com)** so you can use and secure a custom domain like **mycompany.com**, while taking advantage of Creao.ai’s ability to build beautiful, production-ready front-end designs—without writing a single line of code.


 
---

# Link your **Creao.ai** app to **Cloudflare** for a secure custom domain 🌐🔒

Use Cloudflare to front your Creao.ai application with a branded domain like `mycompany.com`, add security (WAF/DDoS), and speed things up with edge caching—without running servers.

**Creao.ai** is a no‑code platform where you describe the app you want and AI builds and hosts it for you.
**Cloudflare** is a DNS + edge platform to manage domains, firewall, and serverless backends with **Workers**.

> 🤖 Both Cloudflare and Creao.ai have freemium plans, so you can build and publish without upfront cost. Creao.ai outputs clean React/Vite front‑ends; Cloudflare protects and accelerates them with rules and global caching.

---

## What you’ll need 📋

* ✅ **Add your domain to Cloudflare (free).**
  At your registrar (e.g., GoDaddy, Namecheap), change the **NS1** and **NS2** nameservers to the ones Cloudflare provides for your zone.

* ✅ **DNS placeholder (only for classic routes).**
  If you plan to use classic routes, point `@` or `www` to a placeholder (e.g., an `A` record to `192.0.2.1`, a non‑routable test IP).
  *Tip:* If you attach a **Custom Domain** directly to your Worker, Cloudflare creates the DNS entry automatically—no placeholder needed.

  <img width="2058" height="541" alt="Captura de tela de 2025-11-10 11-06-25" src="https://github.com/user-attachments/assets/d03f1db0-27f5-4f7c-98c0-6da254431089" />

* ✅ **Create a Cloudflare Worker** and name your project.
  Workers run your code at Cloudflare’s edge; paste the script, deploy, and route it to your hostname(s).

  <img width="1750" height="667" alt="Captura de tela de 2025-11-10 11-18-07" src="https://github.com/user-attachments/assets/872d4d32-9ed9-4ca0-8b06-ffc66af8e7ca" />
  <img width="2455" height="374" alt="Captura de tela de 2025-11-10 04-27-04" src="https://github.com/user-attachments/assets/9692094e-32fc-4243-85f7-10213b86cc40" />

---

## Get your **CloudFront** build URL from Creao.ai 🔗

In your **Creao.ai** project preview:

1. Right‑click the preview.
2. Choose **VIEW IFRAME URL**.
3. Copy the URL that **contains** `cloudfront` and **ends with** `/dist/`.

**Example**

```
https://dede3phc22dgx.cloudfront.net/builds/e89103f0-d031-70d6-d62f-e529b728457c/690eab72346b5d32220e3ee2/69119cf579ab52c1c0b0be99/dist/
```

> Keep the trailing `/dist/`. The Worker relies on it.

---

## Add the Worker script and set `BASE` 🧩

**Script link:**
[**CreaoAI‑Cloudflare‑Proxy‑Bridge / `worker.js`**](https://github.com/ipsbruno3/CreaoAI-Cloudflare-Proxy-Bridge/blob/main/worker.js)

In the Worker code, set the `BASE` variable to your CloudFront `/dist/` URL:

```js
let BASE = "https://dede3phc22dgx.cloudfront.net/builds/yyyyyy-yyyyy-yyyyyy-yyyyy-yy/xxxx/xxxx/dist/";
```

> Replace the URL with the one you copied from **VIEW IFRAME URL** (must include `cloudfront` and end with `/dist/`).

<img width="1170" height="110" alt="image" src="https://github.com/user-attachments/assets/f82e58c2-4eda-4ec4-9b8b-ce9d2bb2bfe5" />

---

## Attach your domain to the Worker 🔁

* **Custom Domain (recommended):** Attach `yourdomain.com` (or a subdomain) directly in the Worker’s **Triggers → Custom Domains**. Cloudflare will create DNS + TLS for you.
* **Classic Route (alternative):** Add a route like `yourdomain.com/*` in **Triggers → Routes**. Use the DNS placeholder if needed.

Then visit `https://yourdomain.com` to verify it loads your Creao.ai app through Cloudflare.

---

## Benefits (aligned to our goals) ✅

1. 🏷️ **Branded domain** for your Creao.ai zero‑code front end, served via Cloudflare’s edge.

2. 🛡️ **Protection** with WAF, DDoS mitigation, and firewall rules.

3. 📊 **Unified analytics & logs** (traffic, errors, performance) in Cloudflare.

   <img width="2220" height="1278" alt="Captura de tela de 2025-11-10 04-36-56" src="https://github.com/user-attachments/assets/0c9d94da-dc26-40f5-821b-e37dcd6de1c3" />
   <img width="2220" height="1278" alt="Captura de tela de 2025-11-10 04-33-42" src="https://github.com/user-attachments/assets/d807232f-3546-48b4-a639-2a71a1f6c446" />
   <img width="2403" height="1110" alt="image" src="https://github.com/user-attachments/assets/d1656f4a-82fa-4885-b90e-a511590b35e8" />

4. ⚙️ **Architecture split:** Cloudflare **Workers** for backend logic; **Creao.ai** for the front‑end UI.

5. 🌐 **DNS control & IP restrictions:** manage records easily and lock down admin paths by IP.

6. 🔌 **Data services on tap:** integrate **R2** (object storage), **Hyperdrive** (DB accelerator), **D1** (SQL), **Queues & Pipelines**—all managed on the Cloudflare side.

7. 💵 **Generous free tier** (often around **100k requests/day** for Workers—confirm current limits) and fewer origin hits thanks to Cloudflare cache.

---

## Conclusion

You get the best of both worlds: a robust **front-end** built by AI—without writing a single line of code—running behind **Cloudflare** as a secure, cached reverse proxy that can also provide databases and a managed backend for your project.
/
1. Easy
2. Secure
3. Scalable

---

**Feel free to ask questions here. Open source script! You can use, share, and edit it however you like. Pull requests are welcome.** 

