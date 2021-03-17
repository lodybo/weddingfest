const path = require('path');
const util = require('util');
const child_process = require('child_process');
const exec = util.promisify(child_process.exec);

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

exports.createPages = async function (params) {
  await Promise.all([
    createRSVPPages(params),
  ]);
};