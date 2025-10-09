// ...existing code...
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
// ...existing code...

export default defineConfig({
  // ...existing code...
  plugins: [
    // ...existing plugins...
    visualizer({ filename: 'dist/stats.html', gzipSize: true, open: false })
  ],
  build: {
    // increase warning limit to avoid noisy warnings for large bundles
    chunkSizeWarningLimit: 1000, // KB

    // split node_modules into vendor chunks and isolate large libs (example: three)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three-vendor'
            return 'vendor'
          }
        }
      }
    }
  }
  // ...existing code...
})