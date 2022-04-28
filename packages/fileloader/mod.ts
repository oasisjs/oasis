/**
 * Represents a Javascript module
 */
export interface Module extends Record<string, unknown> {
    default?: unknown;
}

/**
 * Represents a recursive async generator return type
 */
export type AsyncRecGenerator<T = unknown> = AsyncGenerator<T, void | AsyncRecGenerator<T>>;

/**
 * Reads a directory and yields every file using an async generator, works with subdirectories
 */
export async function* load<T extends Module>(dir: string): AsyncRecGenerator<T> {
    for await (const file of Deno.readDir(dir)) {
        // if is a directory recursively read all of the files inside the directory/subdirectory
        if (file.isDirectory) {
            yield* load(`${dir}/${file.name}`);
            continue;
        }

        const mod = await import(`file:${Deno.cwd()}/${dir}/${file.name}`);
        yield mod as T; // yield the result
    }
}

/**
 * performs the load() async function and returns an array with an item for every iteration
 */
export async function loadDirs<T extends Module>(root: string, dirs: string[]): Promise<T[]> {
    const output = [] as T[];

    for (const dir of dirs) {
        for await (const mod of load<T>(`${root}/${dir}`)) {
            output.push(mod);
        }
    }

    return output;
}

// deno-lint-ignore no-namespace
export namespace TemporaryFileloader {
    const imports = new Set<(datetime: number) => string>();

    export function importDirectory(dir: string) {
        for (const file of Deno.readDirSync(dir)) {
            if (file.isDirectory) {
                importDirectory(`${dir}/${file.name}`);
                continue;
            }

            const importString = (datetime: number) =>
                `import "file:///${Deno.cwd()}/${dir}/${file.name}#${datetime}";`;
            imports.add(importString);
        }
    }

    export async function fileLoader() {
        const timestamp = Date.now();

        Deno.mkdirSync('temp', { recursive: true });
        Deno.createSync('temp/fileloader.ts');
        Deno.writeTextFileSync(
            'temp/fileloader.ts',
            [...imports]
                .map((im) => im(timestamp))
                .join('\n')
                .replaceAll('\\', '/'),
        );

        await import(`file:///${Deno.cwd()}/temp/fileloader.ts`);

        imports.clear();
    }

    export async function fastFileLoader(...paths: string[]) {
        try {
            for (const path of paths) importDirectory(path);
        } finally {
            await fileLoader();
        }
    }
}
