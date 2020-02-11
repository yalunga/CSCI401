import * as React from 'react';
import { Box, Text } from 'grommet';

export default (props: any) => (
  <Box
    pad='medium'
    width='small'
    elevation='medium'
    round='xxsmall'
    background='brand'
    animation={{
      type: 'fadeIn',
      delay: 500,
      duration: 500,
      size: 'large'
    }}
    style={{
      position: 'absolute',
      top: '15px',
      right: '15px'
    }}
  >
    <Text>{props.text}</Text>
  </Box>
);