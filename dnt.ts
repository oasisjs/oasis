import { build } from "https://deno.land/x/dnt@0.17.0/mod.ts";

await Deno.remove("npm", { recursive: true }).catch((_) => {});

await build({
  shims: {
    deno: true,
    timers: true,
  },
  package: {
    author: "Yuzuru",
    name: "oasis-js",
    version: Deno.args[0],
    description: "Bleeding edge object oriented Discordeno framework for creating bots",
    license: "Apache License 2.0",
    repository: {
      type: "git",
      url: "git+https://github.com/yuzudev/oasis.git"
    },
    bugs: {
      url: "https://github.com/yuzudev/oasis/issues"
    },
    typesVersions: {
      "*": {
        "*": [ "./types/mod.d.ts" ],
        "builders": [ "./types/builders/mod.d.ts" ],
        "fileloader": [ "./types/fileloader/mod.d.ts" ],
        "collectors": [ "./types/collectors/mod.d.ts" ],
        "loggger": [ "./types/logger/mod.d.ts" ],
        "framework": [ "./types/logger/mod.d.ts" ],
        "misc": [ "./types/misc/mod.d.ts" ],
      }
    },
  },
  entryPoints: [
    "./mod.ts",
    {
      name: "./builders",
      path: "packages/builders/mod.ts",
    },
    {
      name: "./fileloader",
      path: "packages/fileloader/mod.ts",
    },
    {
      name: "./collectors",
      path: "packages/collectors/mod.ts",
    },
    {
      name: "./logger",
      path: "packages/logger/mod.ts",
    },
    {
      name: "./framework",
      path: "packages/framework/mod.ts",
    },
    {
      name: "./misc",
      path: "packages/misc/mod.ts"
    },
  ],
  outDir: "./npm",
  declaration: true,
  mappings: {
    "https://deno.land/x/discordeno@13.0.0-rc35/mod.ts": {
      name: "discordeno",
      version: "13.0.0-rc35",
    },
    "https://deno.land/x/deno_reflect@v0.1.13/mod.ts": {
      name: "reflect-metadata",
      version: "0.1.13"
    },
    "https://deno.land/std@0.119.0/fmt/colors.ts": {
      name: "chalk",
      version: "5.0.1",
    }
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");