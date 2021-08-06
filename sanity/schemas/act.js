export default {
  title: 'Act',
  name: 'act',
  type: 'document',
  fields: [
    {
      title: 'Name of the act',
      name: 'act_name',
      description: 'What\'s the name of the act?',
      type: 'string',
    },
    {
      title: 'Starting time',
      name: 'act_start',
      description: 'At what time does the act start? Specify as HH:MM',
      type: 'string',
    },
    {
      title: 'Ending time',
      name: 'act_end',
      description: 'And when does it end? Specify as HH:MM',
      type: 'string',
    },
    {
      title: 'Stage',
      name: 'act_stage',
      description: 'Select the stage(s) the act will perform on',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      options: {
        list: [
          {
            title: 'Bridal stage',
            value: 'BRIDAL',
          },
          {
            title: 'Main stage',
            value: 'MAIN',
          },
          {
            title: 'Intimate stage',
            value: 'INTIMATE',
          },
          {
            title: 'Food & drinks court',
            value: 'FOODCOURT',
          },
        ],
      },
    },
    {
      title: 'Main image',
      name: 'act_header_image',
      description: 'An image to show on the act\'s bio page',
      type: 'image',
    },
    {
      title: 'Description',
      name: 'act_description',
      description: 'Some more information about the act',
      type: 'array',
      of: [
        {
          type: 'block',
        }
      ]
    },
    {
      title: 'YouTube',
      name: 'act_embed_youtube',
      description: 'Embed URL for YouTube',
      type: 'string',
    },
    {
      title: 'SoundCloud',
      name: 'act_embed_soundcloud',
      description: 'Embed URL for SoundCloud',
      type: 'string',
    },
    {
      title: 'Spotify',
      name: 'act_embed_spotify',
      description: 'Embed URL for Spotify',
      type: 'string',
    },
  ]
}