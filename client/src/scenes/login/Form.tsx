import * as React from 'react';
import {
  Form,
  FormGroup,
  Col,
  FormControl,
  Button,
  ControlLabel
} from 'react-bootstrap';

interface LoginProps {
}
interface LoginState {
  email: string;
  password: string;
  token: string;
  errorMsg: string;
}
class LoginForm extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      token: '',
      errorMsg: ''
    };
    this.submitClicked = this.submitClicked.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }
  submitClicked() {
    this.getToken();
  }

  resetPassword() {
    var request = new XMLHttpRequest();
    var hostname = window.location.hostname;
    request.withCredentials = true;
    request.open('POST', 'http://' + hostname + ':8080/users/password-reset');
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    var data = JSON.stringify({
      email: this.state.email,
    });
    request.setRequestHeader('Cache-Control', 'no-cache');
    request.send(data);
    alert('Password reset email sent.');
  }

  async getToken() {
    if (!this.state.email) {
      return this.setState({ errorMsg: 'Email is required.' });
    }
    if (!this.state.password) {
      return this.setState({ errorMsg: 'Password is required.' });
    }
    var hostname = window.location.hostname;
    var data = JSON.stringify({
      email: this.state.email,
      password: this.state.password
    });
    const response = await fetch('http://' + hostname + ':8080/users/login', {
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
    this.setState({ [e.target.id]: e.target.value });
  }

  render() {
    return (
      <div>
        <Form horizontal={true} >
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={2}>
              Email
                </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                id="email"
                value={this.state.email}
                placeholder="Email"
                onChange={e => this.handleChange(e)}
                onFocus={() => this.setState({ errorMsg: '' })}
              />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <Col componentClass={ControlLabel} sm={2}>
              Password
                </Col>
            <Col sm={10}>
              <FormControl
                type="password"
                placeholder="Password"
                id="password"
                value={this.state.password}
                onChange={e => this.handleChange(e)}
                onFocus={() => this.setState({ errorMsg: '' })}
              />
            </Col>
          </FormGroup>

          {this.state.errorMsg && (
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <span style={{ color: 'red' }}>{this.state.errorMsg}</span>
              </Col>
            </FormGroup>
          )}

          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button type="reset" onClick={this.submitClicked}>Sign in</Button>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button type="reset" onClick={this.resetPassword}>Reset Password</Button>
            </Col>
          </FormGroup>

        </Form>
      </div>
    );
  }
}

export default LoginForm;
