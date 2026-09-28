# A Little Letter for Jothika

Romantic proposal site prepared for Netlify.

## Netlify setup

Set these environment variables in Netlify → Site configuration → Environment variables:

- `TELEGRAM_BOT_TOKEN` — your Telegram bot token
- `TELEGRAM_CHAT_ID` — your Telegram chat ID

Deploy with the repository root as the base directory. Netlify will publish `dist/` and deploy the Telegram function from `netlify/functions/`.
