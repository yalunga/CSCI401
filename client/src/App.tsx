import React from 'react';
import {
  Route,
  BrowserRouter,
  Switch,
  Redirect
} from 'react-router-dom';
import { Grommet, ThemeType } from 'grommet'

import './App.css';
import LandingPage from './scenes/login/index';
import AdminHome from './scenes/admin/AdminNavigation';
import Register from './scenes/register';
import StakeholderHome from './scenes/stakeholder/StakeholderNavigation';
import StudentHome from './scenes/student/StudentNavigation';

const theme: ThemeType = {
  global: {
    colors: {
      brand: '#990000'
    },
    font: {
      family: 'Nunito, sans-serif'
    },
    input: {
      weight: 400
    },
    focus: {
      border: {
        color: 'none'
      }
    },
    control: {
      disabled: {
        opacity: 1
      }
    }
  },
  textArea: {
    extend: () => `
      font-size: 14px;
      padding: 7px;
     `
  }
}

const AdminPrivateRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) => (
      sessionStorage.getItem('jwt') !== null
        && sessionStorage.getItem('userType') === 'Admin'
        ? <Component {...props} />
        :
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location }
          }}
        />
    )}
  />
);

const StudentPrivateRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) => (
      sessionStorage.getItem('jwt') !== null
        && sessionStorage.getItem('userType') === 'Student'
        ? <Component {...props} />
        :
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location }
          }}
        />
    )}
  />
);

const StakeholderPrivateRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) => (
      sessionStorage.getItem('jwt') !== null
        && sessionStorage.getItem('userType') === 'Stakeholder'
        ? <Component {...props} />
        :
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location }
          }}
        />
    )}
  />
);

const App: React.FC = () => {
  return (
    <Grommet style={{ minHeight: '100vh' }} theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <Route path='/register' component={Register} />
          <AdminPrivateRoute path='/admin' component={AdminHome} />
          <StakeholderPrivateRoute path='/stakeholder' component={StakeholderHome} />
          <StudentPrivateRoute path='/student' component={StudentHome} />
        </Switch>
      </BrowserRouter>
    </Grommet>
  );
}

export default App;
