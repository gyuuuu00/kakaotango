// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5073,
    proxy: {
      "/admin_api": {
        target: "https://gym.tangoplus.co.kr",
        changeOrigin: true,
        secure: true,
      },
      "/api/img-proxy": {
        target: "https://gym.tangoplus.co.kr",
        changeOrigin: true,
        secure: false,

        configure: (proxyServer) => {
          proxyServer.on("proxyReq", (proxyReq, req) => {
            // query string에서 실제 이미지 URL 추출
            const fullUrl = new URL(req.url, "http://localhost:5073");
            const imageUrl = fullUrl.searchParams.get("url");

            if (imageUrl) {
              const remote = new URL(imageUrl);
              proxyReq.setHeader("host", remote.host);
              proxyReq.path = remote.pathname; // /data/Results/...
              proxyReq.protocol = remote.protocol;
            }
          });

          // 응답 헤더 보정
          proxyServer.on("proxyRes", (proxyRes) => {
            proxyRes.headers["Access-Control-Allow-Origin"] = "*";
            proxyRes.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
            proxyRes.headers["Access-Control-Allow-Headers"] = "Content-Type";
            proxyRes.headers["Content-Type"] =
              proxyRes.headers["content-type"] || "image/png";
          });
        },
      },
    },
  },
});