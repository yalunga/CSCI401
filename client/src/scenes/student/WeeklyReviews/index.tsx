import * as React from 'react';
import {
    Box,
    Text,
    TextInput,
    Layer,
    DataTable,
    Heading,
    Select
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
    isLoading: boolean;
  }
 // Status form due dates need to be pulled from the database
  const ALL_DATES = ['Feb 9, 2020', 'Feb 16, 2020', 'Feb 23, 2020'];


  export default class WeeklyReviews extends React.Component<TaskListProps, TaskListState> {
      constructor(props: TaskListProps) {
          super(props);
          this.state = {
            date: "",
            allDates: ALL_DATES,
            thisWeekTaskList: [{index: Math.random(), hours: "", description: ""}], 
            nextWeekTaskList: [{index: Math.random(), hours: "", description: ""}],
            isLoading: false
          };
          this.addNewTaskThisWeek = this.addNewTaskThisWeek.bind(this);
          this.deteteTaskThisWeek = this.deteteTaskThisWeek.bind(this);
          this.addNewTaskNextWeek = this.addNewTaskNextWeek.bind(this);
          this.deteteTaskNextWeek = this.deteteTaskNextWeek.bind(this);
        //   this.editTask = this.editUser.bind(this);
        //   this.deleteTask = this.deleteUser.bind(this);
        
      } 

      // handleChangeThisWeek = (e: Task) => {
      //     let taskList = [...this.state.thisWeekTaskList]
      //     taskList[e.index][e.target.name] = e.target.value;
      // } 
      // }=

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

    //   editTask(task: Task) {
        
    //   }

      
    //   componentDidMount() {

    //   }

    // editTask(task: Task) {

    // }

    // deleteTask(task: Task) {

    // }
    
    // handleChange(e: any) {

    // }

    // submitTasks = () => {

    // }
    render() {
        const {date, allDates, thisWeekTaskList, nextWeekTaskList} = this.state;
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
                <ThisWeekTaskList add={this.addNewTaskThisWeek} delete={this.deteteTaskThisWeek} taskList={thisWeekTaskList}/>
                <Text size='large'>What are you planning to accomplish next week?</Text>
                <NextWeekTaskList add={this.addNewTaskNextWeek} delete={this.deteteTaskNextWeek} taskList={nextWeekTaskList}/>
                <Box background='brand' width='small' pad='xsmall' align='center' round='xxsmall'>
                  <Text>Submit</Text>
                </Box>
            </Box>

        )
    }


      
  }