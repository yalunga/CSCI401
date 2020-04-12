import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Box, Image } from 'grommet';

import StudentForm from './StudentForm';
import StakeholderForm from './StakeholderForm';
import AdminForm from './AdminForm';
import Reset from './Reset';

export default class Register extends React.Component {
  render() {
    return (
      <Box width='full' height='full'>
        <Box width='full' pad={{ horizontal: 'small' }} elevation='xsmall' background='white' direction='row'>
          <Box width='small'>
            <Image fit='contain' src='https://16mhpx3atvadrnpip2kwi9or-wpengine.netdna-ssl.com/wp-content/uploads/2016/10/USC-Shield.png' />
          </Box>
        </Box>
        <BrowserRouter>
          <Switch>
            <Route path="/register/student" component={StudentForm} />
            <Route path="/register/stakeholder" component={StakeholderForm} />
            <Route path="/register/admin" component={AdminForm} />
            <Route path="/register/reset" component={Reset} />
          </Switch>
        </BrowserRouter>
      </Box>
    );
  }
}