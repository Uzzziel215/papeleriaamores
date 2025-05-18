/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    allowedDevOrigins: ['https://3000-firebase-papeleriaamores-1747017060120.cluster-ux5mmlia3zhhask7riihruxydo.cloudworkstations.dev'],
  },
}

export default nextConfig
