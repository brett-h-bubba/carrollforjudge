-- ─────────────────────────────────────────────────────────────────────
-- Daily Digest cron job (Supabase pg_cron + pg_net)
--
-- Runs once a day at 12:00 UTC (= 7:00 AM CDT in summer / 6:00 AM CST
-- in winter) and POSTs to the Next.js /api/cron/daily-digest route,
-- which queries Supabase and emails the admins.
--
-- ─ BEFORE RUNNING ─────────────────────────────────────────────────────
-- 1. Make sure the pg_cron and pg_net extensions are enabled.
--    Supabase dashboard → Database → Extensions → enable both.
--
-- 2. Pick a random secret string (any 32+ random chars). Example:
--      openssl rand -base64 32
--
-- 3. Paste that same secret into:
--    a. Vercel env vars: CRON_SECRET=<paste>
--       (Production + Preview). Redeploy afterward.
--    b. The <PASTE_YOUR_CRON_SECRET_HERE> placeholder in this file,
--       and then run this SQL in Supabase SQL Editor.
--
-- 4. Verify the schedule with:  select * from cron.job;
--    Manually trigger with:     select cron.schedule_in_database(...)
--    Unschedule with:           select cron.unschedule('daily-digest');
-- ─────────────────────────────────────────────────────────────────────

select
  cron.schedule(
    'daily-digest',
    '0 12 * * *',  -- 12:00 UTC daily = 7am CDT / 6am CST
    $$
    select
      net.http_post(
        url     := 'https://www.carrollforjudge.com/api/cron/daily-digest',
        headers := jsonb_build_object(
          'Authorization', 'Bearer <PASTE_YOUR_CRON_SECRET_HERE>',
          'Content-Type',  'application/json'
        ),
        body    := jsonb_build_object('source', 'supabase-pg-cron')
      ) as request_id;
    $$
  );
