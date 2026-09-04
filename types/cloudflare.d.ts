interface D1Result<T=unknown>{results?:T[];success:boolean;meta?:Record<string,unknown>}
interface D1PreparedStatement{bind(...values:unknown[]):D1PreparedStatement;first<T=Record<string,unknown>>():Promise<T|null>;all<T=Record<string,unknown>>():Promise<{results:T[];success:boolean}>;run():Promise<D1Result>}
interface D1Database{prepare(query:string):D1PreparedStatement;batch<T=unknown>(statements:D1PreparedStatement[]):Promise<D1Result<T>[]>}
interface Fetcher{fetch(input:Request|string,init?:RequestInit):Promise<Response>}
declare module "cloudflare:workers" { export const env:Record<string,unknown>; }
