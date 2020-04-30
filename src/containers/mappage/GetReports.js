import React, {useState, useEffect } from 'react'

import {getReportsTotal, getReportDates, validateReport, getReportsByDateRange, getDistrictsWithReports, getMapData} from './DataParser';

export default function GetReports() {
  
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetch(`https://api.floswhistle.com/v1/reports`,
    {
      method: "GET"
    }
  ).then(res => res.json())
    .then(response =>{
      setReportData(response);
    })
    .catch(error => console.log(error));
  },[]);

  if(reportData === null){
    return(
      <p>loading</p>
    )
  }else{
    return(
      <div>
        <p>{`Report Total = ${getReportsTotal(reportData)}`}</p>
        <p>{`Report Dates = ${getReportDates(reportData)}`}</p>
        {/* {getDistrictsWithReports(reportData)} */}
        {getMapData(reportData, new Date('03/01/2020'), new Date('04/01/2020'))}
      </div>
    )
  }
}
