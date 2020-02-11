import * as React from 'react';
import { Text } from 'grommet';

export default ({ children }: any) => (
  <Text
    size='xsmall'
    weight='bold'
    color='dark-5'
    style={{ textTransform: 'uppercase', letterSpacing: 2 }}
  >
    {children}
  </Text>
);
