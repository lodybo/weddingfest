export default {
  // This is the display name for the type
  title: 'Guest',

  // The identifier for this document type used in the api's
  name: 'guest',

  // Documents have the type 'document'. Your schema may describe types beyond documents
  // but let's get back to that later.
  type: 'document',

  // Now we proceed to list the fields of our document
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      description: 'Say my name, say my name',
    },
    {
      title: 'Attendance',
      name: 'attendance',
      type: 'boolean',
      description: 'Is this guest going to show up at the wedding, or what?',
    },
    {
      title: 'Remarks',
      name: 'remarks',
      type: 'text',
      description: 'Any remarks?',
    },
    {
      title: 'Camping',
      name: 'camping',
      type: 'boolean',
      description: 'Are they staying for breakfast?',
    },
  ]
};