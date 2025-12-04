/** @type {import('next').NextConfig} */

const nextConfig = {
	images: {
		domains: [
			"imgs.search.brave.com",
			"media.istockphoto.com",
			"localhost",
			"snacks-back01-production.up.railway.app",
			// add more domains as needed
		],
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8080',
			},
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
};

export default nextConfig;
