
import type {NextConfig} from 'next';
import withPWA from '@ducanh2912/next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  scope: '/',
  sw: 'service-worker.js',
  manifest: {
    name: 'Livestock Lynx',
    short_name: 'Lynx',
    description: 'Manage your farm with ease.',
    shortcuts: [
      {
        name: 'Log New Activity',
        url: '/activity',
        description: 'Quickly log a new farm activity',
      },
      {
        name: 'Add New Task',
        url: '/tasks',
        description: 'Add a new task to your schedule',
      },
      {
        name: 'Record Transaction',
        url: '/finance',
        description: 'Record a new income or expense item',
      },
       {
        name: 'View Livestock',
        url: '/livestock',
        description: 'View your livestock categories',
      },
    ],
  },
})(nextConfig);

