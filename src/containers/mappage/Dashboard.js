import React, { useState } from 'react'
import styled from 'styled-components'

import DistrictsMap from './DistrictsMap'
import MapHeading from './MapHeading'
import Tally from './Tally'

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
  
  const {reportRequest, handleBack, data} = props; //Will also include data from API request @MapSelect.js

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
        <MapHeading headingText={headingText[reportRequest - 1]}/>
      </HeadingWrapper>
      <Tally numberOfReports={data[0].numberOfReports} reportsByDate={data[1].reportsByDate}/>
      <MapWrapper>
        <DistrictsMap mapData={getMapData(data, new Date('03/01/2020'), new Date('04/01/2020'))} />{/* Pass map data to DistrictMap component */}
      </MapWrapper>
    </DashBoardWrapper>
    <BackButtonWrapper>
      <button onClick={handleBack}>Back</button>
    </BackButtonWrapper>
    </React.Fragment>
  )
}