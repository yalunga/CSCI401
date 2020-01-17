import * as React from 'react';
import { Box, Text, DataTable } from 'grommet'
import TableHeader from '../../TableHelpers/TableHeaders';

interface HomeState {
  projects: Array<{}>;
  isLoading: Boolean;
}

interface HomeProps { }

export default class StakeholderHome extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      projects: [],
      isLoading: true
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    fetch(`${process.env.REACT_APP_API_URL}/projects/` + sessionStorage.getItem('email'))
      .then(response => response.json())
      .then(data => this.setState({ projects: data, isLoading: false }));
  }

  getStatus(statusId: number) {
    if (statusId === 1) {
      return 'Pending Approval';
    } else if (statusId === 2) {
      return 'Approved';
    } else if (statusId === 3) {
      return 'Rejected';
    } else {
      return 'Changes Requested';
    }
  }

  getFSS(fallSpring: number) {
    if (fallSpring === 0) {
      return 'Fall';
    } else if (fallSpring === 1) {
      return 'Spring';
    } else {
      return 'Summer';
    }
  }

  render() {
    const columns = [
      {
        property: 'projectName',
        header: <TableHeader>Project</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.projectName}</Text>
        ),
      },
      {
        property: 'projectStatus',
        header: <TableHeader>Status</TableHeader>,
        render: (datum: any) => (
          <Text>{this.getStatus(datum.statusId)}</Text>
        ),
      },
      {
        property: 'technologies',
        header: <TableHeader>Semester</TableHeader>,
        render: (datum: any) => (
          <Text>{this.getFSS(datum.fallSpring)} {datum.semester}</Text>
        ),
      },
      {
        property: 'minSize',
        header: <TableHeader>View</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.email}</Text>
        ),
      },
      {
        property: 'maxSize',
        header: <TableHeader>Edit</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.email}</Text>
        ),
      },
      {
        property: 'description',
        header: <TableHeader>Duplicate</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.email}</Text>
        ),
      }
    ];
    const { projects } = this.state;
    return (
      <Box pad='medium'>
        <Box background='white' elevation='xsmall' round='xxsmall' pad='small'>
          {projects.length !== 0 ?
            <DataTable
              columns={columns}
              data={[]}
            />
            :
            <Text>You currently have no projects.</Text>
          }
        </Box>
      </Box>
    )
  }
}