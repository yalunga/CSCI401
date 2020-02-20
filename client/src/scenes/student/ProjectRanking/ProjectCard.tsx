import React, { useRef } from 'react'
import { useDrag } from 'react-dnd'
import { Box, Stack, Layer, Text } from 'grommet';
import { View } from 'grommet-icons';

import ProjectDescriptionLayer from '../../../components/ProjectDescriptionLayer';

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
        <ProjectDescriptionLayer
          name={name}
          stakeholderCompany={stakeholderCompany}
          minSize={minSize}
          maxSize={maxSize}
          background={background}
          description={description}
          technologies={technologies}
          setShow={setShow}
        />
      }
    </Box>
  )
}

export default Card
