import * as React from 'react';
import { Box, Text, TextArea, TextInput, Grid, Select, Table, TableHeader, TableCell, TableRow, TableBody } from 'grommet';

const NextWeekTaskList = (props: any) => {
    return (
        <Box pad='medium' background='white' elevation='xsmall' gap='small' round='xxsmall' margin={{ top: 'small' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell scope="col" border="bottom">
                  # Hours
                </TableCell>
                <TableCell scope="col" border="bottom">
                  Description
                </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>{
            props.taskList.map((val: any, idx: number) => {
              let hours = `hours-${idx}`, description = `description-${idx}`;
              return (
                <TableRow key={val.index}>
                <TableCell size="xsmall" scope="row">
                  <TextInput name="hours" data-id={idx} id={hours}></TextInput>
                </TableCell>
                <TableCell scope="row">
                <Box border='all' round='xxsmall'>
                    <TextArea 
                    data-id={idx}
                    id={description}
                    name='description'
                    resize={false}
                    size='large'
                    plain
                    placeholder='Enter description'
                    />
                  </Box>
                </TableCell>
                <TableCell size="xsmall"  scope="row">
                  {
                    (idx===0) ? <Box onClick={()=>props.add()}width='xsmall' elevation='xsmall' background='#FFCB02' pad='xsmall' align='center' round='xxsmall' className='pointer'>
                    <Text>Add</Text>
                  </Box>:<Box onClick={()=>props.delete(val)} width='xsmall' elevation='xsmall' background='#FF4040' pad='xsmall' align='center' round='xxsmall' className='pointer'>
                    <Text>Delete</Text>
                  </Box>
                  }

                </TableCell>
              </TableRow>
              )
            })
          }
          </TableBody>
        </Table>
      </Box>
      // })
      
    )
  }

export default NextWeekTaskList;

  






