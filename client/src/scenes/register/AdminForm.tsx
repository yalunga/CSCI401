import * as React from 'react';
import {
    Form,
    FormGroup,
    Col,
    FormControl,
    Button,
    ControlLabel
} from 'react-bootstrap';
const style = {
    width: 600,
    float: 'none',
    margin: 'auto',
};

interface AdminRegistrationProps {
}
interface AdminRegistrationState {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirm: string;
    errorMsg: string;
}
class AdminRegistrationForm extends React.Component<AdminRegistrationProps, AdminRegistrationState> {
    constructor(props: AdminRegistrationProps) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirm: '',
            errorMsg: ''
        };
        this.submitClicked = this.submitClicked.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    async submitClicked() {
        if (this.state.firstName === '' || this.state.lastName === '' || this.state.email === '' || this.state.phone === '' || this.state.confirm === '' || this.state.password === '') {
            this.setState({ errorMsg: 'Please fill in all the information.' });
            return;
        }
        if (this.state.password !== this.state.confirm) {
            this.setState({ errorMsg: 'Your passwords do not match. Please try again.' });
            return;
        }
        var data = JSON.stringify({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            phone: this.state.phone,
            password: this.state.password
        });
        const response = await fetch(`http://${window.location.hostname}:8080/users/admin-registration`, {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const responseText = await response.text();
        if (responseText === 'This email has not recieved an invite.'
            || responseText === 'This email is registered as a student.'
            || responseText === 'This email is registered as an admin.') {
            this.setState({ errorMsg: responseText });
        } else if (responseText === 'success') {
            window.location.href = '/';
        }
        console.log(responseText);
    }

    handleChange(e: any) {
        // @ts-ignore
        this.setState({ [e.target.id]: e.target.value });
    }

    formGroup(controlId: string, type: string, id: string, placeholder: string, value: any) {
        return (
            <FormGroup controlId={controlId}>
                <Col componentClass={ControlLabel} sm={2}>
                    {placeholder}
                </Col>
                <Col sm={10}>
                    <FormControl
                        type={type}
                        id={id}
                        value={value}
                        placeholder={placeholder}
                        onChange={e => this.handleChange(e)}
                        onFocus={() => this.setState({ errorMsg: '' })}
                    />
                </Col>
            </FormGroup>
        );

    }

    render() {
        return (
            <div style={style as any}>
                <h2>Admin Registration</h2>
                <Form horizontal={true} >
                    {this.formGroup('formHorizontalName', 'text', 'firstName', 'First Name', this.state.firstName)}
                    {this.formGroup('formHorizontalName', 'text', 'lastName', 'Last Name', this.state.lastName)}
                    {this.formGroup('formHorizontalEmail', 'text', 'email', 'Email', this.state.email)}
                    {this.formGroup('formHorizontalPhone', 'phone', 'phone', 'Phone', this.state.phone)}
                    {this.formGroup('formHorizontalPassword', 'password', 'password', 'Password', this.state.password)}
                    {this.formGroup('formHorizontalConfirm', 'password', 'confirm', 'Confirm Password', this.state.confirm)}

                    {this.state.errorMsg && (
                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <span style={{ color: 'red' }}>{this.state.errorMsg}</span>
                            </Col>
                        </FormGroup>
                    )}
                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <Button type="reset" onClick={this.submitClicked}>Register</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default AdminRegistrationForm;