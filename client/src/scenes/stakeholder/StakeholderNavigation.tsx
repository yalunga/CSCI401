import * as React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { Box, Image, Anchor, Text, Stack } from 'grommet';
import Home from './Home';
import Profile from './Profile';
import ProjectProposals from './ProjectProposals';
import ProjectPage from './ProjectPage';


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
    this.onChangeFallSpring = this.onChangeFallSpring.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);
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

  onChangeFallSpring({ option }: any) {
    sessionStorage.setItem('viewingFallSpring', option.value);
    this.setState({
      fallOrSpring: {
        label: option.label,
        value: option.value
      }
    });
  }

  onChangeYear({ option }: any) {
    sessionStorage.setItem('viewingYear', option);
    this.setState({ year: option });
  }

  renderOptionsFallSpring(option: any) {
    return (
      <Box pad='small'>
        <Text weight='bold' size='xsmall' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
          {option.label}
        </Text>
      </Box>
    );
  }
  renderOptionsYear(year: any) {
    return (
      <Box pad='small'>
        <Text weight='bold' size='xsmall' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
          {year}
        </Text>
      </Box>
    );
  }

  logout() {
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('userType');
    window.location.href = '/';
  }

  render() {
    const { fallOrSpring, year } = this.state;
    return (
      <Box height='full' width='full' background='#FAFBFD'>
        <Stack anchor='top-right'>
          <Box width='full' pad={{ horizontal: 'small' }} elevation='xsmall' background='white' direction='row'>
            <Box width='small'>
              <Image fit='contain' src='https://16mhpx3atvadrnpip2kwi9or-wpengine.netdna-ssl.com/wp-content/uploads/2016/10/USC-Shield.png' />
            </Box>
            <Box width='full' align='center' justify='start' pad={{ horizontal: 'medium' }} gap='medium' direction='row'>
              <Anchor href='/stakeholder' size='xsmall' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                Home
            </Anchor>
              <Anchor href='/stakeholder/profile' size='xsmall' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                Profile
            </Anchor>
              <Anchor href='/stakeholder/proposals' size='xsmall' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                Project Proposals
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
          <Route exact={true} path="/stakeholder" component={Home} />
          <Route exact={true} path='/stakeholder/profile' component={Profile} />
          <Route path="/stakeholder/project/:projectId/:entry" handler={ProjectPage} component={ProjectPage} />
          <Route exact={true} path='/stakeholder/proposals/:projectId?' handler={ProjectProposals} component={ProjectProposals} />
        </BrowserRouter>
      </Box>
    );
  }
}