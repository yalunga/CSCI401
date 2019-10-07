import * as React from 'react';
import {
    Panel,
    Button,
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
    organization: string;
}
interface ProfileState {
    user: User;
    isLoading: boolean;
}

class StakeholderProfile extends React.Component<ProfileProps, ProfileState> {
    constructor(props: ProfileProps) {
        super(props);
        this.state = {
            user: { firstName: '', email: '', phone: '', organization: '' },
            isLoading: false,
        };
        this.submitClicked = this.submitClicked.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        this.setState({ isLoading: true });
        // console.log('did mount');
        fetch('http://' + window.location.hostname + ':8080/users/' + sessionStorage.getItem('email')) // link
            .then(response => response.json())
            // .then(response => response.text())
            // .then((responseText) => {
            //     console.log('response: ' + responseText);
            //     // console.log('location: ' + window.location.hostname);
            //     // console.log('session storage: ' + sessionStorage.getItem('email'));
            //     // console.log(Object.keys(sessionStorage));
            // })
            .then(data => this.setState({
                 user: data, 
                 isLoading: false 
            }))
            .catch((error) => {
                console.log('error: ' + error);
            });
        /*var request = new XMLHttpRequest();
        request.withCredentials = true;
        request.open('GET', 'http://' + window.location.hostname + ':8080/users/' + sessionStorage.getItem('email'));
        request.setRequestHeader('Cache-Control', 'no-cache');
        request.send();

        var that = this;
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                var response = request.responseText;
                var jsonResponse = JSON.parse(response);
                var firstNameLiteral = 'firstName';
                var emailLiteral = 'email';
                var phoneLiteral = 'phone';
                var companyLiteral = 'companyName';
                that.setState({
                    name: jsonResponse[firstNameLiteral], 
                    email: jsonResponse[emailLiteral],
                    phone: jsonResponse[phoneLiteral],
                    company: jsonResponse[companyLiteral],
                    isLoading: false
                });
            }
        };*/
    }
    submitClicked() {
        /*     var request = new XMLHttpRequest();
             request.withCredentials = true;
             request.open('POST', 'http://' + window.location.hostname + ':8080//');
             request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
             var data = JSON.stringify({
                 fullName: this.state.name,
                 email: this.state.email,
                 phone: this.state.phone
             });
             request.setRequestHeader('Cache-Control', 'no-cache');
             request.send(data);
             alert(request.responseText + 'Logging you in...');
             request.onreadystatechange = function() {
                 if (request.readyState === 4) {
                 }
             }; */
    }
    handleChange(e: any) {
        // @ts-ignore
        var user = {...this.state.user};
        user[e.target.id] = e.target.value;
        this.setState({
            user
        });
    }

    handleSubmit(e: any) {
        // e.preventDefault();
        alert('on submit');
        // alert('email: ' + this.state.user.email);

        // var temp = new Map();
        // temp.set('email', 'test@usc.edu');
        // temp.set('phone', 'testphone');
        // temp.set('password', 'testpwd');
        // temp.set('firstName', 'testfn');
        // temp.set('userType', 'tempuser');

        // change phone, password, name
        
        fetch('http://' + window.location.hostname + ':8080/users/update-info', {
            method: 'POST',
            body: JSON.stringify({
                email: sessionStorage.getItem('email'),
                phone: this.state.user.phone,
                password: '',
                firstName: this.state.user.firstName,
                userType: ''
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
        .then((data) => alert(Object.keys(data)))
        .catch((err) => console.log(err));
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
                        <Form horizontal={true} onSubmit={this.handleSubmit}>
                            <FormGroup controlId="formHorizontalStakeholderName">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Name:
                    </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="text"
                                        id="firstName"
                                        value={this.state.user.firstName}
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="formHorizontalStakeholderEmail">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Email:
                    </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="email"
                                        id="email"
                                        value={this.state.user.email}
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="formHorizontalStakeholderCompany">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Company/Organization:
                    </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="text"
                                        id="organization"
                                        value={this.state.user.organization}
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="formHorizontalStakeholderPhone">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Phone:
                    </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="tel"
                                        id="phone"
                                        value={this.state.user.phone}
                                        onChange={e => this.handleChange(e)}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col smOffset={2} sm={10}>
                                    <Button type="submit" bsStyle="primary">Edit/Save Profile</Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}

export default StakeholderProfile;