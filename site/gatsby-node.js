const path = require('path');

async function createRSVPPages({ graphql, actions }) {
  const { data } = await graphql(`
    query {
      rsvps: allSanityRsvp {
        nodes {
          id
        }
      }
    }
  `);

  data.rsvps.nodes.forEach(rsvp => {
    actions.createPage({
      path: `rsvp/${rsvp.id}`,
      component: path.resolve('./src/templates/rsvp.tsx'),
      context: { householdID: rsvp.id },
    })
  });
}

exports.createPages = async function (params ) {
  await Promise.all([
    createRSVPPages(params),
  ])
}