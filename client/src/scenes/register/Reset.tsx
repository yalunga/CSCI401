import * as React from 'react';
import { Box, TextInput, Text, Stack, Anchor } from 'grommet';
import { ClipLoader } from "react-spinners";


interface ResetProps { }
interface ResetState {
  email: string;
  password: string;
  confirm: string;
  loading: boolean;
  alert: boolean;
  passReset: boolean;
}

export default class Reset extends React.Component<ResetProps, ResetState> {
  constructor(props: ResetProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirm: '',
      loading: false,
      alert: false,
      passReset: false
    };
    this.submitClicked = this.submitClicked.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  async submitClicked() {
    this.setState({ loading: true });
    if (this.state.email === '' || this.state.password === '' || this.state.confirm === '') {
      this.setState({ loading: false });
      return alert('Please fill in all the information.');
    }
    if (this.state.email !== '' && this.state.password !== '' && this.state.confirm !== '' && this.state.password !== this.state.confirm) {
      this.setState({ loading: false });
      return alert('Your passwords do not match. Please try again.');
    }
    var data = JSON.stringify({
      email: this.state.email,
      newPass: this.state.password,
    });
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/reset-password`, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      this.setState({ passReset: true });
      setTimeout(function () { window.location.href = '/'; }, 1500);
    } catch (error) {
      return alert('There was an error trying to reset your password.');
    };
  }

  handleChange(e: any) {
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const { email, password, confirm, loading, passReset} = this.state;
    return (
      <Box gap='small' pad='small'>
        <Text weight='bold' alignSelf='center' size='large' margin={{ top: 'small' }}>Password Reset</Text>
        <Box width='full' align='center'>
          <Box elevation='xsmall' round='xxsmall' width='medium' pad='small' gap='small'>
            {!loading ? (
              <Box gap='small'>
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
                  <Text size='small' color='dark-4'>New Password</Text>
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
                  <Text size='small' color='dark-4'>Confirm New Password</Text>
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
                {!passReset ?
                  <ClipLoader size={150} color='#990000' />
                  :
                  <Box animation='fadeIn' align='center' width='full'>
                    <Text color='brand'>Success!</Text>
                  </Box>
                }
              </Box>

            }
            {!loading &&
              <Box background='brand' width='small' pad='xsmall' align='center' round='xxsmall' alignSelf='center' onClick={this.submitClicked}>
                <Text>Reset Password</Text>
              </Box>
            }
          </Box>
        </Box>
        <Box align='center'>
          <Text size='small'>
            <Anchor href='/'> Back to Login Page.</Anchor>
          </Text>
        </Box>
      </Box>
    )
  }
}