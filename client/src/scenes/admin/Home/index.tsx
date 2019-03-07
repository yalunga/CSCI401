import * as React from 'react';
import {
  Panel,
  Alert
} from 'react-bootstrap';
import { throws } from 'assert';

const style = {
  width: 1000,
  float: 'none',
  margin: 'auto',
};

interface ProjectListProps {
}

interface Global {
  semester: number;
  fallSpring: number;
}

interface ProjectListState {
  fallOrSpring: number;
  year: number;
  isLoading: boolean;
  global?: Global;
}

class AdminHome extends React.Component<ProjectListProps, ProjectListState> {
  constructor(props: ProjectListProps) {
    super(props);
    this.state = {fallOrSpring: 0, year: 2019, isLoading: true};
    this.submitClicked = this.submitClicked.bind(this);
  }

  handleChange(event: any) {
    var val = event.target.value === '0' ? 0 : 1; 
    this.setState({fallOrSpring: val});
  }

  handleChangeText(event: any) {
    console.log(event.target.value);
    this.setState({year: event.target.value});
  }

  getGlobalData(data: any) {
    this.setState({global: data, isLoading: false});
    console.log(data);
    console.log(this.state);
  }
  componentDidMount() {
    this.setState({isLoading: true});
    
    fetch('http://' + window.location.hostname + ':8080/admin/configurations/globalData')
        .then(response => response.json())
        .then(data => this.getGlobalData(data));
}

submitClicked(event: any) {
  fetch('http://' + window.location.hostname + ':8080/admin/configurations/' + this.state.year + '/' + this.state.fallOrSpring)
  .then(() => window.location.reload());
}

  render() {
    
    if (this.state.isLoading) {
      return <p>Loading...</p>;
    } else {
      if (this.state.global) { 
        console.log(this.state.global.fallSpring);
      }
    }
    
    if (this.state.global) {
      var fallOrSpringText = this.state.global.fallSpring === 0 ? 'Fall' : 'Spring';

      return (
            <div style={style as any}>
              <h3>Welcome Back!</h3>
              <select style={{marginRight: '15px'}} onChange={e => this.handleChange(e)}>
                <option value="0">Fall</option>
                <option value="1">Spring</option>
              </select>
              <input onChange={e => this.handleChangeText(e)} type="text" name="year" />
              <br />
              <h4 style={{color: 'red'}}>Current Semester: {fallOrSpringText} {this.state.global.semester}</h4>
              
              <button type="submit" onClick={this.submitClicked}>Submit</button>
            </div>
      );
    }

    return <div />;
  }
}

export default AdminHome;