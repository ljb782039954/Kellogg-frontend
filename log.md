23:18:08.191 prerendering static routes
23:18:09.420 Failed to get static paths from the Cloudflare prerender server (500: Internal Server Error).
23:18:09.420 TypeError: Invalid URL: /api/config/site_settings
23:18:09.420 at async Object.fetch (file:///opt/buildhome/repo/node_modules/miniflare/dist/src/workers/core/entry.worker.js:4672:22)
23:18:09.420 Location:
23:18:09.420 /opt/buildhome/repo/node_modules/miniflare/dist/src/workers/core/entry.worker.js:4672:22
23:18:09.420 Stack trace:
23:18:09.420 at async Object.fetch (file:///opt/buildhome/repo/node_modules/miniflare/dist/src/workers/core/entry.worker.js:4672:22)
23:18:09.420 at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
23:18:09.420 at async BasicMinimalPluginContext.handler (file:///opt/buildhome/repo/node_modules/astro/dist/core/build/static-build.js:132:11)
23:18:09.420 at async buildEnvironments (file:///opt/buildhome/repo/node_modules/astro/dist/core/build/static-build.js:332:3)
23:18:09.420 at async AstroBuilder.build (file:///opt/buildhome/repo/node_modules/astro/dist/core/build/index.js:158:5)
23:18:09.420 at async build (file:///opt/buildhome/repo/node_modules/astro/dist/core/build/index.js:48:3)
23:18:09.601 Failed: error occurred while running build command
