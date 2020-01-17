import * as React from 'react';
import {
  Box,
  Text,
  Image,
  Anchor
} from 'grommet';

import LoginForm from './Form';

export default class Login extends React.Component {
  render() {
    return (
      <Box width='full' height='full'>
        <Box width='full' pad={{ horizontal: 'small' }} elevation='xsmall' background='white' direction='row'>
          <Box width='small'>
            <Image fit='contain' src='https://16mhpx3atvadrnpip2kwi9or-wpengine.netdna-ssl.com/wp-content/uploads/2016/10/USC-Shield.png' />
          </Box>
        </Box>
        <Box width='full' align='center' justify='center' gap='medium'>
          <Box width='medium' pad='small' elevation='small' round='xsmall' margin={{ top: 'large' }}>
            <LoginForm />
          </Box>
          <Text size='small'>
            Interested in being a stakeholder for a project?
            <Anchor href='/register/stakeholder'> Register here.</Anchor>
          </Text>
        </Box>
      </Box>
    )
  }
}