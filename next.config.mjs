/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    compiler: {
        styledComponents: true,
    },
    output: "standalone",
};

export default nextConfig;
