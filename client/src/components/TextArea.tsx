import * as React from 'react';
import { Box, Text, TextArea } from 'grommet';

export default (props: any) => (
  <Box gap='xxxsmall'>
    <Text size='small' color='dark-4' weight='bold'>{props.title}</Text>
    <Box border='bottom'>
      <TextArea
        plain
        onChange={props.onChange}
        name={props.name}
        value={props.value}
        resize={props.resize}
      />
    </Box>
  </Box>
)