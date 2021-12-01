import countries from './countriesList'

export const forms = {
  'add_country': {
    name: 'add_country',
    title: 'Add Country',
    inputs: {
      country: {
        type: 'text',
        placeholder: 'Country Name',
        autofill: true,
        autofill_items: [...countries]
      }
    },
    buttons: [{
      name: 'submit',
      title: 'Add'
    }]
  }, 'convert_sek': {
    name: 'convert_sek',
    title: 'Convert SEK',
    inputs: {
      currency: {
        type: 'text',
        placeholder: 'SEK Amount'
      }
    },
    buttons: [{
      name: 'submit',
      title: 'Convert'
    }]
  }
}