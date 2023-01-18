/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve("url-loader"),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve("file-loader"),
            publicPath: `${config.assetPrefix}/public/static/sounds/`,
            outputPath: `${isServer ? "../" : ""}static/sounds/`,
            esModule: config.esModule || false,
            name: "[name]-[hash].[ext]",
          },
        },
      ],
    });
    config.module.rules.push({
      test: /\.midi?$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve("url-loader"),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve("file-loader"),
            publicPath: `${config.assetPrefix}/public/static/songs/`,
            outputPath: `${isServer ? "../" : ""}static/songs/`,
            esModule: config.esModule || false,
            name: "[name]-[hash].[ext]",
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
