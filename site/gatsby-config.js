require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const { projectId } = require('./sanity.json');

module.exports = {
  siteMetadata: {
    title: "Weddingfest",
  },
  plugins: [
    {
      resolve: "gatsby-source-sanity",
      options: {
        projectId,
        dataset: process.env.GATSBY_SANITY_DATASET,
      },
    },
    "gatsby-plugin-postcss",
    "gatsby-plugin-gatsby-cloud",
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
  ],
};
