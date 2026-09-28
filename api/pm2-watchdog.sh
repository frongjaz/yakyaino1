#!/bin/bash
# pm2 watchdog: runs every minute via cron
# - restarts pm2 app if trigger file exists (written by PHP after FTP deploy)
# - starts pm2 app if it's not running (server reboot recovery)

export NVM_DIR="/home/checkk/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" --no-use

APPDIR="/home/checkk/domains/checkkub.com/public_html"
TRIGGER="/home/checkk/pm2-restart-trigger.txt"
LOG="/home/checkk/pm2-watchdog.log"

ts() { date '+%Y-%m-%d %H:%M:%S'; }

# Handle restart trigger (written by api/restart-pm2.php after each deploy)
if [ -f "$TRIGGER" ]; then
    rm -f "$TRIGGER"
    echo "$(ts) [DEPLOY] Restart triggered" >> "$LOG"
    if pm2 restart nextjs-app >> "$LOG" 2>&1; then
        echo "$(ts) [DEPLOY] pm2 restart OK" >> "$LOG"
    else
        echo "$(ts) [DEPLOY] restart failed, starting fresh" >> "$LOG"
        pm2 start "$APPDIR/ecosystem.config.js" >> "$LOG" 2>&1
    fi
    exit 0
fi

# Watchdog: ensure app is online
if pm2 list 2>/dev/null | grep -q 'nextjs-app.*online'; then
    exit 0
fi

echo "$(ts) [WATCHDOG] nextjs-app not online, attempting start" >> "$LOG"
if pm2 resurrect >> "$LOG" 2>&1 && pm2 list 2>/dev/null | grep -q 'nextjs-app.*online'; then
    echo "$(ts) [WATCHDOG] resurrect OK" >> "$LOG"
else
    pm2 start "$APPDIR/ecosystem.config.js" >> "$LOG" 2>&1
    echo "$(ts) [WATCHDOG] start via ecosystem.config.js rc=$?" >> "$LOG"
fi
