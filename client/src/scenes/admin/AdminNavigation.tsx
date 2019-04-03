import * as React from 'react';
import {
  Route,
  BrowserRouter,
  Redirect
} from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavItem,
  FormGroup,
  Button
} from 'react-bootstrap';
import {
  LinkContainer
} from 'react-router-bootstrap';
import AdminHome from './Home/index';
import UserManagement from './UserManagement/index';
import ProjectProposals from './ProjectProposals/index';
import ClassOverview from './ClassOverview/index';
import ProjectMatching from './ProjectMatching/index';
const logo = require('../../svg/logo.svg');

interface SemesterStateProps {
}

interface SemesterState {
  fallOrSpring: number;
  fallOrSpringText: string;
  year: number;
  isLoading: boolean;
}

class AdminNavigation extends React.Component<SemesterStateProps, SemesterState> {
    constructor(props: SemesterStateProps) {
        super(props);
        this.state = {fallOrSpringText: 'Unselected', fallOrSpring: 0, year: 0, isLoading: false};
        this.submitClicked = this.submitClicked.bind(this);
    }
  
  logOutClicked() {
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('userType');
    window.location.href = '/';  
  }  
  
  handleChange(event: any) {
    var val = event.target.value === '0' ? 0 : 1; 
    console.log('Set local form value for fallspring');
    console.log(val);
    this.setState({fallOrSpring: val});
    if (val === 0) {
        this.setState({fallOrSpringText: 'Fall'});
    } else {
        this.setState({fallOrSpringText: 'Spring'});
    }
  }

  handleChangeText(event: any) {
    console.log(event.target.value);
    this.setState({year: event.target.value});
  }
  
submitClicked(event: any) {
    console.log('submitted semester change');
    console.log(this.state.year);
    console.log(this.state.fallOrSpring);
    sessionStorage.setItem('viewingYear', this.state.year.toString());
    sessionStorage.setItem('viewingFallSpring', this.state.fallOrSpring.toString());
    window.location.reload();
}
  
  componentDidMount() {
    this.setState({isLoading: true});
    
    var displayYear = 2019;
    var displaySemester = '0';
    var sessionYear = sessionStorage.getItem('viewingYear');
    var sessionFallSpring = sessionStorage.getItem('viewingFallSpring');
    console.log(sessionYear);
    console.log(sessionFallSpring);
    if (sessionYear === null) {
        sessionStorage.setItem('viewingYear', '2019');
    } else {
        displayYear = Number(sessionYear);
    }
    if (sessionFallSpring === null) {
        sessionStorage.setItem('viewingFallSpring', '0');
    } else {
        displaySemester = sessionFallSpring;
    }
    this.setState({year: Number(displayYear), fallOrSpring: Number(displaySemester)});
    var fallSpringText = 'Spring';
    if (this.state.fallOrSpring === 0) {
        fallSpringText = 'Fall';
    }
    this.setState({fallOrSpringText: fallSpringText, isLoading: false});
 }

  render() {
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    }
    return (
      <BrowserRouter>
        <div>
            <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <img src={logo} className="App-logo" alt="logo" />
              </Navbar.Brand>
              
              <Navbar.Brand>
              <LinkContainer to="/admin">
                <a>CSCI 401</a>
                </LinkContainer>
              </Navbar.Brand> 
              
            </Navbar.Header>
            <Nav>
              <LinkContainer to="/admin/users">
                <NavItem eventKey={1}>
                  User Management
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/admin/proposals">
                <NavItem eventKey={2}>
                  Project Proposals
                </NavItem>
              </LinkContainer>
              {/* <LinkContainer to="/admin/class">
                <NavItem eventKey={3}>
                  Class Overview
                </NavItem>
              </LinkContainer> */}
              <LinkContainer to="/admin/matching">
              <NavItem eventKey={5}>
                Project Matching
              </NavItem>
              </LinkContainer>
              <NavItem eventKey={6}>
                <FormGroup>
                  <Button type="submit" onClick={this.logOutClicked}>Log Out</Button>
              </FormGroup>
              </NavItem>
            </Nav>
            <div>
                <select style={{marginRight: '15px'}} onChange={e => this.handleChange(e)}>
                    <option value="0" selected={this.state.fallOrSpring === 0}>Fall</option>
                    <option value="1" selected={this.state.fallOrSpring === 1}>Spring</option>
                </select>
                <input value={this.state.year} onChange={e => this.handleChangeText(e)} type="text" name="year" />
                    <br />
                  
                <button type="submit" onClick={this.submitClicked}>Change Viewing Semester</button>
            </div>
          </Navbar>
          <div className="content">
            <Route exact={true} path="/admin" component={AdminHome}/>
            <Route path="/admin/users" component={UserManagement}/>
            <Route path="/admin/proposals" component={ProjectProposals}/>
            <Route path="/admin/class" component={ClassOverview}/>
            <Route path="/admin/matching" component={ProjectMatching}/>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default AdminNavigation;