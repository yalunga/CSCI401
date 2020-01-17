import * as React from 'react';
import { Box, TextInput, Text } from 'grommet';
import { ClipLoader } from "react-spinners";

interface StakeholderRegistrationProps { }
interface StakeholderRegistrationState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  loading: boolean;
  accountCreated: boolean;
}

export default class StudentRegistrationForm extends React.Component<StakeholderRegistrationProps, StakeholderRegistrationState> {
  constructor(props: StakeholderRegistrationProps) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirm: '',
      loading: false,
      accountCreated: false
    };
    this.submitClicked = this.submitClicked.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  async submitClicked() {
    this.setState({ loading: true });
    if (this.state.firstName === '' || this.state.lastName === '' || this.state.email === '' || this.state.phone === '' || this.state.confirm === '' || this.state.password === '') {
      this.setState({ loading: false });
      return alert('Please fill in all the information.');
    }
    if (this.state.firstName !== '' && this.state.lastName !== '' && this.state.email !== '' && this.state.phone !== '' && this.state.confirm !== '' && this.state.password !== '' && this.state.password !== this.state.confirm) {
      this.setState({ loading: false });
      return alert('Your passwords do not match. Please try again.');
    }
    var data = JSON.stringify({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      phone: this.state.phone,
      password: this.state.password
    });
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/users/student-registration`, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      this.setState({ accountCreated: true });
      setTimeout(function () { window.location.href = '/'; }, 1500);
    } catch (error) {
      return alert('There was an error trying to create your account.');
    };
  }

  handleChange(e: any) {
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const { firstName, lastName, email, phone, password, confirm, loading, accountCreated } = this.state;
    return (
      <Box gap='small' pad='small'>
        <Text weight='bold' size='large' margin={{ top: 'small' }}>Student Registration</Text>
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
            {!loading &&
              <Box background='brand' width='small' pad='xsmall' align='center' round='xxsmall' alignSelf='start' onClick={this.submitClicked}>
                <Text>Register</Text>
              </Box>
            }
          </Box>
        </Box>
      </Box>
    )
  }
}