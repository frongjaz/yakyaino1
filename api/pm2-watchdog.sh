#!/bin/bash
export HOME=/home/checkk
APPDIR="$HOME/domains/checkkub.com/public_html"
TRIGGER="$HOME/pm2-restart-trigger.txt"
LOG="$HOME/pm2-watchdog.log"
ts() { date '+%Y-%m-%d %H:%M:%S'; }

NODE="" PM2=""
for d in $HOME/.nvm/versions/node/*/bin /opt/alt/nodejs*/bin \
/opt/alt/node*/bin /usr/local/bin /usr/bin; do
    [ -x "$d/node" ] && [ -z "$NODE" ] && NODE="$d/node"
    [ -x "$d/pm2"  ] && [ -z "$PM2"  ] && PM2="$d/pm2"
done

echo "$(ts) node=$NODE pm2=$PM2" >> "$LOG"

if [ -z "$PM2" ] && [ -n "$NODE" ]; then
    NDIR=$(dirname "$NODE")
    "$NDIR/npm" install -g pm2 >> "$LOG" 2>&1 && PM2=$(ls $NDIR/pm2 2>/dev/null)
fi

if [ -f "$TRIGGER" ]; then rm -f "$TRIGGER"; fi

if [ -n "$PM2" ]; then
    export PATH="$(dirname $PM2):$PATH"
    "$PM2" list 2>/dev/null | grep -q 'nextjs-app.*online' || \
    "$PM2" start "$APPDIR/ecosystem.config.js" >> "$LOG" 2>&1
    echo "$(ts) pm2 rc=$?" >> "$LOG"
elif [ -n "$NODE" ]; then
    pgrep -f "node.*server.js" > /dev/null && exit 0
    echo "$(ts) [FALLBACK] nohup node" >> "$LOG"
    cd "$APPDIR" && PORT=3000 NODE_ENV=production nohup "$NODE" server.js \
>> "$HOME/node.log" 2>&1 &
fi
