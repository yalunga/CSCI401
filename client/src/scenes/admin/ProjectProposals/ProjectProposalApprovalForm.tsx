import * as React from 'react';

import {
  Button,
  Table,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Modal,
  Col
} from 'react-bootstrap';

interface ProjectListProps {
}

interface ProjectListState {
projects: Array<{}>;
isLoading: boolean;
selected: boolean;
projectToEdit?: Project;
editAdminComments: string;
projectIndexToEdit: number;
// <Button onClick={this.toggleCheckboxes}>Select All</Button>
}

interface Project {
    projectId: number;
    adminComments: string;
    projectName: string;
    statusId: number;
    minSize: string;
    maxSize: string;
    technologies: string;
    background: string;
    description: string;
}

class ProjectProposalApprovalForm extends React.Component<ProjectListProps, ProjectListState> {
    constructor(props: ProjectListProps) {
        super(props);
        
        this.state = {
            projects: [],
            editAdminComments: '',
            isLoading: false,
            selected: false,
            projectIndexToEdit: -1
        };
        this.submitClicked = this.submitClicked.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleCheckboxes = this.toggleCheckboxes.bind(this);
    }
    submitClicked(projectId: number, type: number) {
        /*var request = new XMLHttpRequest();
        request.withCredentials = true;
        request.open('POST', 'http://' + window.location.hostname + ':8080/projectApprovalAttempt/');
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        var data = JSON.stringify({
        projects: this.state.projects,
        });
        request.setRequestHeader('Cache-Control', 'no-cache');
        request.send(data); */
        var request = new XMLHttpRequest();
        request.withCredentials = true;
        if (type === 1) {
            request.open('POST', 'http://' + window.location.hostname + ':8080/projects/pending/' + projectId);
        } else if (type === 2) {
            request.open('POST', 'http://' + window.location.hostname + ':8080/projects/approve/' + projectId);
        } else if (type === 3) {
            request.open('POST', 'http://' + window.location.hostname + ':8080/projects/reject/' + projectId);
        } else if (type === 4) {
            request.open('POST', 'http://' + window.location.hostname + ':8080/projects/change/' + projectId);
        }
        
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Cache-Control', 'no-cache');
        request.send();
    }

    editProject(index: number, project: Project) {
        this.setState({
            projectIndexToEdit: index,
            projectToEdit: project,
            editAdminComments: project.adminComments
        });
    }
    cancelEdit = () => {
        this.setState({projectIndexToEdit: -1});
    }

    submitEdit = () => {
        var request = new XMLHttpRequest();
        request.withCredentials = true;
        request.open('POST', 'http://' + window.location.hostname + ':8080/projects/change/adminComments/' + this.state.projectIndexToEdit);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        var data = this.state.editAdminComments;
        request.setRequestHeader('Cache-Control', 'no-cache');
        request.send(data);
        // alert('Project has been updated succesfully!');
        this.submitClicked(this.state.projectIndexToEdit, 4);
        window.location.reload();
        this.setState({projectIndexToEdit: -1});
    }

    handleChange(e: any) {
        let projects = this.state.projects;
        let name = e.target.value;
        {projects.map((project: Project) => {
            if (project.projectName === name && e.target.checked) {
                project.statusId = 2;
            } else if (project.projectName === name && !e.target.checked) {
                project.statusId = 1;
            }
        }); }

        this.setState({
            projects: projects
         });
    }

    handleChangeModal(e: any) {
        this.setState({ [e.target.id]: e.target.value });
    }

    toggleCheckboxes() {
        if (this.state.selected === false) {
            this.setState({
                selected: true
            });
        } else {
            this.setState({
                selected: false
            });
        }
    }    
    componentDidMount() {
        this.setState({isLoading: true});
        
        fetch('http://' + window.location.hostname + ':8080/projects')
            .then(response => response.json())
            .then(data => this.setState({projects: data, isLoading: false}));
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
    
    render() {
        const {projects, isLoading} = this.state;
        
        if (isLoading) {
            return <p>Loading...</p>;
        }

        var ModalEditProject = <div/>;
        if (typeof this.state.projectToEdit !== 'undefined') {
            ModalEditProject = (
                <Modal bsSize="lg" dialogClassName="modal-90w" show={this.state.projectIndexToEdit !== -1} onHide={this.cancelEdit}>
                    <Modal.Header closeButton={true}>
                        <Modal.Title>Edit Project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal={true} >
                            <FormGroup controlId="formHorizontalAdminComment">
                                <Col componentClass={ControlLabel} sm={3}>
                                    Admin Comment
                                </Col>
                                <Col sm={9}>
                                <FormControl
                                    type="text"
                                    id="editAdminComments"
                                    value={this.state.editAdminComments}
                                    placeholder="Admin Comment"
                                    onChange={e => this.handleChangeModal(e)}
                                />
                                </Col>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.cancelEdit}>Cancel</Button>
                        <Button onClick={this.submitEdit} bsStyle="primary">Save</Button>
                    </Modal.Footer>
                </Modal>
            );
        }

        return(
            <div style={{margin: 'auto', float: 'none', width: 1500}}>
                <h2>Project Proposals</h2>
                <Form>
                <Table bordered={true}>
                    <thead>
                        <tr>
                            <th style={{width: '17%'}}>Select</th>
                            <th style={{width: '20%'}}>Project Name</th>
                            <th style={{width: '10%', textAlign: 'center'}}>Project Status</th>
                            <th style={{width: '10%', textAlign: 'center'}}>Technologies</th>
                            <th style={{width: '6%', textAlign: 'center'}}>Min Size</th>
                            <th style={{width: '6%', textAlign: 'center'}}>Max Size</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project: Project) =>
                            <tr key={project.projectId}>
                                <td>               
                                    <Button style={{marginRight: '5px'}} type="submit" bsStyle="success" onClick={() => this.submitClicked(project.projectId, 2)}>Approve</Button>
                                    <Button style={{marginRight: '5px'}} type="submit" bsStyle="danger" onClick={() => this.submitClicked(project.projectId, 3)}>Reject</Button>
                                    <Button bsStyle="warning" onClick={() => this.editProject(project.projectId, project)}>Changes</Button>

                                </td>
                                <td>{project.projectName}</td>
                                <td style={{width: '10%', textAlign: 'center'}}>{this.getStatus(project.statusId)}</td>
                                <td style={{width: '6%', textAlign: 'center'}}>{project.technologies}</td>
                                <td style={{width: '6%', textAlign: 'center'}}>{project.minSize}</td>
                                <td style={{width: '6%', textAlign: 'center'}}>{project.maxSize}</td>
                                <td>{project.description}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                </Form>
                {ModalEditProject}
            </div>);
    }
}

export default ProjectProposalApprovalForm;
