import React from 'react';
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event';
import { FormField } from '@sanity/base/lib/components';
import { TextInput, Text, Stack } from '@sanity/ui';

function createPatchFrom(value) {
  return PatchEvent.from(value === '' ? unset() : set(Number(value)));
}

const formatMoney = Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
}).format;

const PriceInput = React.forwardRef(({
  type,         // Schema information
  value,        // Current field value
  readOnly,     // Boolean if field is not editable
  placeholder,  // Placeholder text from the schema
  markers,      // Markers including validation rules
  presence,     // Presence information for collaborative avatars
  compareValue, // Value to check for "edited" functionality
  onFocus,      // Method to handle focus state
  onBlur,       // Method to handle blur state
}, ref) => (
  <FormField
    description={type.description}
    title={type.title}
    compareValue={compareValue}
  >
    <Stack space={3}>
      <TextInput
        type={type.name}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={event => onChange(createPatchFrom(event.target.value))}
        ref={ref}
      />

      <Text size={0}>
        Please enter the amount in cents.
      </Text>

      <Text size={1}>
        Specified amount for the upgrade is {value ? formatMoney(value / 100) : ''}.
      </Text>
    </Stack>
  </FormField>
));

export default PriceInput;