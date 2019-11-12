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
    semester: number;
}
interface ProfileState {
    user: User;
    isLoading: boolean;
}

class StakeholderProfile extends React.Component<ProfileProps, ProfileState> {
    constructor(props: ProfileProps) {
        super(props);
        this.state = {
            user: { 
                firstName: '', 
                email: '', 
                phone: '', 
                organization: '' ,
                semester: 0
            },
            isLoading: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        this.setState({ isLoading: true });
        fetch(`${process.env.REACT_APP_API_URL}/users/` + sessionStorage.getItem('email')) // link
            .then(response => response.json())
            .then(data => this.setState({
                user: data,
                isLoading: false
            }))
            .catch((error) => {
                console.log('error: ' + error);
            });
    }
    
    handleChange(e: any) {
        // @ts-ignore
        var user = { ...this.state.user };
        user[e.target.id] = e.target.value;
        this.setState({
            user
        });
    }

    handleSubmit(e: any) {
        fetch(`${process.env.REACT_APP_API_URL}/users/update-info`, {
            method: 'POST',
            body: JSON.stringify({
                email: sessionStorage.getItem('email'),
                phone: this.state.user.phone,
                password: '',
                firstName: this.state.user.firstName,
                userType: '',
                semester: this.state.user.semester,
                organization: this.state.user.organization
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
            .then((data) => console.log(Object.keys(data)))
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