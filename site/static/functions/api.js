const Sanity = require('@sanity/client');

const db = new Sanity({
  projectId: '6z35e7wq',
  dataset: process.env.SANITY_PROJECT_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

exports.handler = async (event) => {
  const {
    id,
    address,
    telephone,
    email,
    members
  } = JSON.parse(event.body);

  const householdPatch = db
    .patch(id)
    .set({ address, })
    .set({ telephone, })
    .set({ email, });

  const guestPatches = members.map(member => (
    db
      .patch(member.sanityID)
      .set({ name: member.name })
      .set({ attendance: member.attendance })
      .set({ remarks: member.remarks })
      .set({ camping: member.camping })
  ));

  try {
    const transaction = db.transaction();
    transaction.patch(householdPatch);

    guestPatches.forEach(patch => transaction.patch(patch));

    await transaction.commit();
  } catch (err) {
    return {
      statusCode: 422,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Saving data has failed...', error: err }),
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: 'Save succeeded' }),
  }
};