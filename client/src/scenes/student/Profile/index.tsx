import * as React from 'react';
import { Box, Text, TextInput } from 'grommet';
import { ClipLoader } from 'react-spinners';

interface ProfileProps { }
interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  semester: number;
}
interface ProfileState {
  user: User;
  isLoading: boolean;
}

export default class StudentProfile extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);
    this.state = {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organization: '',
        semester: 0
      },
      isLoading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch(`${process.env.REACT_APP_API_URL}/users/` + sessionStorage.getItem('email')) // link
      .then(response => response.json())
      .then(data => this.setState({
        user: data,
        isLoading: false
      }))
      .catch((error) => {
        console.log('error: ' + error);
      });
  }

  handleChange(e: any) {
    // @ts-ignore
    var user = { ...this.state.user };
    // @ts-ignore
    user[e.target.name] = e.target.value;
    this.setState({
      user
    });
  }

  handleSubmit(e: any) {
    this.setState({ isLoading: true })
    fetch(`${process.env.REACT_APP_API_URL}/users/update-info`, {
      method: 'POST',
      body: JSON.stringify({
        email: sessionStorage.getItem('email'),
        phone: this.state.user.phone,
        password: '',
        firstName: this.state.user.firstName,
        lastName: this.state.user.lastName,
        userType: '',
        semester: this.state.user.semester,
        organization: this.state.user.organization
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      this.setState({ isLoading: false })
      return res.json()
    }).catch((err) => console.log(err));
  }
  render() {
    const { user: { firstName, lastName, phone }, isLoading } = this.state;
    return (
      <Box width='full' align='center' pad='medium'>
        <Box width='large' elevation='xsmall' background='white' round='xxsmall' pad='small' gap='small'>
          <Box width='full' border={{ side: 'bottom', color: 'light-4', size: '1px' }} pad={{ vertical: 'xsmall' }}>
            <Text weight='bold'>Edit Profile</Text>
          </Box>
          {!isLoading ?
            <Box gap='medium'>
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
                <Text size='small' color='dark-4'>Phone</Text>
                <Box border='bottom'>
                  <TextInput
                    plain
                    style={{ padding: 1 }}
                    name='phone'
                    onChange={this.handleChange}
                    value={phone}
                  />
                </Box>
              </Box>
              <Box background='brand' width='small' pad='xsmall' align='center' round='xxsmall' alignSelf='start' onClick={this.handleSubmit}>
                <Text>Edit</Text>
              </Box>
            </Box>
            :
            <Box width='full' align='center' pad='small'>
              <ClipLoader size={150} color='#990000' />
            </Box>
          }
        </Box>
      </Box>
    );
  }
}