require('dotenv').config({
  path: `.env.${ process.env.NODE_ENV }`,
});

module.exports = {
  siteMetadata: {
    title: 'Weddingfest',
    siteUrl: 'https://weddingfest.nl'
  },
  plugins: [
    {
      resolve: 'gatsby-source-sanity',
      options: {
        projectId: '6z35e7wq',
        dataset: process.env.SANITY_PROJECT_DATASET,
      },
    },
    'gatsby-plugin-postcss',
    'gatsby-plugin-netlify',
    'gatsby-plugin-image',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/images/icon.png',
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/',
      },
      __key: 'images',
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `WeddingFest`,
        short_name: `WeddingFest`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#cffafe`,
        display: `standalone`,
        icon: './src/images/icon.png',
      },
    },
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-typegen`,
      options: {
        outputPath: `src/types/gatsby-types.d.ts`,
      },
    },
  ],
};
