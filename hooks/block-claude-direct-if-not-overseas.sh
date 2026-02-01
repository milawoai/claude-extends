#!/usr/bin/env bash
set -euo pipefail

log() {
  logger -t "claude-hook" "$*"
}

log "hook block-claude-direct-if-not-overseas invoked"
log "ANTHROPIC_BASE_URL=${ANTHROPIC_BASE_URL:-<unset>}"

# 1. 有 ANTHROPIC_BASE_URL → 代理 / 国内厂商 / 自建 → 放行
# if [ -n "${ANTHROPIC_BASE_URL:-}" ]; then
#   log "proxy mode detected, allow"
#   exit 0
# fi

# 2. 没有 ANTHROPIC_BASE_URL → 判定为直连官方 Claude
log "no base_url, assume official Claude"

TRACE="$(curl -fsS https://www.cloudflare.com/cdn-cgi/trace || true)"
LOC="$(echo "$TRACE" | awk -F= '/^loc=/{print $2}' | tr -d '\r' || true)"

log "detected location=${LOC:-<empty>}"

# 3. 只允许 US，其它一律拦截
IS_US="0"
case "$LOC" in
  US) IS_US="1" ;;
esac

if [ "$IS_US" != "1" ]; then
  log "location not US, BLOCK"

  cat <<JSON
{
  "decision": "block",
  "reason": "已拦截：检测到出口地区为 ${LOC:-unknown}（非 US）。当前为直连官方 Claude，仅允许 US 网络环境。\n\n建议：\n1) 切换到 zcf 的代理模型配置（智谱 / Minimax）\n2) 或切换到 US 出口网络后重试"
}
JSON
else
  log "US location detected, allow"
fi

exit 0
