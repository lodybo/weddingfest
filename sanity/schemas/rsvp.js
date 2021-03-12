export default {
  // This is the display name for the type
  title: 'RSVP',

  // The identifier for this document type used in the api's
  name: 'rsvp',

  // Documents have the type 'document'. Your schema may describe types beyond documents
  // but let's get back to that later.
  type: 'document',

  // Now we proceed to list the fields of our document
  fields: [
    {
      title: 'Household name',
      name: 'household',
      type: 'string',
      description: 'A household with, people?',
    },
    {
      title: 'Address',
      name: 'address',
      type: 'text',
      description: 'The place where they, live?',
    },
    {
      title: 'Telephone',
      name: 'telephone',
      type: 'string',
      description: 'The participants of call them maybe?',
    },
    {
      title: 'Email',
      name: 'email',
      type: 'string',
      description: 'Because carrier pigeon\'s are extinct.',
    },
    {
      title: 'Members',
      name: 'members',
      description: 'The participants of said household',
      type: 'array',
      of: [ { type: 'reference', to: [ { type: 'guest' } ] } ],
    },
  ]
};