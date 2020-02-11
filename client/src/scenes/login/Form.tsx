import * as React from 'react';

import { Box, TextInput, Text } from 'grommet';

interface LoginProps { }
interface LoginState {
  email: string;
  password: string;
  token: string;
  errorMsg: string;
}

export default class LoginForm extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      token: '',
      errorMsg: ''
    };
    this.getToken = this.getToken.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearErrorMessage = this.clearErrorMessage.bind(this);
  }

  async getToken() {
    if (!this.state.email) {
      return this.setState({ errorMsg: 'Email is required.' });
    }
    if (!this.state.password) {
      return this.setState({ errorMsg: 'Password is required.' });
    }
    let data = JSON.stringify({
      email: this.state.email,
      password: this.state.password
    });
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const responseText = await response.text();
    if (responseText.length > 4) {
      if (responseText === 'Email not found.' || responseText === 'Incorrect password.') {
        this.setState({ errorMsg: responseText });
      }
      var resp = responseText.split(',', 2);
      if (resp.length === 2) {
        var type = resp[1];
        sessionStorage.setItem('userType', type);
        if (type === 'Student') {
          window.location.href = '/student';
        }
        if (type === 'Admin') {
          window.location.href = '/admin';
        }
        if (type === 'Stakeholder') {
          window.location.href = '/stakeholder';
        }
        var token = resp[0];
        sessionStorage.setItem('jwt', token);
      }
      sessionStorage.setItem('email', this.state.email);
    }
  }

  handleChange(e: any) {
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.value });
  }

  clearErrorMessage() {
    this.setState({ errorMsg: '' });
  }

  render() {
    const { email, password, errorMsg } = this.state;
    return (
      <Box gap="medium">
        <Box border='all' round='xxsmall'>
          <TextInput
            type='email'
            placeholder='Email'
            size='small'
            plain
            name='email'
            onChange={this.handleChange}
            onFocus={this.clearErrorMessage}
            value={email}
          />
        </Box>
        <Box border='all' round='xxsmall'>
          <TextInput
            type='password'
            placeholder='Password'
            size='small'
            plain
            name='password'
            onChange={this.handleChange}
            onFocus={this.clearErrorMessage}
            value={password}
          />
        </Box>
        {errorMsg && <Text size='small' weight='bold' color='status-error'>{errorMsg}</Text>}
        <Box gap='small'>
          <Box background='brand' width='small' pad='xsmall' align='center' round='xxsmall' alignSelf='center' onClick={this.getToken}>
            <Text>Login</Text>
          </Box>
          <Text textAlign='center' size='small' color='dark-5'>Forgot Password?</Text>
        </Box>
      </Box>
    );
  }
}