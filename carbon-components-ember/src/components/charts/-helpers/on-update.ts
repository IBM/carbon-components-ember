export default function onUpdate(
  fn: (...args: any[]) => unknown,
  ...args: unknown[]
): void {
  fn(...args);
}
