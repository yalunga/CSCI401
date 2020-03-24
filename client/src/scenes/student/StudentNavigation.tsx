import * as React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { Box, Image, Anchor, Text, Stack } from 'grommet';

import WeeklyReviews from './WeeklyReviews/index';
//import FinalPresentationReview from './FinalPresentationReviews/index';

interface StakeholderNavigationProps { }
interface StakeholderNavigationState {
  fallOrSpring: {
    label: string;
    value: string;
  },
  year: number;
}

export default class StakeholderNavigation extends React.Component<StakeholderNavigationProps, StakeholderNavigationState> {
  constructor(props: StakeholderNavigationProps) {
    super(props);
    this.state = {
      fallOrSpring: {
        label: 'Fall',
        value: '0'
      },
      year: 2020
    };
  }

  componentDidMount() {
    let displayYear = 2020;
    let displaySemester = '0';
    let sessionYear = sessionStorage.getItem('viewingYear');
    let sessionFallSpring = sessionStorage.getItem('viewingFallSpring');

    if (sessionYear === null) {
      sessionStorage.setItem('viewingYear', '2020');
    } else {
      displayYear = Number(sessionYear);
    }
    if (sessionFallSpring === null) {
      sessionStorage.setItem('viewingFallSpring', '0');
    } else {
      displaySemester = sessionFallSpring;
    }
    let fallSpringText = 'Spring';
    if (displaySemester === '0') {
      fallSpringText = 'Fall';
    }
    this.setState({ year: displayYear, fallOrSpring: { label: fallSpringText, value: displaySemester } });
  }



  logout() {
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('userType');
    window.location.href = '/';
  }

  render() {
    return (
      <Box height='full' width='full' background='#FAFBFD'>
        <Stack anchor='top-right'>
          <Box width='full' pad={{ horizontal: 'small' }} elevation='xsmall' background='white' direction='row'>
            <Box width='small'>
              <Image fit='contain' src='https://16mhpx3atvadrnpip2kwi9or-wpengine.netdna-ssl.com/wp-content/uploads/2016/10/USC-Shield.png' />
            </Box>
            <Box width='full' align='center' justify='start' pad={{ horizontal: 'medium' }} gap='medium' direction='row'>
              <Anchor href='/student' size='xsmall' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                Profile
            </Anchor>
              <Anchor href='/student/ranking' size='xsmall' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                Project Ranking
              </Anchor>
              <Anchor href='/student/project' size='xsmall' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                Your Project
              </Anchor>
              <Anchor href='/student/weekly_status' size='xsmall' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                 Weekly Status Reviews
              </Anchor>
              <Anchor href='/student/review' size='xsmall' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                Final Presentation Reviews
              </Anchor>
            </Box>
          </Box>
          <Box pad='small' onClick={this.logout} style={{ cursor: 'pointer' }}>
            <Text size='xsmall' color='dark-5' weight='bold' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
              Logout
            </Text>
          </Box>
        </Stack>
        <BrowserRouter>
          <Route exact={true} path="/student" />
          <Route path="/student/ranking" />
          <Route exact={true} path='/student/project' />
          <Route exact={true} path='/student/weekly_status' component={WeeklyReviews}/>
          {/* <Route exact={true} path='/student/review' component={FinalPresentationReview} /> */}
        </BrowserRouter>
      </Box>
    );
  }
}