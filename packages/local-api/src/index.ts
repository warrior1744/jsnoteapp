import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { createCellsRouter } from "./routes/cells";

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();
  app.use(createCellsRouter(filename, dir))

  if(useProxy){
    //development
    app.use(createProxyMiddleware({
        target: 'http://localhost:3000',
        ws: true,
        logLevel: 'silent'
    }))
  }else{
    //production: installed on local machine
    const packagePath = require.resolve("@jsnoteapp/local-client/build/index.html");
    console.log('packagePath', packagePath)
    app.use(express.static(path.dirname(packagePath)));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on("error", reject);
  });
};
