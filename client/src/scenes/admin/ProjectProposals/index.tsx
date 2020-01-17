import * as React from 'react';
import { Box, Text, DataTable } from 'grommet';
import TableHeader from '../../TableHelpers/TableHeaders';

interface ProjectListProps { }

interface ProjectListState {
  projects: Array<{}>;
  isLoading: boolean;
  selected: boolean;
  projectToEdit?: Project;
  editAdminComments: string;
  projectIndexToEdit: number;
  editProjectName: string;
  editProjectTechnologies: string;
  editMinSize: string;
  editMaxSize: string;
}

interface Project {
  projectId: number;
  adminComments: string;
  projectName: string;
  statusId: number;
  minSize: string;
  maxSize: string;
  technologies: string;
  background: string;
  description: string;
}

export default class ProjectProposals extends React.Component<ProjectListProps, ProjectListState> {
  constructor(props: ProjectListProps) {
    super(props);
    this.state = {
      projects: [],
      editAdminComments: '',
      editProjectName: '',
      editProjectTechnologies: '',
      editMinSize: '',
      editMaxSize: '',
      isLoading: false,
      selected: false,
      projectIndexToEdit: -1
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });

    const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/getprojectsfromsemester/` + sessionStorage.getItem('viewingYear') + '/' + sessionStorage.getItem('viewingFallSpring'));
    const projects = await response.json();
    const projectsWithStakeholder: any = [];
    for (const project of projects) {
      const result = await fetch(`${process.env.REACT_APP_API_URL}/projects/${project.projectId}/stakeholder`);
      const stakeholder = await result.json();
      project.stakeholder = stakeholder;
      projectsWithStakeholder.push(project);
    }
    this.setState({ projects: projectsWithStakeholder, isLoading: false });
  }

  render() {
    const columns = [
      {
        property: 'select',
        header: <TableHeader>Select</TableHeader>,
        render: (datum: any) => {
          return (
            <Box direction='row' gap='xsmall'>
              <Box width='xsmall' elevation='xsmall' background='#FFCB02' pad='xsmall' align='center' round='xxsmall' className='pointer'>
                <Text>Edit</Text>
              </Box>
              <Box width='xsmall' elevation='xsmall' background='status-error' pad='xsmall' align='center' round='xxsmall' className='pointer'>
                <Text>Delete</Text>
              </Box>
            </Box>
          )
        },
      },
      {
        property: 'projectName',
        header: <TableHeader>Project Name</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.lastName}</Text>
        ),
      },
      {
        property: 'projectStatus',
        header: <TableHeader>Project Status</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.userType}</Text>
        ),
      },
      {
        property: 'technologies',
        header: <TableHeader>Technologies</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.email}</Text>
        ),
      },
      {
        property: 'minSize',
        header: <TableHeader>Min Size</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.email}</Text>
        ),
      },
      {
        property: 'maxSize',
        header: <TableHeader>Max Size</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.email}</Text>
        ),
      },
      {
        property: 'description',
        header: <TableHeader>Description</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.email}</Text>
        ),
      }
    ];
    return (
      <Box width='full' height='full' pad='medium' gap='medium'>
        <Text weight='bold' size='large'>Project Proposals</Text>
        <Box pad='medium' background='white' elevation='xsmall' round='xxsmall'>
          <DataTable
            columns={columns.map(column => ({
              ...column,
              search: column.property === 'firstName' || column.property === 'lastName'
            }))}
            data={this.state.projects}
          />
        </Box>
      </Box>
    )
  }
}