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
}

class ProposalForm extends React.Component<ProjectProps, ProjectState> {
    constructor(props: ProjectProps) {
        super(props);
        this.state = {
            projectName: '',
            projectMin: 0,
            projectMax: 0,
            technologies: '',
            background: '',
            description: '',
            fallSpringSum: 0,
            semester: 2019
        };
        this.submitClicked = this.submitClicked.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }
    submitClicked() {
        var request = new XMLHttpRequest();
        request.withCredentials = true;
        request.open('POST', 'http://' + window.location.hostname + ':8080/projects/save/' + sessionStorage.getItem('email'));
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        var data = JSON.stringify({
            projectName: this.state.projectName,
            minSize: this.state.projectMin,
            maxSize: this.state.projectMax,
            technologies: this.state.technologies,
            background: this.state.background,
            description: this.state.description,
            fallSpringSum: this.state.fallSpringSum,
            semester: this.state.semester
        });
        request.setRequestHeader('Cache-Control', 'no-cache');
        request.send(data);
        alert('Your project proposal has been submitted!');
    }

    handleChangeSelect(event: any) {
        var val = event.target.value === '0' ? 0 : 2;
        this.setState({ fallSpringSum: val });
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
                            id="projectMin"
                            placeholder="Min Number of Students"
                            onChange={e => this.handleChange(e)}
                            value={this.state.projectMin}
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
                            id="projectMax"
                            placeholder="Max Number of Students"
                            onChange={e => this.handleChange(e)}
                            value={this.state.projectMax}
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
                            value={this.state.technologies}
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
                            value={this.state.background}
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
                            value={this.state.description}
                            placeholder="Description"
                            onChange={e => this.handleChange(e)}
                        />
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>
                        <b>Semester</b>
                    </Col>
                    <Col sm={1}>
                        <select style={{ marginRight: '5px', marginTop: '7px' }} onChange={e => this.handleChangeSelect(e)}>
                            <option value="0">Fall</option>
                            <option value="1">Spring</option>
                            <option value="2">Summer</option>
                        </select>
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
                </FormGroup>

                <FormGroup>
                    <Col smOffset={3} sm={9}>
                        <Button type="submit" onClick={this.submitClicked}>Submit</Button>
                    </Col>
                </FormGroup>
            </Form>
        );

    }
}

export default ProposalForm;
