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
    projectSize: number;
    technologies: string;
    background: string;
    description: string;
    semester: number;
    fallSpring: number;
}

var nameSet = new Set();

class ProposalForm extends React.Component<ProjectProps, ProjectState> {
    constructor(props: ProjectProps) {
        super(props);
        this.state = {
            projectName: '',
            projectSize: 0,
            technologies: '',
            background: '',
            description: '',
            semester: 2019,
            fallSpring: 0
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
            fetch('http://' + window.location.hostname + ':8080/projects/' + sessionStorage.getItem('email') + '/' + this.props.projectId)
            .then(response => response.json())
            .then((data) => this.setState({
                projectName: data.projectName,
                projectSize: data.minSize,
                technologies: data.technologies,
                background: data.background,
                semester: data.semester,
                fallSpring: data.fallSpring,
            }))
            .catch((err) => console.log('GET error: ' + err));
        } 
    }

    getProjectList() {
        nameSet.clear();
        fetch('http://' + window.location.hostname + ':8080/projects/getprojectsfromsemester/' + this.state.semester + '/' + 0)
        // .then((response) => response.text())
        .then((response) => response.json())
        .then((data) => {
            console.log('data: ' + data);
            console.log('object size: ' + Object.keys(data).length);
            Object.keys(data).forEach(function(key: any) {
                // alert('key: ' + key + ' val: ' + data[key]);
                // alert(data[key].projectName);
                nameSet.add(data[key].projectName);
            });
        })
        // .then((responseText) => console.log(responseText))
        .catch((error) => {
            alert('handle change select error: ' + error);
        });
    }
    // getProjectContent() {

    // }
    submitProject() {
        // alert('in submit project');
        // alert('set size: ' + nameSet.size);
        var newProjectName = this.state.projectName;
        if (nameSet.has(newProjectName)) {
            alert('project name already exists');
            return;
        }
        
        fetch('http://' + window.location.hostname + ':8080/projects/save/' + sessionStorage.getItem('email'), {
            method: 'POST',
            body: JSON.stringify({
                projectName: this.state.projectName,
                minSize: this.state.projectSize,
                maxSize: this.state.projectSize,
                technologies: this.state.technologies,
                background: this.state.background,
                description: this.state.description,
                semester: this.state.semester,
                fallSpring: this.state.fallSpring
            }),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Cache-Control': 'no-cache'
            },
        }).then((res) => res.json())
        .then((data) => nameSet.add(newProjectName))
        .catch((err) => alert('POST error: ' + err));
    }

    handleChangeSelect(event: any) {
        var val = event.target.value === '0' ? 0 : 1;
        this.setState({ fallSpring: val });

        nameSet.clear();
        console.log('semester: ' + this.state.semester + ' ' + 'val: ' + val);
        fetch('http://' + window.location.hostname + ':8080/projects/getprojectsfromsemester/' + this.state.semester + '/' + val)
        // .then((response) => response.text())
        .then((response) => response.json())
        .then((data) => {
            console.log('data: ' + data);
            console.log('object size: ' + Object.keys(data).length);
            Object.keys(data).forEach(function(key: any) {
                // alert('key: ' + key + ' val: ' + data[key]);
                // alert(data[key].projectName);
                nameSet.add(data[key].projectName);
            });
        })
        // .then((responseText) => console.log(responseText))
        .catch((error) => {
            alert('handle change select error: ' + error);
        });
    }

    handleChangeText(event: any) {
        console.log(event.target.value);
        this.setState({ semester: event.target.value });
    }

    handleChange(e: any) {
        // @ts-ignore
        this.setState({ [e.target.id]: e.target.value });

    }

    render() {
        return (
            <Form horizontal={true} >
                <FormGroup controlId="formHorizontalProjectName">
                    <Col componentClass={ControlLabel} sm={2}>
                        <b>Project Name</b>
                    </Col>
                    <Col sm={10}>
                        <FormControl
                            type="text"
                            id="projectName"
                            value={this.state.projectName}
                            onChange={e => this.handleChange(e)}
                            placeholder="Project Name"
                        />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalNumberStudents">
                    <Col componentClass={ControlLabel} sm={2}>
                        <b>Number of Students</b>
                    </Col>
                    <Col sm={10}>
                        <FormControl
                            type="text"
                            id="projectSize"
                            placeholder="Number of Students"
                            onChange={e => this.handleChange(e)}
                            value={this.state.projectSize}
                        />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalTechnologies">
                    <Col componentClass={ControlLabel} sm={2}>
                        <b>Technologies Expected</b>
                    </Col>
                    <Col sm={10}>
                        <FormControl
                            type="text"
                            id="technologies"
                            value={this.state.technologies}
                            placeholder="Technologies expected"
                            onChange={e => this.handleChange(e)}
                        />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalBackground">
                    <Col componentClass={ControlLabel} sm={2}>
                        <b>Background Requested</b>
                    </Col>
                    <Col sm={10}>
                        <FormControl
                            type="text"
                            id="background"
                            value={this.state.background}
                            placeholder="Background requested"
                            onChange={e => this.handleChange(e)}
                        />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalDescription">
                    <Col componentClass={ControlLabel} sm={2}>
                        <b>Description</b>
                    </Col>
                    <Col sm={10}>
                        <FormControl
                            componentClass="textarea"
                            type="text"
                            id="description"
                            value={this.state.description}
                            placeholder="Description"
                            onChange={e => this.handleChange(e)}
                        />
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>
                        <b>Semester</b>
                    </Col>
                    <Col sm={4}>
                        <FormControl
                            type="text"
                            id="year"
                            value={this.state.semester}
                            placeholder="Year"
                            onChange={e => this.handleChangeText(e)}
                        />
                    </Col>
                    <Col sm={1}>
                        <select style={{ marginRight: '5px', marginTop: '7px' }} onChange={e => this.handleChangeSelect(e)}>
                            <option value="0">Fall</option>
                            <option value="1">Spring</option>
                        </select>
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Col smOffset={2} sm={10}>
                        <Button type="submit" onClick={this.submitProject}>Submit</Button>
                    </Col>
                </FormGroup>
            </Form>
        );

    }
}

export default ProposalForm;
