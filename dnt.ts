import { build } from "https://deno.land/x/dnt@0.17.0/mod.ts";

await Deno.remove("npm", { recursive: true }).catch((_) => {});

await build({
  shims: {
    deno: true,
    timers: true,
    custom: [
      {
        package: {
          name: "ws",
          version: "^8.4.0",
        },
        globalNames: [
          {
            name: "WebSocket",
            exportName: "default",
          },
        ],
      },
    ],
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
      name: "./framework",
      path: "packages/framework/mod.ts",
    },
    {
      name: "./misc",
      path: "packages/misc/mod.ts"
    },
  ],
  mappings: {
    "https://deno.land/x/discordeno@13.0.0-rc35/mod.ts": {
      name: "discordeno",
      version: "13.0.0-rc35",
    },
    "./reflect-metadata.ts": {
      name: "reflect-metadata",
      version: "0.1.13"
    }
  },
  outDir: "./npm",
  declaration: true,
  typeCheck: false,
  test: false,
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");