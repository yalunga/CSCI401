import * as React from 'react';
import { Box, Text, Select } from 'grommet';

export default (props: any) => (
  <Box border='bottom' round='xxsmall' width='medium'>
    <Text size='small' color='dark-4' weight='bold'>{props.title}</Text>
    <Select plain {...props} />
  </Box>
);