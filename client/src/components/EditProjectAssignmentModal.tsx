import React, { useState } from 'react';
import {
  Box,
  Text,
  TextInput,
  Layer,
  Heading,
  Select
} from 'grommet';
export default ({
  editFirstName,
  editLastName,
  editProject,
  closeModal,
  projects,
  moveStudent }: any
) => {
  const [firstName, setFirstName] = useState(editFirstName);
  const [lastName, setLastName] = useState(editLastName);
  const [userProject, setUserProject] = useState(editProject);

  const submitEdit = () => {
    moveStudent(userProject.projectId);
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
            <TextInput disabled height='small' plain value={firstName} name='editFirstName' onChange={(e) => setFirstName(e.target.value)} />
          </Box>
        </Box>
        <Box direction='row' gap='small' width='full'>
          <Box basis='1/3' align='center' justify='center'>
            <Text size='medium' weight='bold'>Last Name</Text>
          </Box>
          <Box border='all' round='xxsmall' width='medium'>
            <TextInput disabled height='small' plain value={lastName} name='editLastName' onChange={(e) => setLastName(e.target.value)} />
          </Box>
        </Box>
        <Box direction='row' gap='small' width='full'>
          <Box basis='1/3' align='center' justify='center'>
            <Text size='medium' weight='bold'>Project Assignment</Text>
          </Box>
          <Box border='all' round='xxsmall' width='medium'>
            <Select
              options={projects}
              plain
              children={(option: any) => (
                <Box pad='small'>
                  <Text>{option.projectName}</Text>
                </Box>
              )}
              value={
                <Box pad='small'>
                  <Text>
                    {userProject ? userProject.projectName : ''}
                  </Text>
                </Box>
              }
              onChange={({ option }) => setUserProject(option)}
            />
          </Box>
        </Box>
        <Box width='full' justify='end' direction='row' gap='small'>
          <Box width='xsmall' elevation='xsmall' background='#FFCB02' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={submitEdit}>
            <Text>Edit</Text>
          </Box>
          {editProject &&
            <Box width='small' elevation='xsmall' background='light-4' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={() => { moveStudent(null); closeModal(); }}>
              <Text>Remove From Project</Text>
            </Box>
          }
          <Box width='xsmall' elevation='xsmall' background='light-4' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={closeModal}>
            <Text>Cancel</Text>
          </Box>
        </Box>
      </Box>
    </Layer>
  );
}