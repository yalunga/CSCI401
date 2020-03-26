import React, { useRef } from 'react'
import { useDrop, DropTargetMonitor } from 'react-dnd'

import { Box, Text } from 'grommet';

interface CardProps {
  children: any;
  moveCard: Function;
  switchRanks: Function;
  index: number
}

interface DragItem {
  index: number
  id: string
  type: string
  isRanked: boolean
}
const Card: React.FC<CardProps> = ({ moveCard, children, index, switchRanks }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [, drop] = useDrop({
    accept: 'card',
    drop(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index


      // Time to actually perform the action
      !item.isRanked ? moveCard(dragIndex, hoverIndex) : switchRanks(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })
  drop(ref)
  return (
    <Box
      ref={ref}
      style={{ cursor: 'pointer' }}
      pad='small'
      gap='small'
      direction='row'
      align='center'
      border='all'
      round='xsmall'
    >
      <Box>
        <Text weight='bold'>{index + 1}.</Text>
      </Box>
      <Box width='full'>
        {children}
      </Box>
    </Box>
  )
}

export default Card
