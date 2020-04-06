import React, { useState, useEffect } from 'react';
import { Text, Box, Anchor } from 'grommet';
import { ClipLoader } from "react-spinners";
import EditUserModal from '../../../components/EditUserModal';


export default () => {
  const [loading, setLoading]: any = useState(false);
  const [approvedProjects, setApprovedProjects]: any = useState([]);
  const [editUser, setEditUser]: any = useState(null);
  const [hasRunAlgorthm, setHasRunAlgorithm]: any = useState(false);

  useEffect((): any => {
    const getProjects = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/assignment-retrieve/` + sessionStorage.getItem('viewingYear') + '/' + sessionStorage.getItem('viewingFallSpring'));
      const projects = await response.json();
      console.log(projects);
      if (projects) {
        const acceptedProjects = [];
        for (const project of projects) {
          if (project.statusId === 2) {
            acceptedProjects.push(project);
          }
        }
        setApprovedProjects(acceptedProjects);
      }
    }
    getProjects();
  }, []);

  const assignProject = async () => {
    setLoading(true);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/assignment`);
    const json = await response.json();
    setApprovedProjects(json);
    setLoading(false);
    setHasRunAlgorithm(true);
  }

  const confirmAssignment = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/assign-to-students/${sessionStorage.getItem('viewingYear')}/${sessionStorage.getItem('viewingFallSpring')}`, {
      method: 'POST',
      body: JSON.stringify(approvedProjects),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response);
  }

  const getProjectFromStudentId = (studentId: number) => {
    for (const project of approvedProjects) {
      for (const student of project.members) {
        if (student.userId === studentId) {
          return project;
        }
      }
    }
  }

  const moveStudent = (projectId: number) => {
    const prevProjects = approvedProjects;
    // removing student from the project they were assigned
    for (const project of prevProjects) {
      for (const student of project.members) {
        if (student.userId === editUser.userId) {
          project.members.splice(project.members.indexOf(editUser), 1);
        }
      }
    }
    // adding student to new project
    for (const project of prevProjects) {
      if (project.projectId === projectId) {
        project.members.push(editUser);
      }
    }
    setHasRunAlgorithm(true);
  }
  console.log(approvedProjects);
  return (
    <Box width='full' pad='medium' gap='small'>
      <Box direction='row' justify='between' align='center'>
        <Text weight='bold' size='large'>Projects</Text>
        <Box direction='row' gap='small'>
          {loading && <ClipLoader size={50} color='#990000' />}
          <Box background='brand' pad='small' align='center' elevation='small' round='xsmall' style={{ cursor: 'pointer' }} onClick={() => assignProject()}>
            <Text>Assign Projects</Text>
          </Box>
          {hasRunAlgorthm && (
            <Box background='brand' pad='small' align='center' elevation='small' round='xsmall' style={{ cursor: 'pointer' }} onClick={() => confirmAssignment()}>
              <Text>Confirm Assignment</Text>
            </Box>
          )}
        </Box>
      </Box>
      <Box width='full' background='white' elevation='small' round='xsmall'>
        {approvedProjects.length > 0 ? approvedProjects.map((project: any, index: number) => (
          <Box pad='medium' border={{ side: 'bottom', size: 'xsmall' }} round={index === approvedProjects.length - 1 ? 'xsmall' : 'none'}>
            <Box direction='row' gap='xsmall' align='center'>
              <Anchor href={`/admin/project/${project.projectId}/view`}>
                <Text>{project.projectName}</Text>
              </Anchor>
              {project.members.map((student: any) => (
                <Text size='small' color='dark-4' weight='normal' style={{ cursor: 'pointer' }} onClick={() => setEditUser(student)}>
                  {student.firstName} {student.lastName}
                </Text>
              ))}
            </Box>
            <Text size='small' color='dark-4'>{project.stakeholderCompany}</Text>
          </Box>
        ))
          :
          <Box pad='medium' border={{ side: 'bottom', size: 'xsmall' }} round='xsmall'>
            Assign projects when ready.
          </Box>
        }
      </Box>
      {editUser &&
        <EditUserModal
          editFirstName={editUser.firstName}
          editLastName={editUser.lastName}
          editEmail={editUser.email}
          editUserType={editUser.userType}
          editProject={getProjectFromStudentId(editUser.userId)}
          closeModal={() => setEditUser(null)}
          projects={approvedProjects}
          moveStudent={moveStudent}
        />
      }
    </Box>
  )
}