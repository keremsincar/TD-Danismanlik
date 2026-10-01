interface D1Result<T=unknown>{results?:T[];success:boolean;meta?:Record<string,unknown>}
interface D1PreparedStatement{bind(...values:unknown[]):D1PreparedStatement;first<T=Record<string,unknown>>():Promise<T|null>;all<T=Record<string,unknown>>():Promise<{results:T[];success:boolean}>;run():Promise<D1Result>}
interface D1Database{prepare(query:string):D1PreparedStatement;batch<T=unknown>(statements:D1PreparedStatement[]):Promise<D1Result<T>[]>}
interface Fetcher{fetch(input:Request|string,init?:RequestInit):Promise<Response>}
interface R2ObjectBody { body:ReadableStream; httpMetadata?:{contentType?:string}; writeHttpMetadata(headers:Headers):void }
interface R2Bucket { get(key:string):Promise<R2ObjectBody|null>; put(key:string,value:ArrayBuffer,options?:{httpMetadata?:{contentType?:string}}):Promise<unknown>; delete(key:string):Promise<void> }
declare module "cloudflare:workers" { export const env:Record<string,unknown>; }
