const page = __PAGE_HTML__;
const audioBase64 = __AUDIO_BASE64__;

const allowedAnswers = new Set([
  "Yes, let’s talk ☕",
  "I need time 🌙",
  "Not for me ✨",
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(page, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    }

    if (request.method === "GET" && url.pathname === "/romantic.mpeg") {
      const binary = Uint8Array.from(atob(audioBase64), (character) => character.charCodeAt(0));
      return new Response(binary, {
        headers: {
          "content-type": "audio/mpeg",
          "cache-control": "public, max-age=3600",
          "accept-ranges": "bytes",
        },
      });
    }

    if (request.method === "POST" && url.pathname === "/api/telegram") {
      try {
        const body = await request.json();
        const answer = typeof body.answer === "string" ? body.answer.trim() : "";
        if (!allowedAnswers.has(answer)) {
          return Response.json({ ok: false, message: "Invalid answer." }, { status: 400 });
        }
        if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
          return Response.json({ ok: false, message: "Telegram is not connected yet." }, { status: 503 });
        }

        const telegramResponse = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: `💌 Jothika answered your letter:\n\n${answer}`,
          }),
        });
        if (!telegramResponse.ok) {
          return Response.json({ ok: false, message: "Telegram could not receive the answer." }, { status: 502 });
        }
        return Response.json({ ok: true });
      } catch {
        return Response.json({ ok: false, message: "Please try again." }, { status: 400 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
