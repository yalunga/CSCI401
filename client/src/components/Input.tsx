import * as React from 'react';
import { Box, Text, TextInput } from 'grommet';

export default (props: any) => (
  <Box gap='xxxsmall'>
    <Text size='small' color='dark-4'>{props.title}</Text>
    <Box border='bottom'>
      <TextInput
        plain
        style={{ padding: 1 }}
        name={props.name}
        onChange={props.handleChange}
        value={props.value}
        onFocus={props.clearErrorMessage}
      />
    </Box>
  </Box>
);