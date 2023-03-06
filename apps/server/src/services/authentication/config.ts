import "dotenv/config";

export namespace Authentication {
  const PORT: number = process.env.AUTH_PORT ? parseInt(process.env.AUTH_PORT) : 2000;
  export const config = { PORT };
}
