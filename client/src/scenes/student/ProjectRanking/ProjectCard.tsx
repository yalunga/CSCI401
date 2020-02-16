import React, { useRef } from 'react'
import { useDrag } from 'react-dnd'
import { Box, Stack, Layer, Text } from 'grommet';
import { View } from 'grommet-icons';

interface CardProps {
  isDragging?: boolean;
  isRanked: boolean;
  index: number;
  id: any;
  name: string;
  minSize: any;
  maxSize: any;
  technologies: any
  background: any;
  description: any;
  stakeholderCompany: string;
  moveCard: Function;
}

const Card: React.FC<CardProps> = ({
  id, name, index, isRanked, stakeholderCompany, minSize, maxSize, background, description, technologies
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [show, setShow] = React.useState();

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'card', id, index, isRanked },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(ref)
  return (
    <Box>
      <Stack anchor='right'>
        <Box ref={ref} style={{ opacity, cursor: 'pointer' }} elevation='small' pad='small' round='xsmall' background='white'>
          {name}
        </Box>
        <Box align='center' pad='small'>
          <View style={{ cursor: 'pointer', opacity }} onClick={() => setShow(true)} />
        </Box>
      </Stack>
      {show &&
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
          position='left'
          full='vertical'
        >
          <Box pad='medium' width='large' gap='medium' overflow={{ vertical: 'scroll' }}>
            <Box>
              <Text weight='bold' size='large'>{name}</Text>
              <Text size='small'>{stakeholderCompany}</Text>
            </Box>
            <Box direction='row' gap='small'>
              <Box>
                <Text size='small' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>Min Size</Text>
                <Text>{minSize}</Text>
              </Box>
              <Box>
                <Text size='small' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>Max Size</Text>
                <Text>{maxSize}</Text>
              </Box>
            </Box>
            <Box>
              <Text size='small' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>Background Requested</Text>
              <Text>{background}</Text>
            </Box>
            <Box>
              <Text size='small' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>Technologies</Text>
              <Text>{technologies}</Text>
            </Box>
            <Box>
              <Text size='small' color='dark-5' style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>Description</Text>
              <Text style={{ whiteSpace: 'pre-line' }}>{description}</Text>
            </Box>
          </Box>
        </Layer>
      }
    </Box>
  )
}

export default Card
