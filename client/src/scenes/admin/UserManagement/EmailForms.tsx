import * as React from 'react';
import { Box, Text, TextArea } from 'grommet';


interface EmailFormsProps {
}
interface EmailFormsState {
  studentEmails: string;
  adminEmails: string;
  viewingYear: string | null;
  viewingFallSpring: string | null;
}

export default class EmailForms extends React.Component<EmailFormsProps, EmailFormsState> {
  constructor(props: EmailFormsProps) {
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
      emails: (id === 'studentEmails') ? this.state.studentEmails : this.state.adminEmails,
      year: this.state.viewingYear,
      fallSpring: this.state.viewingFallSpring
    });
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${endpoint}`, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const responseText = await response.text();
      alert('Emails were sent.');
      id === 'studentEmails' ? this.setState({ studentEmails: '' }) : this.setState({ adminEmails: '' });
    } catch (error) {
      console.log(error);
      alert('There was an error sending emails.')
    }
  }

  handleChange(e: any) {
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <Box width='full' align='center' gap='medium' direction='row'>
        <Box
          basis='1/2'
          elevation='xsmall'
          pad='small'
          round='xxsmall'
          background='white'
          gap='small'
        >
          <Text size='small' weight='bold'>Student Emails</Text>
          <Box border='all' round='xxsmall'>
            <TextArea
              name='studentEmails'
              resize={false}
              size='xlarge'
              plain
              placeholder='Enter student emails'
              onChange={this.handleChange}
              value={this.state.studentEmails}
            />
          </Box>
          <Box background='brand' width='small' pad='xsmall' align='center' round='xxsmall' onClick={() => this.submitClicked('studentEmails')}>
            <Text>Send Emails</Text>
          </Box>
        </Box>
        <Box
          basis='1/2'
          elevation='xsmall'
          pad='small'
          round='xxsmall'
          background='white'
          gap='small'
        >
          <Text size='small' weight='bold'>Admin Emails</Text>
          <Box border='all' round='xxsmall'>
            <TextArea
              name='adminEmails'
              resize={false}
              size='xlarge'
              plain
              placeholder='Enter admin emails'
              onChange={this.handleChange}
              value={this.state.adminEmails}
            />
          </Box>
          <Box background='brand' width='small' pad='xsmall' align='center' round='xxsmall' onClick={() => this.submitClicked('adminEmails')}>
            <Text>Send Emails</Text>
          </Box>
        </Box>
      </Box>
    )
  }
}