import React, {useEffect, useState, useRef} from 'react';
import './busboard';
import {busInfo, getBusPredictions} from "./busboard";
import './sitewide.css';
import Navbar from './navbar';

import searchIcon from './searchIcon.png';

async function getBuses(postcode: string): Promise<busInfo[][]> {
  return await getBusPredictions(postcode); // May throw an error for an invalid postcode - handle on form submission
}

function App(): React.ReactElement {
  const postcodeReference = useRef("");
  const [postcode, setPostcode] = useState<string>("");
  useEffect(() => {
    postcodeReference.current = postcode;
  }, [postcode]);
  const [tableData, setTableData] = useState<busInfo[][]>([]);
  useEffect(() => {
    populateBusTimetable();
    const loadingSpinnerElement = document.getElementById("loadingSpinner");
    if (loadingSpinnerElement !== null) {
      loadingSpinnerElement.classList.add("hidden");
    }
    }, [tableData])
  let refreshInterval: undefined | NodeJS.Timeout;

  function hideElementById(elementId: string) {
    const element = document.getElementById(elementId);
    if (element !== null)
      element.classList.add("hidden");
  }

  function showElementById(elementId: string) {
    const element = document.getElementById(elementId);
    if (element !== null)
      element.classList.remove("hidden");
  }

  async function updateBusTimetableInformation() {
    // Current postcode reference ensures that the postcode state checked here is up to date
    // postcode will contain the state when the timeout is first invoked
    if (postcode !== postcodeReference.current)
      return;
    hideElementById("invalidPostcodeErrorMessage");
    showElementById("loadingSpinner");
    clearTimeout(refreshInterval);
    try {
      const busInfoArray = await getBuses(postcode);
      setTableData(busInfoArray);
      refreshInterval = setTimeout(updateBusTimetableInformation, 30000);
    } catch (e) {
      showElementById("invalidPostcodeErrorMessage");
      setTableData([]);
    }
  }

  async function formHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault(); // to stop the form refreshing the page when it submits
    clearTimeout(refreshInterval);
    updateBusTimetableInformation();
  }

  function createTD(arrivalInfo: busInfo): HTMLTableRowElement {
    let tableEntry = document.createElement('tr');
    tableEntry.innerHTML = "<td>" + arrivalInfo.lineName + "</td><td>" +
        arrivalInfo.destination + "</td><td>" + Math.ceil(arrivalInfo.timeToArrival/60) + " mins </td>";
    return tableEntry;
  }
  function populateBusTimetable() {
    let tableContainer = document.getElementById("tableContainer");
    if (tableContainer === null) {
      console.log("Null table container");
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
    setPostcode(data.target.value);
  }

  return <>
    <Navbar/>
    <div className="container-fluid centred">
      <h1> 🚌 BusBoard 🚌 </h1>
      <form action="" onSubmit={formHandler}>
        <div className="search-bar centred">
          <input type="text" id="postcodeInput" onChange={updatePostcode}/>
          <input type="image" alt="Submit" src={searchIcon}/>
        </div>
      </form>
      <div className="error-container hidden" id="invalidPostcodeErrorMessage"><p className="centred">Invalid Postcode
        entered</p></div>
      <div id="loadingSpinner" className="spinner centred hidden"></div>
      <div id="tableContainer"></div>
    </div>
  </>;
}

export default App;