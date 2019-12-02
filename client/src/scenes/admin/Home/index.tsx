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
        .then(response => response.json());
      const currentYear = new Date().getFullYear();
      this.setState({ fallOrSpring: 0, year: currentYear });
    } else {
      const global = {
        semester: Number(sessionStorage.getItem('viewingYear')),
        fallSpring: Number(sessionStorage.getItem('viewingFallSpring'))
      };
      this.setState({ global, isLoading: false, fallOrSpring: global.fallSpring, year: global.semester });
    }
    this.setState({
      isLoading: false
    });
  }

  handleChange(event: any) {
    var val = event.target.value === '0' ? 0 : 1;
    this.setState({ fallOrSpring: val });
  }

  handleChangeText(event: any) {
    console.log(event.target.value);
    this.setState({ year: event.target.value });
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
    }

    var fallOrSpringText = this.state.fallOrSpring === 0 ? 'Fall' : 'Spring';

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
        <h4 style={{ color: 'red' }}>Current Semester: {fallOrSpringText} {this.state.year}</h4>

        <button type="submit" onClick={this.submitClicked}>Submit</button>
      </div>
    );

  }
}

export default AdminHome;