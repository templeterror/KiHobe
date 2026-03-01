from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from app.services.coins import run_daily_grants

scheduler = AsyncIOScheduler(timezone="Asia/Dhaka")


def start_scheduler() -> None:
    # Daily coin grant at midnight Bangladesh time (UTC+6)
    scheduler.add_job(
        run_daily_grants,
        CronTrigger(hour=0, minute=0, timezone="Asia/Dhaka"),
        id="daily_coin_grant",
        replace_existing=True,
    )
    scheduler.start()


def stop_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown()
