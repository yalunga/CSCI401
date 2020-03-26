import * as React from 'react';
import { Box, Text } from 'grommet';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import TextArea from '../../../components/TextArea';

interface ProjectProps {
  projectId: string;
  match: {
    params: {
      projectId: string;
    }
  }
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
  stakeholderId?: number;
  stakeholderCompany?: string;
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
      errorMsg: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitProject = this.submitProject.bind(this);
    this.getProjectList = this.getProjectList.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);
    this.onChangeFallSpring = this.onChangeFallSpring.bind(this);
    this.onChangeMin = this.onChangeMin.bind(this);
    this.onChangeMax = this.onChangeMax.bind(this);

    this.getProjectList();
  }

  componentDidMount() {
    const projectId = this.props.match.params.projectId;
    if (projectId !== undefined) {
      fetch(`${process.env.REACT_APP_API_URL}/projects/` + sessionStorage.getItem('email') + '/' + projectId)
        .then(response => response.json())
        .then((data) => this.setState({
          projectName: data.projectName,
          projectMin: data.minSize,
          projectMax: data.maxSize,
          technologies: data.technologies,
          background: data.background,
          semester: data.semester,
          fallSpringSum: data.fallSpring,
          description: data.description,
        }))
        .catch((err) => console.log('GET error: ' + err));
    }
    fetch(`${process.env.REACT_APP_API_URL}/users/` + sessionStorage.getItem('email'))
      .then(response => response.json())
      .then((data) => this.setState({
        stakeholderId: data.userId,
        stakeholderCompany: data.organization
      }))
      .catch((err) => console.log('GET error: ' + err));
  }

  showCurrentYear() {
    return new Date().getFullYear();
  }

  getProjectList() {
    nameSet.clear();
    fetch(`${process.env.REACT_APP_API_URL}/projects/getprojectsfromsemester/` + this.state.semester + '/' + this.state.fallSpringSum)
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
        stakeholderId: this.state.stakeholderId,
        stakeholderCompany: this.state.stakeholderCompany
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
  renderOptionsFallSpring(option: any) {
    return (
      <Box pad='small'>
        <Text weight='bold' size='xsmall' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
          {option.label}
        </Text>
      </Box>
    );
  }
  renderOptionsYear(year: any) {
    return (
      <Box pad='small'>
        <Text weight='bold' size='xsmall' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
          {year}
        </Text>
      </Box>
    );
  }

  onChangeFallSpring({ option }: any) {
    this.setState({
      fallSpringSum: option.value
    });
  }

  onChangeYear({ option }: any) {
    this.setState({ semester: option });
  }

  onChangeMax({ option }: any) {
    this.setState({ projectMax: option });
  }

  onChangeMin({ option }: any) {
    this.setState({ projectMin: option });
    if (this.state.projectMax < option) {
      this.setState({ projectMax: option });
    }
  }
  render() {
    return (
      <Box width='full' pad='medium' height='full'>
        <Box width='full' align='center' height='full'>
          <Box width='large' elevation='xsmall' background='white' round='xxsmall' pad='small' gap='medium' overflow='auto'>
            <Text weight='bold' size='large'>Project Proposal</Text>
            <Input
              title='Name'
              name='projectName'
              value={this.state.projectName}
              onChange={this.handleChange}
            />
            <Box direction='row' gap='small'>
              <Select
                title='Min Size'
                options={Array.from({ length: 20 }, (v, i) => i + 1)}
                value={this.state.projectMin}
                onChange={this.onChangeMin}
              />
              <Select
                title='Max Size'
                options={Array.from({ length: 20 - this.state.projectMin }, (v, i) => i + this.state.projectMin + 1)}
                value={this.state.projectMax}
                onChange={this.onChangeMax}
              />
            </Box>
            <Input
              title='Technologies Expected'
              name='technologies'
              value={this.state.technologies}
              onChange={this.handleChange}
            />
            <Input
              title='Background Requested'
              name='background'
              value={this.state.background}
              onChange={this.handleChange}
            />
            <TextArea
              title='Description'
              name='description'
              value={this.state.description}
              onChange={this.handleChange}
              resize='vertical'
            />
            <Box direction='row' gap='small'>
              <Select
                title='Semester'
                options={[
                  { label: 'Fall (September-December', value: 0 },
                  { label: 'Spring (January-April)', value: 1 },
                  { label: 'Summer (May-August)', value: 2 }
                ]}
                children={this.renderOptionsFallSpring}
                onChange={this.onChangeFallSpring}
                value={
                  <Box pad='small'>
                    <Text weight='bold' size='xsmall' color='dark-4' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                      {this.state.fallSpringSum === 0 && 'Fall(September - December)'}
                      {this.state.fallSpringSum === 1 && 'Spring (January-April)'}
                      {this.state.fallSpringSum === 2 && 'Summer (May-August)'}
                    </Text>
                  </Box>
                }
              />
              <Select
                title='Year'
                options={[this.showCurrentYear(), this.showCurrentYear() + 1]}
                children={this.renderOptionsYear}
                onChange={this.onChangeYear}
                value={
                  <Box pad='small'>
                    <Text weight='bold' size='xsmall' color='dark-4' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                      {this.state.semester}
                    </Text>
                  </Box>
                }
              />
            </Box>
            <Box background='brand' width='small' pad='xsmall' align='center' round='xxsmall' alignSelf='start' onClick={this.submitProject}>
              <Text>Submit</Text>
            </Box>
          </Box>
        </Box>

      </Box>
    );
  }
}