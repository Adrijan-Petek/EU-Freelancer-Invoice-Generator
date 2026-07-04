/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: isGithubPages ? "/EU-Freelancer-Invoice-Generator" : "",
  assetPrefix: isGithubPages ? "/EU-Freelancer-Invoice-Generator/" : ""
};

module.exports = nextConfig;
