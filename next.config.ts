import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // 🔹 GitHub Pages에서 쓸 수 있게 정적 export
  output: "export",

  // 🔹 프로젝트 페이지용 basePath / assetPrefix
  //     https://<user>.github.io/11JOB-frontend/ 기준
  basePath: isProd ? "/11JOB-frontend" : "",
  assetPrefix: isProd ? "/11JOB-frontend/" : "",

  // 🔹 GitHub Pages는 Next 이미지 최적화 서버를 못 쓰니까 비활성화
  images: {
    unoptimized: true,
  },

  // 만약 기존에 다른 옵션이 있으면 여기 안에 같이 넣어주면 됨
};

export default nextConfig;
