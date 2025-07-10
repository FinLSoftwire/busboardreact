import React, {useState} from 'react';
import './busboard';
import {busInfo, getBusPredictions} from "./busboard";
import './sitewide.css';

async function getBuses(postcode: string): Promise<busInfo[][]> {
  return await getBusPredictions(postcode); // May throw an error for an invalid postcode - handle on form submission
}

function App(): React.ReactElement {
  const [postcode, setPostcode] = useState<string>("");
  const [tableData, setTableData] = useState<busInfo[][]>([]);

  async function formHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault(); // to stop the form refreshing the page when it submits
    const errorMessageContainer = document.getElementById("invalidPostcodeErrorMessage");
    try {
      const busInfoArray = await getBuses(postcode);
      setTableData(busInfoArray);
      if (!errorMessageContainer?.classList.contains("hidden")) {
        errorMessageContainer?.classList.add("hidden");
      }
    } catch (e) {
      if (errorMessageContainer?.classList.contains("hidden")) {
        errorMessageContainer?.classList.remove("hidden");
      }
      setTableData([]);
    }
  }

  function createTD(arrivalInfo: busInfo): HTMLTableRowElement {
    let tableEntry = document.createElement('tr');
    tableEntry.innerHTML = "<td>" + arrivalInfo.lineName + "</td><td>" +
        arrivalInfo.destination + "</td><td>" + Math.ceil(arrivalInfo.timeToArrival/60) + " mins </td>";
    return tableEntry;
  }
  function populateBusTimetable() {
    console.log(tableData);
    let tableContainer = document.getElementById("tableContainer");
    if (tableContainer === null) {
      return;
    }
    tableContainer.innerHTML = "";
    tableData.forEach((busStopArrivalInfo)=>{
      const timetable = document.createElement('table');
      timetable.className = "centred";
      tableContainer?.appendChild(timetable);
      timetable.innerHTML = "";
      const timeTableHeader = document.createElement('thead');
      timeTableHeader.innerHTML = "<tr><th colspan='3'>" + busStopArrivalInfo[0].stationName + "</th></tr>" +
          "<tr class='column-title'><td>Bus Number</td><td>Destination</td><td>Expected</td></tr>";
      timetable?.appendChild(timeTableHeader);
      const timeTableBody = document.createElement('tbody');
      timetable?.appendChild(timeTableBody);
      busStopArrivalInfo.forEach((arrivalInfo) => {
        timeTableBody?.appendChild(createTD(arrivalInfo));
      });
    });
  }

  function updatePostcode(data: React.ChangeEvent<HTMLInputElement>): void {
    setPostcode(data.target.value)
  }

  return <>
    <div className="container-fluid centred">
    <h1> 🚌 BusBoard 🚌 </h1>
    <form action="" onSubmit={formHandler}>
      <label htmlFor="postcodeInput"> Postcode: </label>
      <input type="text" id="postcodeInput" onChange={updatePostcode}/>
      <input type="submit" value="Submit"/>
    </form>
      <div className="error-container hidden" id="invalidPostcodeErrorMessage"><p className="centred">Invalid Postcode entered</p></div>
    <div id="tableContainer"></div>
    </div>
    {populateBusTimetable()}
  </>;
}

export default App;