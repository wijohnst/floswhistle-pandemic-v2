import React from 'react'
import styled from 'styled-components'

import DistrictsMap from './DistrictsMap'
import MapHeading from './MapHeading'


import { getMapData } from './DataParser'

const DashBoardWrapper = styled.div`
display: flex;
flex-direction: column;
padding: 15px;
`
const HeadingWrapper = styled.div``

const MapWrapper = styled.div``

const BackButtonWrapper = styled.div`
text-align: center;
`
export default function Dashboard(props) {
  
  const {reportSelection, handleBack, reportData} = props; //Will also include data from API request @MapSelect.js
  
  console.log(`reportSelection @ dashboard = ${reportSelection}`);
  
  const headingText = [{
                        heading: 'Shortages', 
                        sub: 'Percentage of respondents who reported any kind of shortage.'
                      },
                      {
                        heading: 'Testing',
                        sub: 'Percentage of respondents who reported access to testing.'
                      }
                    ]


  return (
    <React.Fragment>
    <DashBoardWrapper>
      <HeadingWrapper>
        <MapHeading headingText={headingText[reportSelection - 1]}/>
      </HeadingWrapper>
      <MapWrapper>
        <DistrictsMap mapData={getMapData(reportData, reportSelection, new Date('03/01/2020'), new Date('05/01/2020'))} />
      </MapWrapper>
    </DashBoardWrapper>
    <BackButtonWrapper>
      <button onClick={handleBack}>Back</button>
    </BackButtonWrapper>
    </React.Fragment>
  )
}