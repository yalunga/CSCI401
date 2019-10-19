import * as React from 'react';
import {
    Panel,
    Button,
    Table,
    Form,
    FormGroup,
    Col,
    FormControl,
    ControlLabel
} from 'react-bootstrap';
const style = {
    width: 1000,
    float: 'none',
    margin: 'auto'
};
interface ProfileProps {
}
interface User {
    firstName: string;
    email: string;
    phone: string;
    password: string;
}
interface ProfileState {
    nfirstName: string;
    nNumber: string;
    nPassword: string;
    nConfirm: string;
    user: User;
    isLoading: boolean;
}
var studentName = '';

class StudentProfile extends React.Component<ProfileProps, ProfileState> {
    constructor(props: ProfileProps) {
        super(props);
        this.state = {
            nfirstName: '',
            nNumber: '',
            nPassword: '',
            nConfirm: '',
            user: {
                firstName: '',
                email: '',
                phone: '',
                password: ''
            },
            isLoading: false,
        };
        this.submitClicked = this.submitClicked.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.setState({ isLoading: true });
        this.setState({ isLoading: true });
        fetch(`${process.env.REACT_APP_API_URL}/users/` + sessionStorage.getItem('email'))
            .then(response => response.json())
            .then(data => this.setState({ user: data, isLoading: false }));
        this.setState({ nfirstName: this.state.user.firstName });
        this.setState({ nfirstName: this.state.user.phone });

    }
    submitClicked() {
        var request = new XMLHttpRequest();
        request.withCredentials = true;
        request.open('POST', `${process.env.REACT_APP_API_URL}/users/update-info`);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        var data = JSON.stringify({
            firstName: this.state.nfirstName,
            email: this.state.user.email,
            phone: this.state.nNumber,
            password: this.state.nPassword
        });
        request.setRequestHeader('Cache-Control', 'no-cache');
        request.send(data);
        request.onreadystatechange = function () {
            window.location.href = '/student/profile';
        };
    }
    handleChange(e: any) {
        // @ts-ignore
        this.setState({ [e.target.id]: e.target.value });
    }
    render() {
        if (this.state.isLoading) {
            return <p>Loading...</p>;
        }

        return (
            <div style={style as any}>
                <Panel>
                    <Panel.Heading>
                        Profile
            </Panel.Heading>
                    <Panel.Body>
                        <Form horizontal={true}>
                            <FormGroup controlId="formHorizontalStudentName">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Name:
                    </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="text"
                                        id="nfirstName"
                                        defaultValue={this.state.user.firstName}
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="formHorizontalStudentEmail">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Email:
                    </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="email"
                                        id="email"
                                        defaultValue={this.state.user.email}
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="formHorizontalStudentPhone">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Phone:
                    </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="tel"
                                        id="nNumber"
                                        defaultValue={this.state.user.phone}
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="formHorizontalStudentName">
                                <Col componentClass={ControlLabel} sm={2}>
                                    New Password:
                    </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="password"
                                        id="nPassword"
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="formHorizontalStudentName">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Confirm Password:
                    </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="password"
                                        id="nConfirm"
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col smOffset={2} sm={10}>
                                    <Button type="submit" bsStyle="primary" onClick={this.submitClicked}>Edit/Save Profile</Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}

export default StudentProfile;