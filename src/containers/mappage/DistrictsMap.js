import React, {useState} from 'react'
import styled from 'styled-components'
import DistrictsMap from './districts_map.svg'
import {SvgLoader, SvgProxy} from 'react-svgmt'
import ReactToolTip from 'react-tooltip'

const MapWrapper = styled.div`
overflow: scroll;
`

export default function DistrictsMaps(props) {
  
  const [mapData,] = useState(props.mapData);
 
  const getDistrictInfo = (districtId) =>{ //Filters the API data by congressional district ID the populates pop-up window with information
    
    const targetDistrictInfo = mapData.filter(match => match.district.districtId === districtId);

    return( //HTML for pop-up
      `<html>
        <style>
          .tooltipInfoWrapper{
            background-color: white;
            color: black;
            padding: 5px;
            border-radius: 5px 5px 5px 5px;
          }
          h2{
            text-align: center;
          }

        </style>
        <div class='tooltipInfoWrapper'>
        <h2><u>District Info</u></h2>
        <p><b>District Name: </b>${targetDistrictInfo[0].district.districtId}</p> 
        <p><b>Rate: </b>${targetDistrictInfo[0].rate}%</p>
        </div>
      </html>`
      );

  }

  const genColor = (percentage) =>{ 
    
    if(percentage <= 0 ){
      return 'green'
    }else if(percentage > 0 && percentage <= 10){
      return '#FFE6E6'
    }else if(percentage > 10 && percentage <= 20){
      return '#FCCDCD'
    }else if(percentage > 20 && percentage <= 30){
      return '#FDBBBB'
    }else if(percentage > 30 && percentage <= 40){
      return '#FFAAAA'
    }else if(percentage > 40 && percentage <= 50){
      return '#FD9797'
    }else if(percentage > 50 && percentage <= 60){
      return '#FA7878'
    }else if(percentage > 60 && percentage <= 80){ //Remember to refactor with additional color for values 60 - 70
      return '#FC5959'
    }else if(percentage > 80 && percentage <= 90){
      return '#F72f2f'
    }else if(percentage > 90 && percentage <= 100){
      return '#E61212'
    }
    else{
      return '#cccccc'
    }
  }

  if(mapData !== undefined){
  return (
    <MapWrapper>
      <SvgLoader path={DistrictsMap}>
        {mapData.map((report) => (
            <React.Fragment key={`districtWrapper${report.district.districtId}`}>
              <ReactToolTip html={true} />
              <SvgProxy key={`#${report.district.districtId}`} selector={`#${report.district.districtId}`} fill={genColor(report.rate)} data-tip={getDistrictInfo(report.district.districtId)} />
            </React.Fragment>
        ))}
      </SvgLoader>
    </MapWrapper>
  )
}
else{
  return(
    <p>Loading</p>
  )
}
}
