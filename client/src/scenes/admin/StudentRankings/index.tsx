import * as React from 'react';

import { Box, Text } from 'grommet';

interface State {
  isLoading: boolean;
  usersWithRankings: any[];
}

interface Project {
  projectId: number;
  projectName: string;
  statusId: number;
  minSize: number;
  maxSize: number;
  technologies: string;
  background: string;
  description: string;
  stakeholderCompany: string;
}

export default class StudentRankings extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      usersWithRankings: []
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const acceptedProjects: Project[] = [];
    const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/getprojectsfromsemester/` + sessionStorage.getItem('viewingYear') + '/' + sessionStorage.getItem('viewingFallSpring'));
    const projects = await response.json();
    for (const project of projects) {
      if (project.statusId === 2) {
        acceptedProjects.push(project);
      }
    }
    const rankingsResponse = await fetch(`${process.env.REACT_APP_API_URL}/projects/${sessionStorage.getItem('viewingYear')}/${sessionStorage.getItem('viewingFallSpring')}/rankings`);
    const rankings = await rankingsResponse.json();

    const usersResponse = await fetch(`${process.env.REACT_APP_API_URL}/users/getusersfromsemester/` + sessionStorage.getItem('viewingYear') + '/' + sessionStorage.getItem('viewingFallSpring'), {
      method: 'get',
      headers: new Headers({
        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
      })
    });
    const users = await usersResponse.json();
    const usersWithRankings: any = [];
    users.forEach((user: any) => {
      const userRankings = [];
      for (const rank of rankings) {
        if (rank.studentId === user.userId) {
          for (const project of acceptedProjects) {
            if (project.projectId === rank.projectId) {
              userRankings[rank.rank - 1] = project;
            }
          }
        }
      }
      if (userRankings.length === 0) {
        return null;
      }
      usersWithRankings.push({ ...user, rankings: userRankings });
    });
    this.setState({ isLoading: false, usersWithRankings });
  }
  render() {
    if (this.state.isLoading) return null;
    return (
      <Box pad='medium' width='full' gap='small'>
        <Text weight='bold' size='large'>Student Rankings</Text>
        <Text>{this.state.usersWithRankings.length} students have submitted rankings.</Text>
        <Box width='full' background='white' elevation='small' round='xsmall'>
          {this.state.usersWithRankings.map((user, index) => (
            <Box background='white' pad='medium' border={{ side: 'bottom', size: 'xsmall' }} round={index === this.state.usersWithRankings.length - 1 ? 'xsmall' : 'none'}>
              <Box direction='row' gap='xsmall' align='center'>
                <Text>{user.firstName} {user.lastName}</Text>
                {user.rankings.map((rank: any, index: number) => (
                  <Text size='small' color='dark-4' weight='normal'>
                    {index + 1}. {rank.projectName.length > 25 ? `${rank.projectName.slice(0, 25)}...` : rank.projectName}
                  </Text>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
}