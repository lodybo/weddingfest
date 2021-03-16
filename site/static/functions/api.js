const Sanity = require('@sanity/client');

const db = new Sanity({
  projectId: '6z35e7wq',
  dataset: 'production',
  token: process.env.GATSBY_SANITY_API_TOKEN,
  useCdn: false,
});

exports.handler = async function(event, context) {
  const {
    id,
    address,
    telephone,
    email,
    members,
  } = event.body;

  return Promise.all(() => (
      db
        .patch(id)
        .set({ address, })
        .set({ telephone, })
        .set({ email, })
        .commit()
    ),
    () => members.map(member => (
      db
        .patch(member.id)
        .set({ name: member.name })
        .set({ attendance: member.attendance })
        .set({ remarks: member.remarks })
        .set({ camping: member.camping })
        .commit()
    ))
  )
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'autoSave succeeded' })
    }))
    .catch((err) => ({
      statusCode: 422,
      body: JSON.stringify({ message: 'autoSave succeeded', error: err })
    }));

  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({message: "Hello World"})
  // };
}