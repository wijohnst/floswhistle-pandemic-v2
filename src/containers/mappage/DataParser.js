import moment from 'moment'

/*Function that returns the total number of reports all time*/

export const getReportsTotal = data => {

  console.log('Getting total number of reports...')

  return data.length;
}

/*Function that returns an array of all dates that have a report */

export const getReportDates = data =>{ 

  console.log('Getting report dates...')

  let reportDates = data.map( (report) =>{
  return moment(report.reported_date).format('MM/DD/YY');
  })

  return [...new Set(reportDates)];
}

/*Function that returns the number of reports for each date */

export const getReportsByDate = data => {

  console.log('Getting reports by date...');

  const frequency = data.map(({reported_date})=> reported_date)
                        .reduce((newObj, reported_date) =>{
                                const count = newObj.reported_date || 0;
                                newObj[reported_date] = count + 1;
                                return newObj;
  },{});

  
  const result = Object.entries(frequency).map(([key,val]) =>{
    return { reportedDate:key, numberOfReports: val};
  });

  return result
} 

/*Function that returns the number of report per district */

export const getNumberOfReportsPerDistrict = data =>{

  console.log('Getting reports by district...');

  const x = data.map(({facility})=> facility)
                .reduce((newObj, facility) =>{
                  const {district, district_state} = facility; 
                  const stateDistrictString = `${district_state}-${formatDistrictNumber(district)}`
                  const count = newObj.facility || 0; //short circuit evaluation
                  newObj[stateDistrictString] = count + 1; //computed property
                  return newObj;
                },{});

  console.log(x);
}

/* Function to format district numbers based on how district ID's are formatted on districts_map.svg */

export const formatDistrictNumber = districtNumber =>{
  
  console.log('Formatting district number...');

  let length = Math.log(districtNumber) * Math.LOG10E + 1 | 0;  

  if(length < 2){
    
    let districtNumberString = districtNumber.toString();

    return `0${districtNumberString}`;
  }else{

    let districtNumberString = districtNumber.toString();
    
    return districtNumberString; 

  }
}

/*Function to evaluate an individual test based on the desired map (Testing vs. Shortages) - used to calculate the failure rate of each district*/

export const validateReport = (targetMap , report, failCondition) =>{  
  
  console.log(`Validating report for ${targetMap}`)
  
  var targetProperties = targetMap === 'shortages' ? 'shortages' : 'test_data';

  const toTest = report[targetProperties];

  let testValues = Object.values(toTest);

 if(testValues.includes(failCondition)){
  console.log('Test failed.')
  return 'failed'
 }else{
  console.log('Test passed.') 
  return 'passed'
 }
}

/*Function to return an array of reports between two dates*/

export const getReportsByDateRange = (data, rangeStart, rangeEnd) =>{


  const reportsByDateRange = data.map((report) => report)
                                  .reduce((newObj, report) =>{
                                    const {reported_date} = report;
                                    if(moment(reported_date).isBetween(rangeStart, rangeEnd)){
                                      newObj[reported_date] = report;
                                    }
                                    return newObj; 
                                  },{});  
  
  return reportsByDateRange;

}

/*Function to return an array of formatted district ID's that have a report*/

export const getDistrictsWithReports = data =>{
 
  let districts = data.map( report =>report) 
                          .reduce((newObj, report) =>{
                            const {facility: {district_state, district}} = report;
                            const formattedDistrictNum = formatDistrictNumber(district);
                            const districtString = `${district_state}-${formattedDistrictNum}`;
                            newObj[districtString] = {districtId : districtString, reports : report, }
                            return newObj;
                          },{})
                  
  let result = Object.entries(districts).map(([key,val]) =>{
    return {district: val}
  })

  return result;
}

/*Function that returns an data needed to populate map component */

export const getMapData = (data,rangeStart, rangeEnd) =>{

  console.log('Getting rates...')
  const reports = getReportsByDateRange(data,rangeStart,rangeEnd);

  const reportsArr = Object.entries(reports).map(([key,val]) =>{
    return val;
  })

  const districtsWithReports = getDistrictsWithReports(reportsArr);

  const districtReports = districtsWithReports.map(district => district);

  const result = districtReports.map(report => report)
                                  .reduce((newObj, report, index) =>{
                                      const district = report.district;
                                      const reports = new Array(report.district.reports);
                                      const validationArr = reports.map(report => validateReport('testing',report,true));
                                      const denominator = validationArr.length;
                                      // const numerator = calcNumerator(validationArr);
                                      const numerator = validationArr.reduce((acc,cur) => {
                                        if(cur === 'failed'){
                                          return acc + 1
                                        }else{
                                          return acc
                                        }
                                        },0);
                                      const rate = (numerator/denominator)*100; 
                                      newObj[index] = {district, rate};
                                      return newObj;
                                  },{})

  console.log(result);
}