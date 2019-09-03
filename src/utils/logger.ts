// tslint:disable-next-line: no-any
export type Parameter = [any?, ...any[]];

/**
 * Logger Class
 */
export class Logger {
  public info(...args: Parameter): void {
    console.info.apply(console, args);
  }

  public warn(...args: Parameter): void {
    console.warn.apply(console, args);
  }

  public error(...args: Parameter): void {
    console.error.apply(console, args);
  }
}

export const logger: Logger = new Logger();
