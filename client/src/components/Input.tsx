import * as React from 'react';
import { Box, Text, TextInput } from 'grommet';

export default (props: any) => (
  <Box gap='xxxsmall'>
    <Text size='small' color='dark-4' weight='bold'>{props.title}</Text>
    <Box border='bottom'>
      <TextInput
        {...props}
        plain
        style={{ padding: 1 }}
        name={props.name}
        onChange={props.onChange}
        value={props.value}
        onFocus={props.onFocus}
      />
    </Box>
  </Box>
);