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
  closeModal,
  projects,
  moveStudent,
  unassignedStudents }: any
) => {
  const [usersProjects, setUsersProject]: any = useState({});

  const setProject = (userId: number, project: any) => {
    const currentProjects = usersProjects;
    currentProjects[userId] = project;
    setUsersProject({ ...currentProjects });
    console.log(usersProjects[userId]);
  }

  const submitEdit = () => {
    for (const student of unassignedStudents) {
      const project = usersProjects[student.userId];
      if (project) {
        moveStudent(student, project.projectId);
      }
    }
    closeModal();
  }
  console.log(usersProjects);
  return (
    <Layer position='top' modal margin={{ top: 'xlarge' }}>
      <Box pad='medium' gap='small'>
        <Heading level={3} margin='none'>Unassigned Students</Heading>
        {unassignedStudents.map((student: any) => (
          <Box direction='row' gap='small' width='full'>
            <Box basis='1/3' align='center' justify='center'>
              <Text size='medium' weight='bold'>{student.firstName} {student.lastName}</Text>
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
                      {usersProjects[student.userId] ? usersProjects[student.userId].projectName : 'Not Assigned'}
                    </Text>
                  </Box>
                }
                onChange={({ option }) => setProject(student.userId, option)}
              />
            </Box>
          </Box>
        ))}
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