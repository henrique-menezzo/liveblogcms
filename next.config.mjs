/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    basePath: "/liveblogcms",
    images: {
          unoptimized: true,
          remotePatterns: [{ protocol: "https", hostname: "**" }],
    },
};

export default nextConfig;
