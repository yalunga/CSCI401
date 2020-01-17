import * as React from 'react';
import { Box, Text, Select } from 'grommet';

export default (props: any) => (
  <Box border='bottom' round='xxsmall' width='medium'>
    <Text></Text>
    <Select options={['Admin', 'Student', 'Stakeholder']} plain name='editUserType' />
  </Box>
);