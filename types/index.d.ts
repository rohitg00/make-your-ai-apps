declare module '@webcontainer/api' {
  export class WebContainer {
    static boot(): Promise<WebContainer>;
    mount(files: Record<string, any>): Promise<void>;
    spawn(command: string, args: string[]): Promise<any>;
    fs: {
      readFile(path: string): Promise<{ text(): string }>;
      writeFile(path: string, contents: string): Promise<void>;
    };
  }
}

declare module 'color' {
  export default class Color {
    constructor(color: string);
    lighten(value: number): Color;
    darken(value: number): Color;
    hex(): string;
  }
}

declare module '@electric-sql/pglite' {
  export class PGlite {
    constructor(path: string);
    query(sql: string, params?: any[]): Promise<any>;
  }
} 