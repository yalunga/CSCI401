import * as React from 'react';
import {
    Form,
    FormGroup,
    Col,
    FormControl,
    Button,
    ControlLabel,
    Panel,
    Table
} from 'react-bootstrap';
import { runInThisContext } from 'vm';

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
}
interface ProjectState {
    students: Array<StudentInfo>;
    project: Project;
    isLoading: Boolean;
}

interface StudentInfo {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
}

class ProjectInformation extends React.Component<ProjectProps, ProjectState> {
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
            isLoading: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkEntry = this.checkEntry.bind(this);
    }

    componentDidMount() {
        // alert('entry type: ' + this.props.entryType);
        fetch(`${process.env.REACT_APP_API_URL}/projects/` + sessionStorage.getItem('email') + '/' + this.props.projectId)
            .then(response => response.json())
            // .then(response => response.text())
            // .then((responseText) => alert(responseText));
            .then(data => this.setState({
                project: data,
                isLoading: false
            }))
            .then(this.checkEntry);
    }

    checkEntry() {
        // alert('status id: ' + this.state.project.statusId + ' project id: ' + this.state.project.projectId);
        if (this.props.entryType === 'edit' && this.state.project.statusId !== 1) {
            var choice = confirm('Are you sure to proceed to edit and change project status back to pending ?');

            if (choice) {
                
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
                    // .then((res) => res.json())
                    // .then((data) => nameSet.add(newProjectName))
                    .catch((err) => console.log('dabao error: ' + err));
            } else {
                window.location.href = '/stakeholder';
            }
        }
        // alert('in check entry');
    }

    handleChange(e: any) {
        // @ts-ignore
        var project = { ...this.state.project };
        project[e.target.id] = e.target.value;
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
            .then((res) => res.text())
            .then((responsetext => console.log('dabao here: ' + responsetext)))
            // .then((res) => res.json())
            // .then((data) => nameSet.add(newProjectName))
            .catch((err) => console.log('dabao error: ' + err));
    }
    
    render() {
        fetch(`${process.env.REACT_APP_API_URL}/projects/` + this.state.project.projectId + '/students')
            .then(response => response.json())
            .then(data => this.setState({ students: data }));

        if (this.props.entryType === 'view') {
            return(
                <Panel>
                    <Panel.Heading>Project Information</Panel.Heading>
                    <Panel.Body>
                        <Form horizontal={true} >
                            <FormGroup controlId="formHorizontalProjectName">
                                <Col componentClass={ControlLabel} sm={3}>
                                    <b>Project Name</b>
                                </Col>
                                <Col sm={8}>
                                    <p>{this.state.project.projectName}</p>
                                </Col>
                            </FormGroup>
    
                            <FormGroup controlId="formHorizontalMinNumberStudents">
                                <Col componentClass={ControlLabel} sm={3}>
                                    <b>Minimum Number of Students</b>
                                </Col>
                                <Col sm={8}>
                                    <p>{this.state.project.minSize}</p>
                                </Col>
                            </FormGroup>
    
                            <FormGroup controlId="formHorizontalMaxNumberStudents">
                                <Col componentClass={ControlLabel} sm={3}>
                                    <b>Maximum Number of Students</b>
                                </Col>
                                <Col sm={8}>
                                    <p>{this.state.project.maxSize}</p>
                                </Col>
                            </FormGroup>
    
                            <FormGroup controlId="formHorizontalTechnologies">
                                <Col componentClass={ControlLabel} sm={3}>
                                    <b>Technologies Expected</b>
                                </Col>
                                <Col sm={8}>
                                    <p>{this.state.project.technologies}</p>
                                </Col>
                            </FormGroup>
    
                            <FormGroup controlId="formHorizontalBackground">
                                <Col componentClass={ControlLabel} sm={3}>
                                    <b>Background Requested</b>
                                </Col>
                                <Col sm={8}>
                                    <p>{this.state.project.background}</p>
                                </Col>
                            </FormGroup>
    
                            <FormGroup controlId="formHorizontalDescription">
                                <Col componentClass={ControlLabel} sm={3}>
                                    <b>Description</b>
                                </Col>
                                <Col sm={8}>
                                    <p>{this.state.project.description}</p>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Panel.Body>
                    <Panel>
                        <Panel.Heading>
                            Team Contact Information
                        </Panel.Heading>
                        <Panel.Body>
                            <div>
                                <Table bordered={true}>
                                    <thead>
                                        <tr>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Email</th>
    
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.students.map((student: StudentInfo) =>
                                            <tr key={student.userId}>
                                                <td> {student.firstName} </td>
                                                <td> {student.lastName} </td>
                                                <td> {student.email} </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Panel.Body>
                    </Panel>
                </Panel>
            );
        } else {
            return (
                <Panel>
                    <Panel.Heading>Project Information</Panel.Heading>
                    <Panel.Body>
                        <Form horizontal={true} >
                            <FormGroup controlId="formHorizontalProjectName">
                                <Col componentClass={ControlLabel} sm={3}>
                                    <b>Project Name</b>
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        type="text"
                                        id="projectName"
                                        value={this.state.project.projectName}
                                        onChange={e => this.handleChange(e)}
                                        placeholder="Project Name"
                                    />
                                </Col>
                            </FormGroup>
    
                            <FormGroup controlId="formHorizontalMinNumberStudents">
                                <Col componentClass={ControlLabel} sm={3}>
                                    <b>Minimum Number of Students</b>
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        type="text"
                                        id="minSize"
                                        placeholder="Min Number of Students"
                                        onChange={e => this.handleChange(e)}
                                        value={this.state.project.minSize}
                                    />
                                </Col>
                            </FormGroup>
    
                            <FormGroup controlId="formHorizontalMaxNumberStudents">
                                <Col componentClass={ControlLabel} sm={3}>
                                    <b>Maximum Number of Students</b>
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        type="text"
                                        id="maxSize"
                                        placeholder="Max Number of Students"
                                        onChange={e => this.handleChange(e)}
                                        value={this.state.project.maxSize}
                                    />
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
                                        value={this.state.project.technologies}
                                        placeholder="Technologies expected"
                                        onChange={e => this.handleChange(e)}
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
                                        value={this.state.project.background}
                                        placeholder="Background requested"
                                        onChange={e => this.handleChange(e)}
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
                                        style={{ height: 200 }}
                                        type="text"
                                        id="description"
                                        value={this.state.project.description}
                                        placeholder="Description"
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Col>
                            </FormGroup>
    
                            <FormGroup>
                                <Col smOffset={3} sm={8}>
                                    <Button type="submit" onClick={this.handleSubmit}>Save</Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Panel.Body>
                    <Panel>
                        <Panel.Heading>
                            Team Contact Information
                        </Panel.Heading>
                        <Panel.Body>
                            <div>
                                <Table bordered={true}>
                                    <thead>
                                        <tr>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Email</th>
    
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.students.map((student: StudentInfo) =>
                                            <tr key={student.userId}>
                                                <td> {student.firstName} </td>
                                                <td> {student.lastName} </td>
                                                <td> {student.email} </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Panel.Body>
                    </Panel>
                </Panel>
    
            );
        }
    }
}

export default ProjectInformation;
