import * as React from 'react';
import update from 'immutability-helper';
import { Box, Text, RangeInput } from 'grommet';
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import ProjectCard from './ProjectCard';
import RankingBox from './RankingBox';

interface Props {
  connectDropTarget?: any;
}

interface State {
  isLoading: boolean;
  projectCards: Project[];
  rankings: Project[];
  submitted: boolean;
  email: string;
}

interface Project {
  projectId: number;
  projectName: string;
  statusId: number;
  minSize: number;
  maxSize: number;
  technologies: string;
  background: string;
  description: string;
  stakeholderCompany: string;
}


export default class ProjectRankingPage extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.submitClicked = this.submitClicked.bind(this);
    this.switchRanks = this.switchRanks.bind(this);
    this.state = {
      isLoading: false,
      projectCards: [],
      rankings: Array.from(Array(5)),
      submitted: false,
      email: ''
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const acceptedProjects = [];
    const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/getprojectsfromsemester/` + sessionStorage.getItem('viewingYear') + '/' + sessionStorage.getItem('viewingFallSpring'));
    const projects = await response.json();
    for (const project of projects) {
      if (project.statusId === 2) {
        acceptedProjects.push(project);
      }
    }
    const rankingsResponse = await fetch(`${process.env.REACT_APP_API_URL}/projects/${sessionStorage.getItem('email')}/rankings`);
    const rankings = await rankingsResponse.json();
    const rankedProjects = Array.from(Array(5));
    for (const ranking of rankings) {
      for (const project of acceptedProjects) {
        if (project.projectId === ranking.projectId) {
          rankedProjects[ranking.rank - 1] = project;
          acceptedProjects.splice(acceptedProjects.indexOf(project), 1);
        }
      }
    }
    this.setState({ projectCards: acceptedProjects, isLoading: false, rankings: rankedProjects });
  }

  rankingsIsFull() {
    for (let i = 0; i < this.state.rankings.length; i++) {
      if (!this.state.rankings[i]) {
        return false;
      }
    }
    return true;
  }

  submitClicked() {
    if (!this.rankingsIsFull()) {
      alert('You must rank 5 projects.');
      return;
    }
    fetch(`${process.env.REACT_APP_API_URL}/projects/` + sessionStorage.getItem('email') + '/submit-ranking', {
      method: 'POST',
      body: JSON.stringify(this.state.rankings.map((rank, index) => ({
        projectId: rank.projectId,
        ranking: index
      }))) as any,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    alert('project rankings have been saved!');
  }

  moveCard(index: number, rankingIndex: number) {
    const { projectCards, rankings } = this.state;
    const projectCard = projectCards[index];
    // if there is a card already in the ranking move it back to the list
    if (rankings[rankingIndex]) {
      projectCards.push(rankings[rankingIndex]);
    }
    rankings[rankingIndex] = projectCard;
    projectCards.splice(projectCards.indexOf(projectCard), 1);
    this.setState({ projectCards, rankings });
  }

  switchRanks(index: number, newIndex: number) {
    const { rankings } = this.state;
    const temp = rankings[newIndex];
    rankings[newIndex] = rankings[index];
    rankings[index] = temp;
    this.setState({ rankings });
  }


  render() {
    const { projectCards, rankings, submitted } = this.state;
    return (
      <Box width='full' pad='small'>
        <Text size='large' weight='bold'>Project Ranking</Text>
        <Box width='full' align='center' justify='center'>
          <DndProvider backend={Backend}>
            <Box width='large' elevation='xsmall' pad='small' round='xsmall' gap='small'>
              <Text size='small'>Drag to reorder projects by priority. Your first 5 preferences will be considered. Click "Submit Rankings" when finished. Rankings can only be submitted once.</Text>
              <Box direction='row' width='full' gap='medium' pad='xsmall'>
                <Box basis='1/2' gap='small' height={{ max: 'large' }} overflow='scroll' border={{ side: 'right' }} pad='small'>
                  {projectCards.map((projectCard: Project, index: number) => {
                    return (
                      <ProjectCard
                        key={projectCard.projectId}
                        index={index}
                        isRanked={false}
                        id={projectCard.projectId}
                        name={projectCard.projectName}
                        minSize={projectCard.minSize}
                        maxSize={projectCard.maxSize}
                        technologies={projectCard.technologies}
                        background={projectCard.background}
                        description={projectCard.description}
                        moveCard={this.moveCard}
                        stakeholderCompany={projectCard.stakeholderCompany}
                      />
                    )
                  })}
                </Box>
                <Box basis='1/2' gap='small' pad='small'>
                  {rankings.map((projectCard: Project, index: number) => {
                    return (
                      <RankingBox index={index} moveCard={this.moveCard} switchRanks={this.switchRanks}>
                        {projectCard &&
                          <ProjectCard
                            key={projectCard.projectId}
                            index={index}
                            isRanked={true}
                            id={projectCard.projectId}
                            name={projectCard.projectName}
                            minSize={projectCard.minSize}
                            maxSize={projectCard.maxSize}
                            technologies={projectCard.technologies}
                            background={projectCard.background}
                            description={projectCard.description}
                            moveCard={this.moveCard}
                            stakeholderCompany={projectCard.stakeholderCompany}
                          />}
                      </RankingBox>
                    )
                  })}
                </Box>
              </Box>
              <Box
                alignSelf='end'
                pad='small'
                background='brand'
                elevation='small'
                round='xsmall'
                width='small'
                style={{ cursor: 'pointer' }}
                onClick={this.submitClicked}
              >
                <Text textAlign='center'>Submit Rankings</Text>
              </Box>
            </Box>
          </DndProvider>
        </Box>
      </Box>
    );
  }
};