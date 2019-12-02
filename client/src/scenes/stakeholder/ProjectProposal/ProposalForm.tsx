import * as React from 'react';
import {
  Form,
  FormGroup,
  Col,
  FormControl,
  Button,
  ControlLabel
} from 'react-bootstrap';

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

class ProposalForm extends React.Component<ProjectProps, ProjectState> {
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
    // this.getProjectContent = this.getProjectContent.bind(this);

    this.getProjectList();
  }

  componentDidMount() {
    // alert('email: ' + sessionStorage.getItem('email'));
    // alert('project id: ' + this.props.projectId);
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

  getProjectList() {
    nameSet.clear();
    fetch(`${process.env.REACT_APP_API_URL}/projects/getprojectsfromsemester/` + this.state.semester + '/' + 0)
      // .then((response) => response.text())
      .then((response) => response.json())
      .then((data) => {
        console.log('data: ' + data);
        console.log('object size: ' + Object.keys(data).length);
        Object.keys(data).forEach(function (key: any) {
          // alert('key: ' + key + ' val: ' + data[key]);
          // alert(data[key].projectName);
          nameSet.add(data[key].projectName);
        });
      })
      // .then((responseText) => console.log(responseText))
      .catch((error) => {
        console.log('handle change select error: ' + error);
      });
  }
  // getProjectContent() {

  // }
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
    const res = await fetch(`${process.env.REACT_APP_API_URL}/projects/save/${sessionStorage.getItem('email')}`, {
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

  handleChangeSelect(event: any) {
    var val = event.target.value;
    if (val === 0) {
      this.setState({ fallSpringSum: 0 });
    } else if (val === 1) {
      this.setState({ fallSpringSum: 1 });
    } else {
      this.setState({ fallSpringSum: 2 });
    }
    this.setState({ fallSpringSum: val });

    nameSet.clear();
    console.log('semester: ' + this.state.semester + ' ' + 'val: ' + val);
    fetch(`${process.env.REACT_APP_API_URL}/projects/getprojectsfromsemester/` + this.state.semester + '/' + val)
      // .then((response) => response.text())
      .then((response) => response.json())
      .then((data) => {
        console.log('data: ' + data);
        console.log('object size: ' + Object.keys(data).length);
        Object.keys(data).forEach(function (key: any) {
          // alert('key: ' + key + ' val: ' + data[key]);
          // alert(data[key].projectName);
          nameSet.add(data[key].projectName);
        });
      })
      // .then((responseText) => console.log(responseText))
      .catch((error) => {
        console.log('handle change select error: ' + error);
      });
  }

  handleChangeText(event: any) {
    var val = event.target.value;
    console.log(val);
    this.setState({ semester: val });
  }

  handleChangeMin(event: any) {
    this.setState({ projectMin: event.target.value });
  }

  handleChangeMax(event: any) {
    this.setState({ projectMax: event.target.value });
  }

  handleChange(e: any) {
    // @ts-ignore

    this.setState({ [e.target.id]: e.target.value });
  }

  showCurrentYear() {
    return new Date().getFullYear();
  }

  render() {
    return (
      <Form horizontal={true} >
        <FormGroup controlId="formHorizontalProjectName">
          <Col componentClass={ControlLabel} sm={3}>
            <b>Project Name</b>
          </Col>
          <Col sm={8}>
            <FormControl
              type="text"
              id="projectName"
              value={this.state.projectName}
              onChange={e => this.handleChange(e)}
              placeholder="Project Name"
              onFocus={() => this.setState({ errorMsg: '' })}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalMinNumberStudents">
          <Col componentClass={ControlLabel} sm={3}>
            <b>Minimum Number of Students</b>
          </Col>
          <Col sm={8}>
            <select style={{ marginRight: '3px', marginTop: '7px' }} onChange={e => this.handleChangeMin(e)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
            </select>
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalMaxNumberStudents">
          <Col componentClass={ControlLabel} sm={3}>
            <b>Maximum Number of Students</b>
          </Col>
          <Col sm={8}>
            <select style={{ marginRight: '3px', marginTop: '7px' }} onChange={e => this.handleChangeMax(e)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
            </select>
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalTechnologies">
          <Col componentClass={ControlLabel} sm={3}>
            <b>Technologies Expected</b>
          </Col>
          <Col sm={8}>
            <FormControl
              type="text"
              id="technologies"
              value={this.state.technologies}
              placeholder="Technologies expected"
              onChange={e => this.handleChange(e)}
              onFocus={() => this.setState({ errorMsg: '' })}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalBackground">
          <Col componentClass={ControlLabel} sm={3}>
            <b>Background Requested</b>
          </Col>
          <Col sm={8}>
            <FormControl
              type="text"
              id="background"
              value={this.state.background}
              placeholder="Background requested"
              onChange={e => this.handleChange(e)}
              onFocus={() => this.setState({ errorMsg: '' })}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalDescription">
          <Col componentClass={ControlLabel} sm={3}>
            <b>Description</b>
          </Col>
          <Col sm={8}>
            <FormControl
              componentClass="textarea"
              style={{ height: 300 }}
              type="text"
              id="description"
              value={this.state.description}
              placeholder="Description"
              onChange={e => this.handleChange(e)}
              onFocus={() => this.setState({ errorMsg: '' })}
            />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={3}>
            <b>Semester</b>
          </Col>
          <Col sm={3}>
            <select style={{ marginRight: '3px', marginTop: '7px' }} onChange={e => this.handleChangeSelect(e)}>
              <option value="0" >Fall (September-December)</option>
              <option value="1" >Spring (January-April)</option>
              <option value="2" >Summer (May-August)</option>
            </select>
          </Col>
          <Col sm={3}>
            <select style={{ marginRight: '3px', marginTop: '7px' }} onChange={e => this.handleChangeText(e)}>
              <option value={this.showCurrentYear()} >{this.showCurrentYear()}</option>
              <option value={this.showCurrentYear() + 1} >{this.showCurrentYear() + 1}</option>
            </select>
          </Col>
        </FormGroup>

        {this.state.errorMsg && (
          <FormGroup>
            <Col smOffset={2} sm={10}>
              <span style={{ color: 'red' }}>{this.state.errorMsg}</span>
            </Col>
          </FormGroup>
        )}

        <FormGroup>
          <Col smOffset={3} sm={9}>
            <Button type="submit" onClick={this.submitProject}>Submit</Button>
          </Col>
        </FormGroup>
      </Form>
    );

  }
}

export default ProposalForm;
