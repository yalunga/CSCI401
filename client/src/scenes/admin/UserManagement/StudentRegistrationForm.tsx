import * as React from 'react';
import {
  Form,
  FormGroup,
  Col,
  FormControl,
  Button,
  ControlLabel,
  Row
} from 'react-bootstrap';

interface StudentRegistrationProps {
}
interface StudentRegistrationState {
  studentEmails: string;
  adminEmails: string;
  viewingYear: string | null;
  viewingFallSpring: string | null;
}
class StudentRegistrationForm extends React.Component<StudentRegistrationProps, StudentRegistrationState> {
  constructor(props: StudentRegistrationProps) {
    super(props);
    this.state = {
      studentEmails: '',
      adminEmails: '',
      viewingYear: '',
      viewingFallSpring: ''
    };
    this.submitClicked = this.submitClicked.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      viewingYear: sessionStorage.getItem('viewingYear'),
      viewingFallSpring: sessionStorage.getItem('viewingFallSpring')
    });
  }

  async submitClicked(id: string) {
    const endpoint = (id === 'studentEmails') ? 'student-emails-registration' : 'admin-emails-registration';
    var data = JSON.stringify({
      emails: this.state[id],
      year: this.state.viewingYear,
      fallSpring: this.state.viewingFallSpring
    });
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${endpoint}`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const responseText = await response.text();
    console.log(responseText);
  }

  handleChange(e: any) {
    // @ts-ignore
    this.setState({ [e.target.id]: e.target.value });
  }

  formGroup(controlId: string, id: string, placeholder: string, value: any) {
    return (
      <FormGroup controlId={controlId}>
        <Row>
          <Col componentClass={ControlLabel} sm={2}>
            {placeholder}
          </Col>
          <Col sm={7}>
            <FormControl
              type="text"
              componentClass="textarea"
              id={id}
              placeholder={placeholder}
              value={value}
              onChange={e => this.handleChange(e)}
              style={{ height: 100 }}
            />
          </Col>
          <Col sm={1}>
            <Button type="submit" onClick={() => this.submitClicked(id)}>Send Invites</Button>
          </Col>
        </Row>
      </FormGroup>
    );

  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Form horizontal={true} >
          {this.formGroup('formHorizontalEmails', 'studentEmails', 'Student Emails', this.state.studentEmails)}
          {this.formGroup('formHorizontalAdminEmails', 'adminEmails', 'Admin Emails', this.state.adminEmails)}
        </Form>
      </div>
    );
  }
}

export default StudentRegistrationForm;