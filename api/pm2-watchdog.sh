#!/bin/bash
# pm2 watchdog — runs every minute via DirectAdmin cron

APPDIR="/home/checkk/domains/checkkub.com/public_html"
TRIGGER="/home/checkk/pm2-restart-trigger.txt"
LOG="/home/checkk/pm2-watchdog.log"

ts() { date '+%Y-%m-%d %H:%M:%S'; }

# find pm2 binary via glob (works without nvm init)
PM2=$(ls /home/checkk/.nvm/versions/node/*/bin/pm2 2>/dev/null | sort -rV | head -1)
NODE=$(ls /home/checkk/.nvm/versions/node/*/bin/node 2>/dev/null | sort -rV | head -1)

if [ -z "$PM2" ]; then
    echo "$(ts) [ERROR] pm2 not found in nvm" >> "$LOG"
    exit 1
fi

NODE_BIN=$(dirname "$PM2")
export PATH="$NODE_BIN:$PATH"
export HOME="/home/checkk"
export PM2_HOME="/home/checkk/.pm2"

echo "$(ts) [INFO] pm2=$PM2" >> "$LOG"

do_start() {
    "$PM2" start "$APPDIR/ecosystem.config.js" >> "$LOG" 2>&1
    echo "$(ts) [INFO] start rc=$?" >> "$LOG"
}

do_restart() {
    "$PM2" restart nextjs-app >> "$LOG" 2>&1 || do_start
    echo "$(ts) [INFO] restart rc=$?" >> "$LOG"
}

# handle deploy trigger
if [ -f "$TRIGGER" ]; then
    rm -f "$TRIGGER"
    echo "$(ts) [DEPLOY] trigger found, restarting" >> "$LOG"
    do_restart
    exit 0
fi

# watchdog: start if not online
if ! "$PM2" list 2>/dev/null | grep -q 'nextjs-app.*online'; then
    echo "$(ts) [WATCHDOG] not online, starting" >> "$LOG"
    "$PM2" resurrect >> "$LOG" 2>&1
    if ! "$PM2" list 2>/dev/null | grep -q 'nextjs-app.*online'; then
        do_start
    fi
fi
