import * as React from 'react';
import Cleave from 'cleave.js/react';

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
    this.state = { fallOrSpring: 0, year: 2019, isLoading: true };
    this.submitClicked = this.submitClicked.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    if (sessionStorage.getItem('viewingYear') === null || sessionStorage.getItem('viewingFallSpring') === null) {
      fetch(`${process.env.REACT_APP_API_URL}/admin/configurations/globalData`)
        .then(response => response.json())
        .then(data => this.getGlobalData(data));
    } else {
      const global = {
        semester: Number(sessionStorage.getItem('viewingYear')),
        fallSpring: Number(sessionStorage.getItem('viewingFallSpring'))
      };
      this.setState({ global, isLoading: false });
    }
  }

  handleChange(event: any) {
    var val = event.target.value === '0' ? 0 : 1;
    this.setState({ fallOrSpring: val });
  }

  handleChangeText(event: any) {
    console.log(event.target.value);
    this.setState({ year: event.target.value });
  }

  getGlobalData(data: any) {
    this.setState({ global: data, isLoading: false });
    sessionStorage.setItem('viewingYear', data.semester);
    sessionStorage.setItem('viewingFallSpring', data.fallSpring);
    console.log(data);
    console.log(this.state);
  }

  submitClicked(event: any) {
    fetch(`${process.env.REACT_APP_API_URL}/admin/configurations/` + this.state.year + '/' + this.state.fallOrSpring)
      .then(() => {
        sessionStorage.setItem('viewingYear', String(this.state.year));
        sessionStorage.setItem('viewingFallSpring', String(this.state.fallOrSpring));
      })
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
          <div>
            <select style={{ marginRight: '15px' }} onChange={e => this.handleChange(e)}>
              <option value="0">Fall</option>
              <option value="1">Spring</option>
            </select>
            <Cleave
              onChange={this.handleChangeText}
              options={{
                date: true,
                datePattern: ['Y']
              }}
            />
          </div>
          <br />
          <h4 style={{ color: 'red' }}>Current Semester: {fallOrSpringText} {this.state.global.semester}</h4>

          <button type="submit" onClick={this.submitClicked}>Submit</button>
        </div>
      );
    }

    return <div />;
  }
}

export default AdminHome;