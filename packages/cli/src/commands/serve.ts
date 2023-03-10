import path from "path";
import { Command } from "commander";
// import { serve } from "@jsnoteapp/local-api";
import { serve } from "@jsnoteapp/local-api";

interface LocalApiError {
  code: string;
}

const isProduction = process.env.NODE_ENV === "production";

export const serveCommand = new Command()
  .command("serve [filename]")
  .description("Open a file for editing")
  .option("-p, --port <number>", "port to run server on", "4005")
  .action(
    async (filename: string = "notebook.js", options: { port: string }) => {
      const isLocalApiError = (err: any): err is LocalApiError => {
        return typeof err.code === "string";
      };

      try {
        const dir = path.join(process.cwd(), path.dirname(filename));
        await serve(
          parseInt(options.port),
          path.basename(filename), //filename
          dir,  //dir
          !isProduction
        );
        console.log(
          `To open ${filename}, Please navigate to http://localhost:${options.port}`
        );
      } catch (err) {
        if (isLocalApiError(err)) {
          if (err.code === "EADDRINUSE") {
            console.error(`Unable to proceed... \n  Port ${options.port} is in use. Try running on a different port.`);
          }
        } else if (err instanceof Error) {
          console.log("Heres the problem ", err.message);
        }
        process.exit(1);
      }
    }
  );
