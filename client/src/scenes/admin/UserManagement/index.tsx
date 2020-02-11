import * as React from 'react';

import {
  Box,
  Text,
  TextInput,
  Layer,
  DataTable,
  Heading,
  Select
} from 'grommet';
import EmailForms from './EmailForms';
import TableHeader from '../../TableHelpers/TableHeaders';

interface UserListProps { }

interface UserListState {
  allUsers: Array<{}>;
  usersToDisplay: Array<{}>;
  userIndexToEdit: number;
  userToEdit?: User;
  userToDelete?: User;
  editFirstName?: string;
  editLastName?: string;
  editUserType?: string;
  editSemester?: string;
  editEmail?: string;
  originalEmail?: string;
  isLoading: boolean;
}

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  fall_spring: number;
  semester: string;
  userType: string;
  email: string;
}

export default class UserManagement extends React.Component<UserListProps, UserListState> {
  constructor(props: UserListProps) {
    super(props);
    this.state = {
      allUsers: [],
      usersToDisplay: [],
      userIndexToEdit: -1,
      isLoading: false,
    };
    this.editUser = this.editUser.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChangeUserType = this.onChangeUserType.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    if (sessionStorage.getItem('viewingYear') === null) {
      sessionStorage.setItem('viewingYear', '2020');
    }
    if (sessionStorage.getItem('viewingFallSpring') === null) {
      sessionStorage.setItem('viewingFallSpring', '1');
    }
    fetch(`${process.env.REACT_APP_API_URL}/users/getusersfromsemester/` + sessionStorage.getItem('viewingYear') + '/' + sessionStorage.getItem('viewingFallSpring'), {
      method: 'get',
      headers: new Headers({
        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
      })
    })
      .then(response => response.json())
      .then(data => this.setState({ allUsers: data, usersToDisplay: data, isLoading: false }));
  }

  editUser(user: User) {
    this.setState({
      userToEdit: user,
      editFirstName: user.firstName,
      editLastName: user.lastName,
      editUserType: user.userType,
      editSemester: user.semester,
      editEmail: user.email,
      originalEmail: user.email
    });
  }

  closeModal() {
    this.setState({
      userToEdit: undefined,
      editFirstName: undefined,
      editLastName: undefined,
      editUserType: undefined,
      editSemester: undefined,
      editEmail: undefined,
      originalEmail: undefined
    })
  }

  handleChange(e: any) {
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.value });
  }

  onChangeUserType({ option }: any) {
    this.setState({ editUserType: option });
  }

  deleteUser(user: User) {
    this.setState({ userToDelete: user });
    var request = new XMLHttpRequest();
    request.withCredentials = true;
    request.open('POST', `${process.env.REACT_APP_API_URL}/users/delete-info`);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    var data = JSON.stringify({
      email: user.email
    });
    request.setRequestHeader('Cache-Control', 'no-cache');
    request.send(data);
    window.location.reload();
  }

  submitEdit = () => {
    var request = new XMLHttpRequest();
    request.withCredentials = true;
    request.open('POST', `${process.env.REACT_APP_API_URL}/users/update-info`);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    var data = JSON.stringify({
      firstName: this.state.editFirstName,
      lastName: this.state.editLastName,
      userType: this.state.editUserType,
      semester: this.state.editSemester,
      email: this.state.editEmail,
      originalEmail: this.state.originalEmail
    });
    request.setRequestHeader('Cache-Control', 'no-cache');
    request.send(data);
    alert('User has been updated succesfully!');
    window.location.reload();
    this.setState({ userToEdit: undefined });
  }

  render() {
    const columns = [
      {
        property: 'firstName',
        header: <TableHeader>First Name</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.firstName}</Text>
        )
      },
      {
        property: 'lastName',
        header: <TableHeader>Last Name</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.lastName}</Text>
        ),
      },
      {
        property: 'userType',
        header: <TableHeader>User Type</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.userType}</Text>
        ),
      },
      {
        property: 'email',
        header: <TableHeader>Email</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.email}</Text>
        ),
      },
      {
        property: 'editDelete',
        header: <TableHeader>Edit/Delete</TableHeader>,
        render: (datum: any) => {
          return (
            <Box direction='row' gap='xsmall'>
              <Box width='xsmall' elevation='xsmall' background='#FFCB02' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={() => this.editUser(datum)}>
                <Text>Edit</Text>
              </Box>
              <Box width='xsmall' elevation='xsmall' background='status-error' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={() => this.deleteUser(datum)}>
                <Text>Delete</Text>
              </Box>
            </Box>
          )
        },
      }
    ];
    const { allUsers, userToEdit } = this.state;
    let modal = <div></div>;
    if (userToEdit !== undefined) {
      modal = (
        <Layer position='top' modal margin={{ top: 'xlarge' }}>
          <Box pad='medium' gap='small'>
            <Heading level={3} margin='none'>Edit</Heading>
            <Box direction='row' gap='small' width='full'>
              <Box basis='1/3' align='center' justify='center'>
                <Text size='medium' weight='bold'>First Name</Text>
              </Box>
              <Box border='all' round='xxsmall' width='medium'>
                <TextInput height='small' plain value={this.state.editFirstName} name='editFirstName' onChange={this.handleChange} />
              </Box>
            </Box>
            <Box direction='row' gap='small' width='full'>
              <Box basis='1/3' align='center' justify='center'>
                <Text size='medium' weight='bold'>Last Name</Text>
              </Box>
              <Box border='all' round='xxsmall' width='medium'>
                <TextInput height='small' plain value={this.state.editLastName} name='editLastName' onChange={this.handleChange} />
              </Box>
            </Box>
            <Box direction='row' gap='small' width='full'>
              <Box basis='1/3' align='center' justify='center'>
                <Text size='medium' weight='bold'>Email</Text>
              </Box>
              <Box border='all' round='xxsmall' width='medium'>
                <TextInput height='small' plain value={this.state.editEmail} name='editEmail' onChange={this.handleChange} />
              </Box>
            </Box>
            <Box direction='row' gap='small' width='full'>
              <Box basis='1/3' align='center' justify='center'>
                <Text size='medium' weight='bold'>User Type</Text>
              </Box>
              <Box border='all' round='xxsmall' width='medium'>
                <Select options={['Admin', 'Student', 'Stakeholder']} plain value={this.state.editUserType} name='editUserType' onChange={this.onChangeUserType} />
              </Box>
            </Box>
            <Box direction='row' gap='small' width='full'>
              <Box basis='1/3' align='center' justify='center'>
                <Text size='medium' weight='bold'>Project Assignment</Text>
              </Box>
              <Box border='all' round='xxsmall' width='medium'>
                <Select options={[]} plain />
              </Box>
            </Box>
            <Box width='full' justify='end' direction='row' gap='small'>
              <Box width='xsmall' elevation='xsmall' background='#FFCB02' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={this.submitEdit}>
                <Text>Edit</Text>
              </Box>
              <Box width='xsmall' elevation='xsmall' background='light-4' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={this.closeModal}>
                <Text>Cancel</Text>
              </Box>
            </Box>
          </Box>
        </Layer>
      );
    }
    return (
      <Box width='full' pad='medium' gap='medium'>
        <Text weight='bold' size='large'>User Management</Text>
        <EmailForms />
        <Box pad='medium' background='white' elevation='xsmall' round='xxsmall' margin={{ top: 'medium' }} overflow='auto'>
          <DataTable
            columns={columns.map(column => ({
              ...column,
              search: column.property === 'firstName' || column.property === 'lastName'
            }))}
            data={allUsers}
          />
        </Box>
        {modal}
      </Box >
    );
  }
}