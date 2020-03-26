import * as React from 'react';
import { Box, Text } from 'grommet';
import Input from './Input';
import Select from './Select';
import TextArea from './TextArea';
import Alert from './Alert';

interface ProjectProps {
  projectId: string;
  entryType: string;
}
interface Project {
  projectId: number;
  projectName: string;
  minSize: number;
  maxSize: number;
  technologies: string;
  background: string;
  description: string;
  statusId: number;
  adminComments?: string;
}
interface ProjectState {
  students: Array<StudentInfo>;
  project: Project;
  isLoading: Boolean;
  alert: boolean
}

interface StudentInfo {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

export default class ProjectInformation extends React.Component<ProjectProps, ProjectState> {
  constructor(props: ProjectProps) {
    super(props);
    this.state = {
      students: [],
      project: {
        projectId: 0,
        projectName: '',
        minSize: 0,
        maxSize: 0,
        technologies: '',
        background: '',
        description: '',
        statusId: 0,
      },
      isLoading: true,
      alert: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkEntry = this.checkEntry.bind(this);
    this.onChangeMin = this.onChangeMin.bind(this);
    this.onChangeMax = this.onChangeMax.bind(this);
  }
  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/projects/id/${this.props.projectId}`)
      .then(response => response.json())
      .then(data => this.setState({
        project: data,
        isLoading: false
      }))
      .then(this.checkEntry);
  }

  checkEntry() {
    if (this.props.entryType === 'edit' && this.state.project.statusId !== 1) {
      var project = { ...this.state.project };
      project.statusId = 1;
      this.setState({
        project
      });
      fetch(`${process.env.REACT_APP_API_URL}/projects/dabao/`, {
        method: 'POST',
        body: JSON.stringify({
          projectId: this.state.project.projectId,
          projectName: this.state.project.projectName,
          projectMin: this.state.project.minSize,
          projectMax: this.state.project.maxSize,
          technology: this.state.project.technologies,
          background: this.state.project.background,
          description: this.state.project.description,
          statusId: this.state.project.statusId
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then((res) => res.text())
        .then((responsetext => console.log('dabao here: ' + responsetext)))
        .catch((err) => console.log('dabao error: ' + err));
    }
  }

  handleChange(e: any) {
    var project = { ...this.state.project };
    // @ts-ignore
    project[e.target.name] = e.target.value;
    this.setState({
      project
    });
  }

  handleSubmit(e: any) {

    if (this.state.students.length !== 0) {
      alert('Students are assigned, cannot edit project');
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/projects/dabao/`, {
      method: 'POST',
      body: JSON.stringify({
        projectId: this.state.project.projectId,
        projectName: this.state.project.projectName,
        projectMin: this.state.project.minSize,
        projectMax: this.state.project.maxSize,
        technology: this.state.project.technologies,
        background: this.state.project.background,
        description: this.state.project.description,
        statusId: this.state.project.statusId
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((response) => {
        if (response.ok) {
          this.setState({ alert: true }, () => setTimeout(() => {
            this.setState({ alert: false });
          }, 2000));
        } else {
          alert('Something went wrong. Please try again!');
        }
      })
      .catch((err) => console.log('dabao error: ' + err));
  }

  onChangeMax({ option }: any) {
    let project: Project = { ...this.state.project };
    project.maxSize = option;
    this.setState({ project });
  }

  onChangeMin({ option }: any) {
    let project: Project = { ...this.state.project };
    // @ts-ignore
    project.minSize = option;
    if (this.state.project.maxSize < option) {
      project.maxSize = option;
    }
    this.setState({ project });

  }
  render() {
    console.log(this.state.project);
    return (
      <Box width='large' elevation='xsmall' round='xxsmall' background='white' pad='small' gap='medium'>
        <Text weight='bold' size='large'>Project Information</Text>
        <Input
          title='Project Name'
          name='projectName'
          value={this.state.project.projectName}
          onChange={this.handleChange}
          disabled={this.props.entryType === 'view' ? true : false}
        />
        <Box direction='row' gap='xsmall'>
          <Select
            title='Min Number of Students'
            name='minSize'
            options={Array.from({ length: 20 }, (v, i) => i + 1)}
            onChange={this.onChangeMin}
            value={this.state.project.minSize}
            disabled={this.props.entryType === 'view' ? true : false}
            icon={this.props.entryType !== 'view' ? true : false}
          />
          <Select
            title='Max Number of Students'
            name='maxSize'
            options={Array.from({ length: 20 - this.state.project.minSize }, (v, i) => i + this.state.project.minSize + 1)}
            onChange={this.onChangeMax}
            value={this.state.project.maxSize}
            disabled={this.props.entryType === 'view' ? true : false}
            icon={this.props.entryType !== 'view' ? true : false}
          />
        </Box>
        <Input
          title='Technologies Expected'
          name='technologies'
          value={this.state.project.technologies}
          onChange={this.handleChange}
          disabled={this.props.entryType === 'view' ? true : false}
        />
        <Input
          title='Background Requested'
          name='background'
          value={this.state.project.background}
          onChange={this.handleChange}
          disabled={this.props.entryType === 'view' ? true : false}
        />
        <TextArea
          title='Description'
          name='description'
          value={this.state.project.description}
          onChange={this.handleChange}
          disabled={this.props.entryType === 'view' ? true : false}
        />
        {this.props.entryType !== 'view' &&
          <Box background='brand' width='small' pad='xsmall' align='center' round='xxsmall' alignSelf='start' onClick={this.handleSubmit}>
            <Text>Submit</Text>
          </Box>
        }
        {(this.props.entryType === 'view' && this.state.project.adminComments) && (
          <TextArea
            title='Admin Comments'
            name='adminComments'
            value={this.state.project.adminComments}
            disabled
          />
        )}
        {this.state.alert && (
          <Alert text={`${this.state.project.projectName} updated.`} />
        )}
      </Box>
    );
  }
}