import { execa } from "execa";
import { BrowserWindow, dialog } from "electron";
import { basename, join } from "path";
import { store } from "./store.js";
import { ConnectionFactoryOptions, ConnectionOpenProjectResponse } from "../shared/types.js";
import { spawn } from "child_process";

interface Connection {
  openProject(): Promise<ConnectionOpenProjectResponse>;
  artisan(fullCommand: string): Promise<string>;
  startServe(): number | undefined;
  tinker(code: string): Promise<string>;
  phpExecutable(): string;
  // addToRecents(): void;
}

function connectionFactory(factoryOptions: ConnectionFactoryOptions): Connection {
  if (factoryOptions.type == "LocalFolder") {
    return new LocalFolder(factoryOptions.dir, factoryOptions.php);
  } else {
    return new LocalFolder(factoryOptions.dir, factoryOptions.php);
  }
}

class LocalFolder implements Connection {
  dir: string;
  php: string;

  constructor(dir: string, php: string) {
    this.dir = dir;
    this.php = php;
  }

  phpExecutable(): string {
    return this.php;
  }

  async openProject(): Promise<ConnectionOpenProjectResponse> {
    try {
      const { all } = await execa(this.phpExecutable(), ["artisan", "--format=json"], { cwd: this.dir, all: true, buffer: true });
      if (all?.includes("Laravel")) {
        return { success: true, output: all, basename: basename(this.dir) };
      } else {
        console.log(`Error opening project in ${this.dir}`);
        console.error(all);
        if (all?.includes("Could not open input file: artisan")) {
          dialog.showErrorBox("خطأ في فتح المشروع", `${this.dir} - هذا المجلد ليس مشروع لارافيل. يرجى إنشاء مشروع لارافيل ثم فتحه.`);
        } else {
          dialog.showErrorBox("خطأ في فتح المشروع", all ?? "غير معروف");
        }
        return { success: false };
      }
    } catch (e: any) {
      console.warn(`Error opening project in ${this.dir}`);
      console.log(e);
      if (e.all.includes("Could not open input file: artisan")) {
        dialog.showErrorBox("خطأ في فتح المشروع", `${this.dir} - هذا المجلد ليس مشروع لارافيل. يرجى إنشاء مشروع لارافيل ثم فتحه.`);
      } else {
        dialog.showErrorBox("خطأ في فتح المشروع", e.all);
      }
      return { success: false };
    }
  }

  async artisan(fullCommand: string): Promise<string> {
    try {
      const { all } = await execa(this.phpExecutable(), ["artisan", ...fullCommand, "--no-interaction", "--ansi"], { cwd: this.dir, all: true, buffer: true });
      return all ?? "";
    } catch (e: any) {
      console.log(`Error executing artisan command in ${this.dir}: ${fullCommand}`);
      console.error(e);
      return e.all;
    }
  }

  startServe(): number | undefined {
    const serve = spawn(this.phpExecutable(), ["artisan", "serve"], { cwd: this.dir });
    serve.stdout.on("data", (data) => {
      if (data.includes("started")) {
        BrowserWindow.getAllWindows()[0].webContents.send("updateServeLink", data.toString().match(/(https?:\/\/[a-zA-Z0-9.]+(:[0-9]+)?)/g)[0]);
      }
    });
    return serve.pid;
  }

  async tinker(code: string): Promise<string> {
    try {
      const { stdout } = await execa(this.phpExecutable(), [join(__dirname, "tinker.php"), this.dir, code]);
      return stdout;
    } catch (e) {
      console.error(e);
      return e as string;
    }
  }
}

export { connectionFactory };
