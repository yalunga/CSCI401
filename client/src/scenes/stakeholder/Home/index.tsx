import * as React from 'react';
import {
    Panel,
    Table,
    Alert,
    Button
} from 'react-bootstrap';
import {
    LinkContainer
} from 'react-router-bootstrap';
const viewIcon = require('../../../svg/viewIcon.svg');
const style = {
    width: 1000,
    float: 'none',
    margin: 'auto'
};
interface Project {
    projectId: number;
    projectName: string;
    statusId: number;
    semester: number;
    fallSpring: number;
}

interface HomeState {
    projects: Array<{}>;
    isLoading: Boolean;
}

interface HomeProps {
}

class StakeholderHome extends React.Component<HomeProps, HomeState> {
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

    showCurrentYear() {
        return new Date().getFullYear();
    }

    getSem(semester: number) {
        if (semester === 1000) {
            return this.showCurrentYear();
        } else if (semester === 2000) {
            return this.showCurrentYear() + 1;
        } else {
            return this.showCurrentYear();
        }
    }

    render() {
        const { projects, isLoading } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        return (
            <div style={style as any}>

                <h3>Welcome back!</h3>
                <Panel>
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">Your Projects</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <Table>
                            <thead>
                                <th>Project</th>
                                <th>Status</th>
                                <th>Semester</th>
                                <th>View</th>
                                <th>Edit</th>
                                <th>Duplicate</th>
                            </thead>
                            <tbody>
                                {projects.map((project: Project, index: number) =>
                                    <tr key={project.projectId}>
                                        <td>{project.projectName}</td>
                                        <td>{this.getStatus(project.statusId)}</td>
                                        <td>{this.getFSS(project.fallSpring)} {this.getSem(project.semester)}</td>
                                        <td>
                                            <LinkContainer to={{ pathname: 'stakeholder/project/' + project.projectId + '/view' }}>
                                                <img src={viewIcon} />
                                            </LinkContainer>
                                        </td>
                                        <td>
                                            <LinkContainer to={{ pathname: 'stakeholder/project/' + project.projectId + '/edit' }}>
                                                <img src={viewIcon} />
                                            </LinkContainer>
                                        </td>
                                        <td>
                                            <LinkContainer to={{ pathname: 'stakeholder/proposals/' + project.projectId }}>
                                                <img src={viewIcon} />
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}

export default StakeholderHome;
