import React from 'react';
import { Box, Stack, Layer, Text } from 'grommet';

interface CardProps {
  name: string;
  minSize: any;
  maxSize: any;
  technologies: any
  background: any;
  description: any;
  stakeholderCompany: string;
  setShow: Function;
}

const ProjectDescriptionLayer: React.FC<CardProps> = ({
  name, stakeholderCompany, minSize, maxSize, background, description, technologies, setShow
}) => {
  return (
    <Layer
      onEsc={() => setShow(false)}
      onClickOutside={() => setShow(false)
      }
      position='left'
      full='vertical'
    >
      <Box pad='medium' width='large' gap='medium' overflow={{ vertical: 'scroll' }}>
        <Box>
          <Text weight='bold' size='large'>{name}</Text>
          <Text size='small'>{stakeholderCompany}</Text>
        </Box>
        < Box direction='row' gap='small' >
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
  )
}

export default ProjectDescriptionLayer;
