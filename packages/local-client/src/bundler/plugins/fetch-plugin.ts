import * as esbuild from 'esbuild-wasm';
import axios from 'axios'
import localForage from 'localforage'

const fileCache = localForage.createInstance({
    name: 'filecache'
});

export const fetchPlugin = (inputCode : string) => {

    return {
        name: 'fetch-plugin',
        setup(build: esbuild.PluginBuild){

            build.onLoad({filter: /(^index\.js$)/ }, () => {
                return {
                    loader: 'jsx',
                    contents: inputCode,
                };
            })

            build.onLoad({filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
                const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path)
        
                if (cachedResult){ 
                    return cachedResult 
                }
                //if no cachedResult, the onLoad continues (becuase no return anything)
            })

            build.onLoad({ filter: /.css$/ }, async (args: esbuild.OnLoadArgs) => {
                const { data, request } = await axios.get(args.path)     
                const escapedCSSCode = data.replace(/\n/g, '')
                                           .replace(/"/g, '\\"')
                                           .replace(/'/g, "\\'")
                const contents = `
                const style = document.createElement('style');
                style.innerText = '${escapedCSSCode}';
                document.head.appendChild(style);
                `;
                
                const resolvedURL = new URL('./',request.responseURL).pathname   
                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: contents,
                    resolveDir: resolvedURL
                }
                await fileCache.setItem<esbuild.OnLoadResult>(args.path, result)
                return result
            })

            build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
                const { data, request } = await axios.get(args.path)
                const resolvedURL = new URL('./',request.responseURL).pathname   
                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: data,
                    resolveDir: resolvedURL
                }
                await fileCache.setItem<esbuild.OnLoadResult>(args.path, result)
                return result
            });
        }
    }
}
