export class DelayExec {
  private readonly delayMs: number;
  private timer = 0;

  constructor(delayMs = 1000) {
    this.delayMs = delayMs;
  }

  exec(f: () => void): void {
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(f, this.delayMs);
  }
}
