/** 通过 JSON 序列化复制值。 */
export function jsonClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
