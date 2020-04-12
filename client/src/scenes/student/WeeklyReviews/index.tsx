import * as React from 'react';
import {
    Box,
    Text,
    Select,
    CheckBox
  } from 'grommet';
  import ThisWeekTaskList from './ThisWeekTaskList';
  import NextWeekTaskList from './NextWeekTaskList';

  interface TaskListProps {}

  interface Task {
      index: number;
      hours: string; 
      description: string; 
  }

  interface TaskListState {
    date: string;
    allDates: Array<{}>;
    thisWeekTaskList: Array<Task>;
    nextWeekTaskList: Array<Task>;
    confirmSubmission: boolean;
    isLoading: boolean;
  }
 // Status form due dates need to be pulled from the database
  const ALL_DATES = ['Feb 9, 2020', 'Feb 16, 2020', 'Feb 23, 2020'];


  export default class WeeklyReviews extends React.Component<TaskListProps, TaskListState> {
      constructor(props: TaskListProps) {
          super(props);
          this.state = {
            date: "",
            allDates: ALL_DATES, // need to pull from database
            thisWeekTaskList: [{index: Math.random(), hours: "", description: ""}], 
            nextWeekTaskList: [{index: Math.random(), hours: "", description: ""}],
            confirmSubmission: false, 
            isLoading: false
          };
          this.addNewTaskThisWeek = this.addNewTaskThisWeek.bind(this);
          this.deteteTaskThisWeek = this.deteteTaskThisWeek.bind(this);
          this.addNewTaskNextWeek = this.addNewTaskNextWeek.bind(this);
          this.deteteTaskNextWeek = this.deteteTaskNextWeek.bind(this);
          this.handleChangeThisWeekTasks = this.handleChangeThisWeekTasks.bind(this);
          this.handleChangeNextWeekTasks = this.handleChangeNextWeekTasks.bind(this);
          this.handleCheck = this.handleCheck.bind(this);
          this.submitTasks = this.submitTasks.bind(this);
      }
      addNewTaskThisWeek(e: any){
        this.setState((prevState) => ({
          thisWeekTaskList: [...prevState.thisWeekTaskList, { index: Math.random(), hours: "", description: ""}],
        }));
      }

      deteteTaskThisWeek = (task : Task) => {
        this.setState({
          thisWeekTaskList: this.state.thisWeekTaskList.filter(t => t !== task)
        });
      }
      addNewTaskNextWeek(e: any){
        this.setState((prevState) => ({
          nextWeekTaskList: [...prevState.nextWeekTaskList, { index: Math.random(), hours: "", description: ""}],
        }));
      }

      deteteTaskNextWeek = (task : Task) => {
        this.setState({
          nextWeekTaskList: this.state.nextWeekTaskList.filter(t => t !== task)
        });
      }

      handleChangeThisWeekTasks = (e : any) => {
        if (["hours", "description"].includes(e.target.name)) {
            let tWTaskList = [...this.state.thisWeekTaskList]
            e.target.name == "hours" ? tWTaskList[e.target.id].hours = e.target.value : tWTaskList[e.target.id].description = e.target.value;
        }
      }

      handleChangeNextWeekTasks = (e : any) => {
        if (["hours", "description"].includes(e.target.name)) {
            let nWTaskList = [...this.state.nextWeekTaskList]
            e.target.name == "hours" ? nWTaskList[e.target.id].hours = e.target.value : nWTaskList[e.target.id].description = e.target.value;
        }
      }

      handleCheck = (e : any) => {
        this.setState({
          confirmSubmission: e.target.checked
        });
      }

      async submitTasks() {
        var request = new XMLHttpRequest();
        request.withCredentials = true;
        request.open('POST', `${process.env.REACT_APP_API_URL}/assignment/weeklyReportForm`);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        var data = JSON.stringify({
            dueDate: this.state.date,
            email: sessionStorage.getItem('email'),
            thisWeekTaskList: JSON.stringify(this.state.thisWeekTaskList),
            nextWeekTaskList: JSON.stringify(this.state.nextWeekTaskList),
        });
        console.log(JSON.stringify(this.state.thisWeekTaskList));
        try {
          const response = await fetch( `${process.env.REACT_APP_API_URL}/assignment/weeklyReportForm`, {
            method: 'POST',
            body: data,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const responseText = await response.text();
          alert('Tasks were sent.');
          this.setState({thisWeekTaskList: [{index: Math.random(), hours: "", description: ""}],
          nextWeekTaskList: [{index: Math.random(), hours: "", description: ""}]});
        } catch (error) {
          console.log(error);
          alert('There was an error sending tasks.')
        }
    
      }

  render() {
        const {date, allDates, confirmSubmission, thisWeekTaskList, nextWeekTaskList} = this.state;
        return (
            <Box width='full' pad='medium' gap='medium'>
                <Text weight='bold' size='large'>Weekly Status Form</Text>
                <Box pad='small' background='white' elevation='xsmall' round='xxsmall' gap="small" margin={{ top: 'small' }}>
                    <Text size='small' weight='bold'>Status Report Date</Text>
                    <Select
                        alignSelf="start"
                        options={allDates}
                        value={date}
                        onChange={event => this.setState({
                            date: event.value,
                            allDates: ALL_DATES,
                        })}
                    />
                </Box>
                <Text size='large'>What did you accomplish this week?</Text>
                <ThisWeekTaskList add={this.addNewTaskThisWeek} delete={this.deteteTaskThisWeek} taskList={thisWeekTaskList} onChange={this.handleChangeThisWeekTasks}/>
                <Text size='large'>What are you planning to accomplish next week?</Text>
                <NextWeekTaskList add={this.addNewTaskNextWeek} delete={this.deteteTaskNextWeek} taskList={nextWeekTaskList} onChange={this.handleChangeNextWeekTasks}/>
                <CheckBox checked={confirmSubmission} label="I confirm based on the rules of academic integrity that I am the student who filled out the form above." onChange={this.handleCheck}></CheckBox>
                {confirmSubmission ? <Box background='brand' width='small' pad='xsmall' align='center' round='xxsmall' onClick={this.submitTasks}>
                  <Text>Submit</Text>
                </Box> : null}
            </Box> 

        )
    }


      
  }