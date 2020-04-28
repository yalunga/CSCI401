import * as React from 'react';
import { Box, Text, TableHeader, Grommet, Tabs, Tab, DataTable, grommet, Accordion, AccordionPanel } from 'grommet';
import Input from './Input';
import Select from './Select';
import TextArea from './TextArea';
import Alert from './Alert';
import { deepMerge } from 'grommet/utils';

interface ProjectProps {
  projectId: string;
  entryType: string;
}
interface Project {
  projectId: number;
  projectName: string;
  minSize: number;
  maxSize: number;
  technologies: string;
  background: string;
  description: string;
  statusId: number;
  adminComments?: string;
}
interface ProjectState {
  students: Array<StudentInfo>;
  statusReports: Array<{}>;
  project: Project;
  isLoading: Boolean;
  alert: boolean
}

interface StudentInfo {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

export default class ProjectInformation extends React.Component<ProjectProps, ProjectState> {
  constructor(props: ProjectProps) {
    super(props);
    this.state = {
      students: [],
      statusReports: [],
      project: {
        projectId: 0,
        projectName: '',
        minSize: 0,
        maxSize: 0,
        technologies: '',
        background: '',
        description: '',
        statusId: 0,
      },
      isLoading: true,
      alert: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkEntry = this.checkEntry.bind(this);
    this.onChangeMin = this.onChangeMin.bind(this);
    this.onChangeMax = this.onChangeMax.bind(this);
  }
  componentDidMount() {
    // fetch(`${process.env.REACT_APP_API_URL}/projects/` + sessionStorage.getItem('email') + '/' + this.props.projectId)
    // Implement Promise.all
    fetch(`${process.env.REACT_APP_API_URL}/projects/id/${this.props.projectId}`)
      .then(response => response.json())
      .then(data => this.setState({
        project: data,
        isLoading: false
      }))
      .then(this.checkEntry); 
    // Get status reports for stakeholder
    fetch(`${process.env.REACT_APP_API_URL}/assignment/getweeklyreportsbystakeholder/`+ sessionStorage.getItem('viewingYear') + '/' + sessionStorage.getItem('email') , {
      method: 'get',
      headers: new Headers({
        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
      }) 
    })
    .then(response => response.json())
    .then(data => this.setState({ statusReports: data, isLoading: false }));

  }

  checkEntry() {
    if (this.props.entryType === 'edit' && this.state.project.statusId !== 1) {
      var project = { ...this.state.project };
      project.statusId = 1;
      this.setState({
        project
      });
      fetch(`${process.env.REACT_APP_API_URL}/projects/dabao/`, {
        method: 'POST',
        body: JSON.stringify({
          projectId: this.state.project.projectId,
          projectName: this.state.project.projectName,
          projectMin: this.state.project.minSize,
          projectMax: this.state.project.maxSize,
          technology: this.state.project.technologies,
          background: this.state.project.background,
          description: this.state.project.description,
          statusId: this.state.project.statusId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.text())
        .then((responsetext => console.log('dabao here: ' + responsetext)))
        .catch((err) => console.log('dabao error: ' + err));
    }
  }

  handleChange(e: any) {
    var project = { ...this.state.project };
    // @ts-ignore
    project[e.target.name] = e.target.value;
    this.setState({
      project
    });
  }

  handleSubmit(e: any) {

    if (this.state.students.length !== 0) {
      alert('Students are assigned, cannot edit project');
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/projects/dabao/`, {
      method: 'POST',
      body: JSON.stringify({
        projectId: this.state.project.projectId,
        projectName: this.state.project.projectName,
        projectMin: this.state.project.minSize,
        projectMax: this.state.project.maxSize,
        technology: this.state.project.technologies,
        background: this.state.project.background,
        description: this.state.project.description,
        statusId: this.state.project.statusId
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((response) => {
        if (response.ok) {
          this.setState({ alert: true }, () => setTimeout(() => {
            this.setState({ alert: false });
          }, 2000));
        } else {
          alert('Something went wrong. Please try again!');
        }
      })
      .catch((err) => console.log('dabao error: ' + err));
  }

  onChangeMax({ option }: any) {
    let project: Project = { ...this.state.project };
    project.maxSize = option;
    this.setState({ project });
  }

  onChangeMin({ option }: any) {
    let project: Project = { ...this.state.project };
    // @ts-ignore
    project.minSize = option;
    if (this.state.project.maxSize < option) {
      project.maxSize = option;
    }
    this.setState({ project });

  }
  getStatus(id: number) {
    if (id === 0 || id === 1) {
      return 'Pending Approval';
    } else if (id === 2) {
      return 'Approved';
    } else if (id === 3) {
      return 'Rejected';
    }
    return 'Changes Requested';
  }

  async submitClicked(projectId: number, type: number) {
    if (type === 1) {
      await fetch(`${process.env.REACT_APP_API_URL}/deliverables/pending/` + projectId, {
        method: 'POST'
      })
    } else if (type === 2) {
      await fetch(`${process.env.REACT_APP_API_URL}/deliverables/approve/` + projectId, {
        method: 'POST'
      })
    } else if (type === 3) {
      await fetch(`${process.env.REACT_APP_API_URL}/deliverables/reject/` + projectId, {
        method: 'POST'
      })
    } else if (type === 4) {
      await fetch(`${process.env.REACT_APP_API_URL}/deliverables/change/` + projectId, {
        method: 'POST'
      })
    }
    this.setState({ alert: true }, () => setTimeout(() => {
      this.setState({ alert: false });
    }, 2000));
    //this.getProjects();
  }

  render() {
    console.log(this.state.project);
    const columnsD = [
      {
        property: 'select',
        header: <TableHeader>Approve/Reject</TableHeader>,
        render: (datum: any) => {
          return (
            <Box direction='row' gap='xsmall'>
              <Box elevation='xsmall' background='#43A047' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={() => this.submitClicked(datum.projectId, 2)}>
                <Text>Approve</Text>
              </Box>
              <Box elevation='xsmall' background='#FFCB02' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={() => this.submitClicked(datum.projectId, 1)}>
                <Text>Partial Approval</Text>
              </Box>
              <Box elevation='xsmall' background='status-error' pad='xsmall' align='center' round='xxsmall' className='pointer' onClick={() => this.submitClicked(datum.projectId, 3)}>
                <Text>Reject</Text>
              </Box>
            </Box>
          )
        },
      },
      {
        property: 'deliverableNum',
        header: <TableHeader>Deliverable Number</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.deliverableName}</Text>
        ),
      },
      {
        property: 'deliverableStatus',
        header: <TableHeader>Deliverable Status</TableHeader>,
        render: (datum: any) => (
          <Text>{this.getStatus(datum.statusId)}</Text>
        ),
      }
    ];
    const columnsT = [
      {
        property: 'First Name',
        header: <TableHeader>First Name</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.firstName}</Text>
        ),
      },
      {
        property: 'Last Name',
        header: <TableHeader>Last Name</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.lastName}</Text>
        ),
      },
      {
        property: 'Email',
        header: <TableHeader>Email</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.email}</Text>
        ),
      }
    ];
    const columnsR = [
      {
        property: 'Week',
        header: <TableHeader>Status Report Date</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.dueDate}</Text>
        ),
      },
      {
        property: 'Student',
        header: <TableHeader>Student</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.student.firstName} {datum.student.lastName}</Text>
        ),
      },
      {
        property: 'Time',
        header: <TableHeader>Submission Time</TableHeader>,
        render: (datum: any) => (
          <Text>{datum.submitDateTime}</Text>
        ),
      },
      {
        property: 'ThisWeekTasks',
        header: <TableHeader>Tasks</TableHeader>,
        render: (datum: any) => (
          <Accordion>
            <AccordionPanel label="This Week">
              <Box pad="medium" background="light-2">
                  <DataTable
                  columns={[
                    {
                      property: 'hours',
                      header:<Text>Hours</Text>,
                      primary: true
                    },
                    {
                      property: 'description',
                      header: 'Task',
                      render: datum => (
                        <Text>{datum.description}</Text>
                      )
                    },
                  ]}
                  data={datum.thisWeekTasks}/>
              </Box>
            </AccordionPanel>
          </Accordion>
        ),
      },
      {
        property: 'NextWeekTasks',
        header: '',
        render: (datum: any) => (
          <Accordion>
            <AccordionPanel label="Next Week">
              <Box pad="medium" background="light-2">
                  <DataTable
                  columns={[
                    {
                      property: 'hours',
                      header:<Text>Hours</Text>,
                      primary: true
                    },
                    {
                      property: 'description',
                      header: 'Task',
                      render: datum => (
                        <Text>{datum.description}</Text>
                      )
                    },
                  ]}
                  data={datum.nextWeekTasks}/>
              </Box>
            </AccordionPanel>
          </Accordion>
        ),
      },

    ];
    const pTheme = deepMerge(grommet, {
      global: {
        edgeSize: {
          small: "12px"
        },
        elevation: {
          light: {
            small: "0px 1px 5px rgba(0, 0, 0, 0.50)",
            medium: "0px 3px 8px rgba(0, 0, 0, 0.50)"
          }
        }
      },
      tab: {
        active: {
          //background: "dark-1",
          color: "maroon",
          border: undefined,
        },
        //background: "light-1",
        border: undefined,
        color: "black",
        hover: {
          background: "light-3"
        },
        margin: undefined,
        pad: {
          bottom: undefined,
          horizontal: "small"
        },
      },
      tabs: {
        //background: "dark-3",
        color: "black",
        gap: "small",
        header: {
          //border: undefined,
          //background: "light-1",
        },
      }
    });
    return (
      <Box width='xlarge' elevation='xsmall' round='xxsmall' background='white' pad='small' gap='medium'>
        {this.props.entryType === 'view' &&
          <Grommet theme={pTheme}>
            <Tabs>
              <Tab title="Project Information">
                <Box margin="small" pad="large">
                  <Text weight='bold' size='large'>Project Information</Text>
                  <Input
                    title='Project Name'
                    name='projectName'
                    value={this.state.project.projectName}
                    onChange={this.handleChange}
                    disabled={this.props.entryType === 'view' ? true : false}
                  />
                  <Box direction='row' gap='xsmall'>
                    <Input
                      title='Min Number of Students'
                      name='minSize'
                      options={Array.from({ length: 20 }, (v, i) => i + 1)}
                      onChange={this.onChangeMin}
                      value={this.state.project.minSize}
                      disabled={this.props.entryType === 'view' ? true : false}
                      icon={this.props.entryType !== 'view' ? true : false}
                    />
                    <Input
                      title='Max Number of Students'
                      name='maxSize'
                      options={Array.from({ length: 20 - this.state.project.minSize }, (v, i) => i + this.state.project.minSize + 1)}
                      onChange={this.onChangeMax}
                      value={this.state.project.maxSize}
                      disabled={this.props.entryType === 'view' ? true : false}
                      icon={this.props.entryType !== 'view' ? true : false}
                    />
                  </Box>
                  <Input
                    title='Technologies Expected'
                    name='technologies'
                    value={this.state.project.technologies}
                    onChange={this.handleChange}
                    disabled={this.props.entryType === 'view' ? true : false}
                  />
                  <Input
                    title='Background Requested'
                    name='background'
                    value={this.state.project.background}
                    onChange={this.handleChange}
                    disabled={this.props.entryType === 'view' ? true : false}
                  />
                  <TextArea
                    title='Description'
                    name='description'
                    value={this.state.project.description}
                    onChange={this.handleChange}
                    disabled={this.props.entryType === 'view' ? true : false}
                  />
                </Box>
              </Tab>
              <Tab title="Team Information">
                <Box margin="small" pad="large">
                  <Text weight="bold" size="large">Team Contact Information</Text>
                  <DataTable
                    columns={columnsT.map(column => ({
                      ...column,
                    }))}
                  />
                </Box>
              </Tab>
              <Tab title="Deliverables">
                <Box margin="small" pad="large">
                  <Text weight='bold' size='large'>Project Deliverables</Text>
                  <DataTable
                    columns={columnsD.map(column => ({
                      ...column,
                    }))}
                  //data={this.state.deliverables} 
                  />
                  {this.state.alert && <Alert text='Changed Project State' />}
                </Box>
              </Tab>
              <Tab title="Status Reports">
                <Box margin="small" pad="small" align="center">
                  <Text weight="bold" size="large">Weekly Status Reports</Text>
                  <DataTable
                    columns={columnsR.map(column => ({
                      ...column,
                    }))}
                    data={this.state.statusReports}
                  />
                </Box>
              </Tab>
            </Tabs>
          </Grommet>
        }

        {this.props.entryType !== 'view' &&
          //<Text weight='bold' size='large'>Project Information</Text>
          <Input
            title='Project Name'
            name='projectName'
            value={this.state.project.projectName}
            onChange={this.handleChange}
            disabled={this.props.entryType === 'view' ? true : false}

          />
        }
        {this.props.entryType !== 'view' &&
          <Box direction='row' gap='xsmall'>
            <Select
              title='Min Number of Students'
              name='minSize'
              options={Array.from({ length: 20 }, (v, i) => i + 1)}
              onChange={this.onChangeMin}
              value={this.state.project.minSize}
              disabled={this.props.entryType === 'view'}
              icon={this.props.entryType !== 'view' ? true : false}
            />
            <Select
              title='Max Number of Students'
              name='maxSize'
              options={Array.from({ length: 20 - this.state.project.minSize }, (v, i) => i + this.state.project.minSize + 1)}
              onChange={this.onChangeMax}
              value={this.state.project.maxSize}
              disabled={this.props.entryType === 'view'}
              icon={this.props.entryType !== 'view' ? true : false}
            />
          </Box>
        }
        {this.props.entryType !== 'view' &&
          <Input
            title='Technologies Expected'
            name='technologies'
            value={this.state.project.technologies}
            onChange={this.handleChange}
            disabled={this.props.entryType === 'view'}
          />
        }
        {this.props.entryType !== 'view' &&
          <Input
            title='Background Requested'
            name='background'
            value={this.state.project.background}
            onChange={this.handleChange}
            disabled={this.props.entryType === 'view' ? true : false}
          />
        }
        {this.props.entryType !== 'view' &&
          <TextArea
            title='Description'
            name='description'
            value={this.state.project.description}
            onChange={this.handleChange}
            disabled={this.props.entryType === 'view'}
          />
        }
        {this.props.entryType !== 'view' &&
          <Box background='brand' width='small' pad='xsmall' align='center' round='xxsmall' alignSelf='start' onClick={this.handleSubmit}>
            <Text>Submit</Text>
          </Box>
        }
        {(this.props.entryType === 'view' && this.state.project.adminComments) && (
          <TextArea
            title='Admin Comments'
            name='adminComments'
            value={this.state.project.adminComments}
            disabled
          />
        )}
        {this.state.alert && (
          <Alert text={`${this.state.project.projectName} updated.`} />
        )}
      </Box>
    );
  }
}