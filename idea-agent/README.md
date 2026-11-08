# Idea Signal (Telegram edition)

A private, opt-in app that researches three business ideas on a schedule and sends them to you on Telegram:

1. A product or service
2. An idea that solves a problem
3. A creative concept

It uses Anthropic web search for research, Supabase for auth/settings/history, a free Telegram bot for delivery, and a free external scheduler (GitHub Actions) to trigger runs.

## Cost

Everything is free except the Anthropic API:

- Telegram bot: free. Supabase free tier. Vercel Hobby. GitHub Actions free minutes.
- Anthropic: pay per use. Defaults are tuned to be cheap: Haiku model, 3 web searches per run, one run every 6 hours (`IDEA_INTERVAL_HOURS`). Raise the interval to spend less, lower it for more ideas.

## Set up

1. **Supabase**: create a project, run `supabase/schema.sql` in the SQL editor. In Auth enable email/password and set the deployed URL as Site URL.
2. **Telegram**: message `@BotFather`, send `/newbot`, and copy the token into `TELEGRAM_BOT_TOKEN`.
3. **Anthropic**: create an API key (add a few dollars of credit).
4. **Vercel**: create a project from the repo with **Root Directory** `idea-agent`. Add every value from `.env.example`. Use a long random `CRON_SECRET`. Set `IDEA_AGENT_EMAIL` and `VITE_IDEA_AGENT_EMAIL` to your email.
5. **Scheduler** (Vercel Hobby cron is daily-only, so use GitHub Actions): in the GitHub repo add secrets `IDEA_APP_URL` (the deployed URL, no trailing slash) and `IDEA_CRON_SECRET` (same as `CRON_SECRET`). The workflow `.github/workflows/idea-agent-cron.yml` calls the app hourly; the app only does work once per `IDEA_INTERVAL_HOURS` slot. You can also use cron-job.org with the header `Authorization: Bearer <CRON_SECRET>` against `GET /api/cron/hourly`.
6. **Use it**: open the app, create the owner account, press **Link Telegram**, tap Start in the bot chat, press **I pressed Start**, then enable delivery.

## Local development

Install dependencies, copy `.env.example` to `.env.local`, then `npm run dev`. Vite serves the UI; deploy to Vercel to test the API routes and delivery.

## Limitations

The agent reports a sampled-search competition estimate with source links. It cannot prove nobody has tried an idea. Validate demand, legal constraints and the market before investing. Pause delivery in the app (or block the bot) to stop messages.
