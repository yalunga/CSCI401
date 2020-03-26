import React, { useState } from 'react';
import {
  Box,
  Text,
  TextInput,
  Layer,
  Heading,
  Select
} from 'grommet';
export default ({ editFirstName, editLastName, editEmail, editUserType, editSemester, closeModal }: any) => {
  const [firstName, setFirstName] = useState(editFirstName);
  const [lastName, setLastName] = useState(editLastName);
  const [email, setEmail] = useState(editEmail);
  const [userType, setUserType] = useState(editUserType);

  const onChangeUserType = ({ option }: any) => {
    setUserType(option);
  }

  const submitEdit = () => {
    var request = new XMLHttpRequest();
    request.withCredentials = true;
    request.open('POST', `${process.env.REACT_APP_API_URL}/users/update-info`);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    var data = JSON.stringify({
      firstName,
      lastName,
      userType,
      semester: editSemester,
      email,
      originalEmail: editEmail
    });
    request.setRequestHeader('Cache-Control', 'no-cache');
    request.send(data);
    alert('User has been updated succesfully!');
    window.location.reload();
    closeModal();
  }

  return (
    <Layer position='top' modal margin={{ top: 'xlarge' }}>
      <Box pad='medium' gap='small'>
        <Heading level={3} margin='none'>Edit</Heading>
        <Box direction='row' gap='small' width='full'>
          <Box basis='1/3' align='center' justify='center'>
            <Text size='medium' weight='bold'>First Name</Text>
          </Box>
          <Box border='all' round='xxsmall' width='medium'>
            <TextInput height='small' plain value={firstName} name='editFirstName' onChange={(e) => setFirstName(e.target.value)} />
          </Box>
        </Box>
        <Box direction='row' gap='small' width='full'>
          <Box basis='1/3' align='center' justify='center'>
            <Text size='medium' weight='bold'>Last Name</Text>
          </Box>
          <Box border='all' round='xxsmall' width='medium'>
            <TextInput height='small' plain value={lastName} name='editLastName' onChange={(e) => setLastName(e.target.value)} />
          </Box>
        </Box>
        <Box direction='row' gap='small' width='full'>
          <Box basis='1/3' align='center' justify='center'>
            <Text size='medium' weight='bold'>Email</Text>
          </Box>
          <Box border='all' round='xxsmall' width='medium'>
            <TextInput height='small' plain value={email} name='editEmail' onChange={(e => setEmail(e.target.value))} />
          </Box>
        </Box>
        <Box direction='row' gap='small' width='full'>
          <Box basis='1/3' align='center' justify='center'>
            <Text size='medium' weight='bold'>User Type</Text>
          </Box>
          <Box border='all' round='xxsmall' width='medium'>
            <Select options={['Admin', 'Student', 'Stakeholder']} plain value={userType} name='editUserType' onChange={onChangeUserType} />
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
          <Box width='xsmall' elevation='xsmall' background='#FFCB02' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={submitEdit}>
            <Text>Edit</Text>
          </Box>
          <Box width='xsmall' elevation='xsmall' background='light-4' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={closeModal}>
            <Text>Cancel</Text>
          </Box>
        </Box>
      </Box>
    </Layer>
  );
}