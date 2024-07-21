import dotenv from 'dotenv';
dotenv.config();

const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
};

export default nextConfig;
