import React, { useState, useEffect } from 'react';
import { Text, Box, Anchor } from 'grommet';

export default () => {


  const [approvedProjects, setApprovedProjects]: any = useState([]);

  useEffect((): any => {
    const getProjects = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/getprojectsfromsemester/` + sessionStorage.getItem('viewingYear') + '/' + sessionStorage.getItem('viewingFallSpring'));
      const projects = await response.json();
      const acceptedProjects = [];
      for (const project of projects) {
        if (project.statusId === 2) {
          acceptedProjects.push(project);
        }
      }
      setApprovedProjects(acceptedProjects);
    }
    getProjects();
  }, []);

  const assignProject = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/assignment`);
    const json = await response.json();
    console.log(json);
  }

  return (
    <Box width='full' pad='medium' gap='small'>
      <Box direction='row' justify='between' align='center'>
        <Text weight='bold' size='large'>Projects</Text>
        <Box background='brand' pad='small' align='center' elevation='small' round='xsmall' style={{ cursor: 'pointer' }} onClick={() => assignProject()}>
          <Text>Assign Projects</Text>
        </Box>
      </Box>
      <Box width='full' background='white' elevation='small' round='xsmall'>
        {approvedProjects.length > 0 ? approvedProjects.map((project: any, index: number) => (
          <Anchor href={`/admin/project/${project.projectId}/view`}>
            <Box pad='medium' border={{ side: 'bottom', size: 'xsmall' }} round={index === approvedProjects.length - 1 ? 'xsmall' : 'none'} style={{ cursor: 'pointer' }}>
              <Text>{project.projectName}</Text>
              <Text size='small' color='dark-4'>{project.stakeholderCompany}</Text>
            </Box>
          </Anchor>
        ))
          :
          <Box pad='medium' border={{ side: 'bottom', size: 'xsmall' }} round='xsmall'>
            There are no approved projects.
          </Box>
        }
      </Box>
    </Box>
  )
}