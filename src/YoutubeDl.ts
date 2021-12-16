import { ExecException } from "child_process";
const { exec } = require("child_process");
const path = require('path');

const isWin = process.platform === "win32";
const bin = path.resolve('tools/bin/youtube-dl' +(isWin ? '.exe' : ''));

const cache = new Map();
const intervalCache = new Map();

function setCache(key: string, data: any): void {
    cache.set(key, data);

    if (!intervalCache.has(key)) intervalCache.set(key, setInterval(() => refreshCache(key), 60000));
}

function refreshCache(command: string) {
    console.log(`Refreshing cache for ${command}...`);

    exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
        if (error) return console.error(`Failed to exec refresh cache for ${command}: `, error.stack);
        try {
            let resultObject = JSON.parse(stdout);
            cache.set(command, resultObject);
            console.log(`Cached result for ${command}: ${stdout}`);
        } catch (e) {
            console.error(`Failed to refresh cache for ${command}: `, (e as Error).stack);
        }
    });
}

export class YoutubeDl {
    public static async getVideoMetadata(url: string, options?: string, schema?: string[]) {
        options = options ||  '-f \"best\"';
        const command = `${bin} ${options} --dump-single-json ${url}`;

        if (cache.has(command)) return schema ? YoutubeDl.filterKeys(cache.get(command), schema) : cache.get(command);

        return await new Promise<any>((resolve, reject) => {
            console.log(`Executing ${command}...`);
            exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
                if (error) {
                    reject({error: error.message, stderr, stdout});
                    return
                }
                try {
                    let resultObject = JSON.parse(stdout);
                    setCache(command, resultObject);
                    console.log(`Cached result for ${command}: ${stdout}`);
                    if (schema) {
                        resultObject = YoutubeDl.filterKeys(resultObject, schema);
                    }
                    resolve(resultObject);
                } catch (e) {
                    reject({error: e, stderr, stdout});
                }
            });
        });
    }

    private static filterKeys(obj: { [name: string]: any }, keys: string[]){
        if(!Array.isArray(keys)) {
            keys = [keys];
        }
        const reducer = function(accumulator: { [name: string]: any }, currentValue: string) {
            if(obj[currentValue]) {
                accumulator[currentValue] = obj[currentValue];
            }
            return accumulator;
        };
        return keys.reduce((reducer), {});
    }
}
