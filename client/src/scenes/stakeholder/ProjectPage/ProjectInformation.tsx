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
}
interface Project {
    projectId: number;
    projectName: string;
    minSize: number;
    maxSize: number;
    technologies: string;
    background: string;
    description: string;
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
                description: ''
            },
            isLoading: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch(`${process.env.REACT_APP_API_URL}/projects/` + sessionStorage.getItem('email') + '/' + this.props.projectId)
            .then(response => response.json())
            // .then((responseText) => alert(responseText));
            .then(data => this.setState({
                project: data,
                isLoading: false
            }));
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
        // alert('in handle submit');
        // console.log('projectId: ' + this.state.project.projectId);
        // console.log('projectName: ' + this.state.project.projectName);
        // console.log('projectNum: ' + this.state.project.minSize);
        // console.log('technology: ' + this.state.project.technologies);
        // console.log('background: ' + this.state.project.background);
        // console.log('description: ' + this.state.project.description);

        if (this.state.students.length !== 0) {
            alert('Students are assigned, cannot edit project');
            return;
        }

        alert('project min: ' + this.state.project.minSize);
        alert('project max: ' + this.state.project.maxSize);
        fetch(`${process.env.REACT_APP_API_URL}/projects/dabao/`, {
            method: 'POST',
            body: JSON.stringify({
                projectId: this.state.project.projectId,
                projectName: this.state.project.projectName,
                projectMin: this.state.project.minSize,
                projectMax: this.state.project.maxSize,
                technology: this.state.project.technologies,
                background: this.state.project.background,
                description: this.state.project.description
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((res) => res.text())
            .then((responsetext => alert('dabao here: ' + responsetext)))
            // .then((res) => res.json())
            // .then((data) => nameSet.add(newProjectName))
            .catch((err) => alert('dabao error: ' + err));
    }

    render() {
        fetch(`${process.env.REACT_APP_API_URL}/projects/` + this.state.project.projectId + '/students')
            .then(response => response.json())
            .then(data => this.setState({ students: data }));

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

export default ProjectInformation;