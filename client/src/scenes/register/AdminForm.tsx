import * as React from 'react';
import { Box, Text, TextInput, Anchor } from 'grommet';
import { ClipLoader } from "react-spinners";
// import { Alert } from 'grommet-icons';

interface AdminRegistrationProps { }
interface AdminRegistrationState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  errorMsg: string;
  fallSpring: string | null;
  semester: string | null;
  loading: boolean;
  accountCreated: boolean;
}

export default class AdminForm extends React.Component<AdminRegistrationProps, AdminRegistrationState> {
  constructor(props: AdminRegistrationProps) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirm: '',
      errorMsg: '',
      fallSpring: '',
      semester: '',
      loading: false,
      accountCreated: false
    };
    this.submitClicked = this.submitClicked.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearErrorMessage = this.clearErrorMessage.bind(this);
  }

  async submitClicked() {
    this.setState({ loading: true });
    if (this.state.firstName === '' || this.state.lastName === '' || this.state.email === '' || this.state.phone === '' || this.state.confirm === '' || this.state.password === '') {
      this.setState({ errorMsg: 'Please fill in all the information.', loading: false });
      return;
    }
    if (this.state.password !== this.state.confirm) {
      this.setState({ errorMsg: 'Your passwords do not match. Please try again.', loading: false });
      return;
    }
    if(this.state.phone.length !== 10 && this.state.phone.length !== 12){
      this.setState({ loading: false });
      return alert('Please enter a valid phone number.');
    }
    var data = JSON.stringify({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      phone: this.state.phone,
      password: this.state.password
    });
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/admin-registration`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const responseText = await response.text();
    if (responseText === 'This email has not recieved an invite.'
      || responseText === 'This email is registered as a student.'
      || responseText === 'This email is registered as an admin.') {
      this.setState({ errorMsg: responseText, loading: false });
    } else if (responseText === 'success') {
      this.setState({ accountCreated: true });
      setTimeout(function () { window.location.href = '/'; }, 1500);
    }
    console.log(responseText);
  }

  handleChange(e: any) {
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.value });
  }

  clearErrorMessage() {
    this.setState({ errorMsg: '' });
  }

  render() {
    const { loading, accountCreated, firstName, lastName, email, phone, password, confirm, errorMsg } = this.state;
    return (
      <Box gap='small' pad='small'>
        <Text weight='bold' size='large' margin={{ top: 'small' }}>Admin Registration</Text>
        <Box width='full' align='center'>
          <Box elevation='xsmall' round='xxsmall' width='medium' pad='small' gap='small'>
            {!loading ? (
              <Box gap='small'>
                <Box gap='xxxsmall'>
                  <Text size='small' color='dark-4'>First Name</Text>
                  <Box border='bottom'>
                    <TextInput
                      plain
                      style={{ padding: 1 }}
                      name='firstName'
                      onChange={this.handleChange}
                      value={firstName}
                      onFocus={this.clearErrorMessage}
                    />
                  </Box>
                </Box>
                <Box gap='xxxsmall'>
                  <Text size='small' color='dark-4'>Last Name</Text>
                  <Box border='bottom'>
                    <TextInput
                      plain
                      style={{ padding: 1 }}
                      name='lastName'
                      onChange={this.handleChange}
                      value={lastName}
                      onFocus={this.clearErrorMessage}
                    />
                  </Box>
                </Box>
                <Box gap='xxxsmall'>
                  <Text size='small' color='dark-4'>Email</Text>
                  <Box border='bottom'>
                    <TextInput
                      plain
                      style={{ padding: 1 }}
                      name='email'
                      onChange={this.handleChange}
                      value={email}
                      type='email'
                      onFocus={this.clearErrorMessage}
                    />
                  </Box>
                </Box>
                <Box gap='xxxsmall'>
                  <Text size='small' color='dark-4'>Phone</Text>
                  <Box border='bottom'>
                    <TextInput
                      plain
                      style={{ padding: 1 }}
                      name='phone'
                      onChange={this.handleChange}
                      value={phone}
                      type='phone'
                      onFocus={this.clearErrorMessage}
                    />
                  </Box>
                </Box>
                <Box gap='xxxsmall'>
                  <Text size='small' color='dark-4'>Password</Text>
                  <Box border='bottom'>
                    <TextInput
                      plain
                      style={{ padding: 1 }}
                      name='password'
                      onChange={this.handleChange}
                      value={password}
                      type='password'
                      onFocus={this.clearErrorMessage}
                    />
                  </Box>
                </Box>
                <Box gap='xxxsmall'>
                  <Text size='small' color='dark-4'>Confirm Password</Text>
                  <Box border='bottom'>
                    <TextInput
                      plain
                      style={{ padding: 1 }}
                      name='confirm'
                      onChange={this.handleChange}
                      value={confirm}
                      type='password'
                      onFocus={this.clearErrorMessage}
                    />
                  </Box>
                </Box>
              </Box>)
              :
              <Box width='full' align='center' pad='small'>
                {!accountCreated ?
                  <ClipLoader size={150} color='#990000' />
                  :
                  <Box animation='fadeIn' align='center' width='full'>
                    <Text color='brand'>Success!</Text>
                  </Box>
                }
              </Box>

            }
            {errorMsg && <Text color='brand' size='small'>{errorMsg}</Text>}
            {!loading &&
              <Box background='brand' width='small' pad='xsmall' align='center' round='xxsmall' alignSelf='start' onClick={this.submitClicked}>
                <Text>Register</Text>
              </Box>
            }
          </Box>
        </Box>
        <Box align='center'>
          <Text size='small'>
            Already Registered?
            <Anchor href='/'> Back to Login Page.</Anchor>
          </Text>
        </Box>
      </Box>
    );
  }
}