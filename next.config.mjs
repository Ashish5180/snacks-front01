/** @type {import('next').NextConfig} */

const nextConfig = {
	images: {
		domains: [
			"imgs.search.brave.com",
			"media.istockphoto.com",
			"localhost",
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
