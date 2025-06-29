import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // hoặc vue nếu bạn dùng Vue

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env': env,
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
  };
});
