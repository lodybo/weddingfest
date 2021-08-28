const path = require('path');
const util = require('util');
const child_process = require('child_process');
const exec = util.promisify(child_process.exec);
const slugify = require('@sindresorhus/slugify');

const supportedLocales = ['nl', 'en'];

exports.onPostBuild = async (gatsbyNodeHelpers) => {
  const { reporter } = gatsbyNodeHelpers;

  const reportOut = (report) => {
    const { stderr, stdout } = report;
    if (stderr) reporter.error(stderr);
    if (stdout) reporter.info(stdout);
  };

  // NOTE: the gatsby build process automatically copies /static/functions to /public/functions
  // If you use yarn, replace "npm install" with "yarn install"
  reportOut(await exec('cd ./public/functions && npm install'));
};


async function createRSVPPages({ graphql, actions }) {
  const { data } = await graphql(`
    query {
      rsvps: allSanityRsvp {
        nodes {
          sanityID: _id
        }
      }
    }
  `);

  data.rsvps.nodes.forEach(rsvp => {
    actions.createPage({
      path: `rsvp/${ rsvp.sanityID }`,
      component: path.resolve('./src/templates/rsvp.tsx'),
      context: { householdID: rsvp.sanityID },
    });
  });
}

async function createGenericPages({ graphql, actions }) {
  const { createPage } = actions;
  const { data } = await graphql(`
    query {
      pages: allSanityPage {
        nodes {
          slug {
            current
          }
        }
      }
    }
  `);

  data.pages.nodes.forEach(page => {
    const { current } = page.slug;
    createLocalePage({
      path: current,
      component: path.resolve('./src/templates/page.tsx'),
      context: {
        slug: current,
      },
    }, createPage);
  });
}

const createLocalePage = (pageData, createPageFunction) => {
  ['', ...supportedLocales].forEach(locale => {
    const { path, context, ...rest} = pageData;
    let localisedPath;
    let contextData = {
      ...context,
    };

    if (locale) {
      localisedPath = `/${locale}/${path}`;
      contextData.locale = locale;
    } else {
      localisedPath = `/${path}`;
    }

    createPageFunction({
      ...rest,
      path: localisedPath,
      context: contextData,
    })
  });
};

exports.createPages = async function (params) {
  await Promise.all([
    createRSVPPages(params),
    createGenericPages(params),
  ]);
};