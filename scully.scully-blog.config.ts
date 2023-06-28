import {
    ScullyConfig,
    setPluginConfig,
} from '@scullyio/scully';
import '@scullyio/scully-plugin-puppeteer';
setPluginConfig('md', { enableSyntaxHighlighting: true });

export const config: ScullyConfig = {
    projectRoot: './src',
    projectName: 'scully-blog',
    distFolder: './dist/scully-blog', // output directory of your Angular build artifacts
    outDir: './dist/static', // directory for scully build artifacts
    defaultPostRenderers: [],
    routes: {
        '/blog/:slug': {
            type: 'contentFolder',
            slug: {
                folder: './blog',
            }
        }
    },
};