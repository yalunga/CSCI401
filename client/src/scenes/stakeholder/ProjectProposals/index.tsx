import * as React from 'react';
import { Box, Text, Select } from 'grommet';
import Input from '../../../components/Input';

interface ProjectProps {
  projectId: string;
}
interface ProjectState {
  projectName: string;
  projectMin: number;
  projectMax: number;
  technologies: string;
  background: string;
  description: string;
  fallSpringSum: number;
  semester: number;
  errorMsg: string;
}

var nameSet = new Set();

export default class ProjectProposals extends React.Component<ProjectProps, ProjectState> {
  constructor(props: ProjectProps) {
    super(props);
    this.state = {
      projectName: '',
      projectMin: 1,
      projectMax: 1,
      technologies: '',
      background: '',
      description: '',
      fallSpringSum: 0,
      semester: this.showCurrentYear(),
      errorMsg: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitProject = this.submitProject.bind(this);
    this.getProjectList = this.getProjectList.bind(this);

    this.getProjectList();
  }

  componentDidMount() {
    if (this.props.projectId !== undefined) {
      fetch(`${process.env.REACT_APP_API_URL}/projects/` + sessionStorage.getItem('email') + '/' + this.props.projectId)
        .then(response => response.json())
        .then((data) => this.setState({
          projectName: data.projectName,
          projectMin: data.minSize,
          projectMax: data.maxSize,
          technologies: data.technologies,
          background: data.background,
          semester: data.semester,
          fallSpringSum: data.fallSpring,
          description: data.description
        }))
        .catch((err) => console.log('GET error: ' + err));
    }
  }

  showCurrentYear() {
    return new Date().getFullYear();
  }

  getProjectList() {
    nameSet.clear();
    fetch(`${process.env.REACT_APP_API_URL}/projects/getprojectsfromsemester/` + this.state.semester + '/' + 0)
      .then((response) => response.json())
      .then((data) => {
        console.log('data: ' + data);
        console.log('object size: ' + Object.keys(data).length);
        Object.keys(data).forEach(function (key: any) {
          nameSet.add(data[key].projectName);
        });
      })
      .catch((error) => {
        console.log('handle change select error: ' + error);
      });
  }
  async submitProject(e: any) {
    e.preventDefault();
    // alert('in submit project');
    // alert('set size: ' + nameSet.size);
    var newProjectName = this.state.projectName;
    if (nameSet.has(newProjectName)) {
      // alert('project name already exists');
      return this.setState({ errorMsg: 'This project name already exists. Please input a different name.' });
    }
    if (!this.state.projectName) {
      return this.setState({ errorMsg: 'A project name is required.' });
    }
    if (!this.state.technologies) {
      return this.setState({ errorMsg: 'Technologies are required.' });
    }
    if (!this.state.background) {
      return this.setState({ errorMsg: 'Background is required.' });
    }
    if (!this.state.description) {
      return this.setState({ errorMsg: 'Description is required.' });
    }
    if (this.state.projectMax < this.state.projectMin) {
      return this.setState({ errorMsg: 'Maximum number of students must be larger than minimum number of students.' });
    }
    await fetch(`${process.env.REACT_APP_API_URL}/projects/save/${sessionStorage.getItem('email')}`, {
      method: 'POST',
      body: JSON.stringify({
        projectName: this.state.projectName,
        minSize: this.state.projectMin,
        maxSize: this.state.projectMax,
        technologies: this.state.technologies,
        background: this.state.background,
        description: this.state.description,
        fallSpring: this.state.fallSpringSum,
        semester: this.state.semester,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    nameSet.add(newProjectName);
    window.location.href = '/stakeholder';
  }
  handleChange(e: any) {
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    return (
      <Box width='full' pad='medium'>
        <Box width='full' align='center'>
          <Box width='large' elevation='xsmall' background='white' round='xxsmall' pad='small' gap='medium'>
            <Text weight='bold' size='large'>Project Proposal</Text>
            <Input
              title='Name'
              name='projectName'
              value={this.state.projectName}
              onChange={this.handleChange}
            />
          </Box>
        </Box>

      </Box>
    );
  }
}