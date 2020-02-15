import * as React from 'react';
import { Box, Text, DataTable, Layer } from 'grommet';
import TableHeader from '../../TableHelpers/TableHeaders';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import TextArea from '../../../components/TextArea';
import Alert from '../../../components/Alert';

interface ProjectListProps { }

interface ProjectListState {
  projects: Array<{}>;
  isLoading: boolean;
  selected: boolean;
  projectToEdit?: Project;
  editAdminComments: string;
  editProjectName: string;
  editProjectTechnologies: string;
  editMinSize: number;
  editMaxSize: number;
  alert: boolean;
}

interface Project {
  projectId: number;
  adminComments: string;
  projectName: string;
  statusId: number;
  minSize: number;
  maxSize: number;
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
      editMinSize: 0,
      editMaxSize: 0,
      isLoading: false,
      selected: false,
      alert: false
    };
    this.editProject = this.editProject.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.onChangeMax = this.onChangeMax.bind(this);
    this.onChangeMin = this.onChangeMin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitClicked = this.submitClicked.bind(this);
    this.getProjects = this.getProjects.bind(this);
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

  async getProjects() {
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

  getStatus(id: number) {
    if (id === 0 || id === 1) {
      return 'Pending Approval';
    } else if (id === 2) {
      return 'Approved';
    } else if (id === 3) {
      return 'Rejected';
    }
    return 'Changes Requested';
  }

  async submitClicked(projectId: number, type: number) {
    if (type === 1) {
      await fetch(`${process.env.REACT_APP_API_URL}/projects/pending/` + projectId, {
        method: 'POST'
      })
    } else if (type === 2) {
      await fetch(`${process.env.REACT_APP_API_URL}/projects/approve/` + projectId, {
        method: 'POST'
      })
    } else if (type === 3) {
      await fetch(`${process.env.REACT_APP_API_URL}/projects/reject/` + projectId, {
        method: 'POST'
      })
    } else if (type === 4) {
      await fetch(`${process.env.REACT_APP_API_URL}/projects/change/` + projectId, {
        method: 'POST'
      })
    }
    this.setState({ alert: true }, () => setTimeout(() => {
      this.setState({ alert: false });
    }, 2000));
    this.getProjects();
  }

  submitEdit = () => {
    if (this.state.projectToEdit) {
      var request = new XMLHttpRequest();
      request.withCredentials = true;
      request.open('POST', `${process.env.REACT_APP_API_URL}/projects/change/adminComments/` + this.state.projectToEdit.projectId);
      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      var data = this.state.editAdminComments;
      request.setRequestHeader('Cache-Control', 'no-cache');
      request.send(data);
      this.submitClicked(this.state.projectToEdit.projectId, 4);
      this.setState({ projectToEdit: undefined });
    }
  }


  editProject(project: Project) {
    this.setState({
      projectToEdit: project,
      editAdminComments: project.adminComments,
      editProjectName: project.projectName,
      editProjectTechnologies: project.technologies,
      editMinSize: project.minSize,
      editMaxSize: project.maxSize
    });
  }

  handleChange(e: any) {
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.value });
  }

  onChangeMax({ option }: any) {
    this.setState({ editMaxSize: option });
  }

  onChangeMin({ option }: any) {
    this.setState({ editMinSize: option });
    if (this.state.editMaxSize < option) {
      this.setState({ editMaxSize: option });
    }
  }

  cancelEdit() {
    this.setState({
      projectToEdit: undefined
    });
  }

  render() {
    const columns = [
      {
        property: 'select',
        header: <TableHeader>Select</TableHeader>,
        render: (datum: any) => {
          return (
            <Box direction='row' gap='xsmall'>
              <Box elevation='xsmall' background='#43A047' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={() => this.submitClicked(datum.projectId, 2)}>
                <Text>Approve</Text>
              </Box>
              <Box elevation='xsmall' background='#FFCB02' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={() => this.editProject(datum)}>
                <Text>Edit</Text>
              </Box>
              <Box elevation='xsmall' background='status-error' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={() => this.submitClicked(datum.projectId, 3)}>
                <Text>Reject</Text>
              </Box>
            </Box>
          )
        },
      },
      {
        property: 'projectName',
        header: <TableHeader>Project Name</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.projectName}</Text>
        ),
      },
      {
        property: 'stakeholderCompany',
        header: <TableHeader>Organization</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.stakeholderCompany}</Text>
        )
      },
      {
        property: 'projectStatus',
        header: <TableHeader>Project Status</TableHeader>,
        render: (datum: any) => (
          <Text>{this.getStatus(datum.statusId)}</Text>
        ),
      },
      {
        property: 'technologies',
        header: <TableHeader>Technologies</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.technologies}</Text>
        ),
      },
      {
        property: 'minSize',
        header: <TableHeader>Min Size</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.minSize}</Text>
        ),
      },
      {
        property: 'maxSize',
        header: <TableHeader>Max Size</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.maxSize}</Text>
        ),
      },
      {
        property: 'description',
        header: <TableHeader>Description</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.description}</Text>
        ),
      }
    ];
    let modal = <div></div>;
    console.log(this.state);
    if (this.state.projectToEdit !== undefined) {
      modal = (
        <Layer position='top' modal margin={{ top: 'xlarge' }}>
          <Box pad='medium' gap='small'>
            <Text weight='bold' size='large'>Project Proposal</Text>
            <Input
              title='Name'
              name='editProjectName'
              value={this.state.editProjectName}
              onChange={this.handleChange}
            />
            <Box direction='row' gap='small'>
              <Select
                title='Min Size'
                options={Array.from({ length: 20 }, (v, i) => i + 1)}
                value={this.state.editMinSize}
                onChange={this.onChangeMin}
              />
              <Select
                title='Max Size'
                options={Array.from({ length: 20 - this.state.editMinSize }, (v, i) => i + this.state.editMaxSize + 1)}
                value={this.state.editMaxSize}
                onChange={this.onChangeMax}
              />
            </Box>
            <Input
              title='Technologies Expected'
              name='editProjectTechnologies'
              value={this.state.editProjectTechnologies}
              onChange={this.handleChange}
            />
            <TextArea
              title='Admin Comments'
              name='editAdminComments'
              value={this.state.editAdminComments}
              onChange={this.handleChange}
              resize='vertical'
            />
            <Box width='full' justify='end' direction='row' gap='small'>
              <Box width='xsmall' elevation='xsmall' background='light-4' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={this.cancelEdit}>
                <Text>Cancel</Text>
              </Box>
              <Box width='xsmall' elevation='xsmall' background='#43A047' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={this.submitEdit}>
                <Text>Save</Text>
              </Box>
            </Box>
          </Box>
        </Layer>
      );
    }
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
        {modal}
        {this.state.alert && <Alert text='Changed Project State' />}
      </Box>
    )
  }
}