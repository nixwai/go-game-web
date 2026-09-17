/** 将落子方标识转换为中文名称。 */
export function formatPlayer(player: -1 | 1): string {
  return player === 1 ? '黑方' : '白方';
}

/** 将 ISO 时间格式化为 yyyy-MM-dd HH:mm。 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');

  return `${y}-${m}-${day} ${h}:${min}`;
}
