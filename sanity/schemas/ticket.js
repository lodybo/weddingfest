import PriceInput from '../components/PriceInput';

export default {
  title: 'Ticket',
  name: 'ticket',
  type: 'document',
  fields: [
    {
      title: 'Ticket type',
      name: 'ticket_type',
      type: 'string',
      description: 'What kind of ticket is it?',
    },
    {
      title: 'Description',
      name: 'description',
      description: 'What does this ticket cover?',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ]
    },
    {
      title: 'Upgrade amount',
      name: 'upgrade_amount',
      description: 'For how much money can people buy the upgrade?',
      type: 'number',
      inputComponent: PriceInput,
    }
  ],
}