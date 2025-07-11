import React, {useEffect, useState, useRef} from 'react';
import './busboard';
import './sitewide.css';
import Navbar from './navbar';
import {getDisruptionsByID} from './busboard'
import searchIcon from "./searchIcon.png";
import {busInfo} from "./busboard";

function Disruptions(): React.ReactElement {
    const postcodeReference = useRef("");
    const [postcode, setPostcode] = useState<string>("");
    useEffect(() => { postcodeReference.current = postcode; }, [postcode]);
    const [tableData, setTableData] = useState<busInfo[][]>([]);


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

    async function handlePostcodeInput(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault(); // to stop the form refreshing the page when it submits
        showElementById("loadingSpinner");
    }

    function updatePostcode(data: React.ChangeEvent<HTMLInputElement>): void {
        setPostcode(data.target.value);
    }

    return <>
        <Navbar/>
        <div id="mainTitle" className="centred">
            <h1> Disruptions </h1>
        </div>
        <form action="" onSubmit={handlePostcodeInput}>
            <div className="search-bar centred">
                <input type="text" id="postcodeInput" placeholder="Postcode" onChange={updatePostcode}/>
                <input type="image" alt="Submit" src={searchIcon}/>
            </div>
        </form>
        <div className="error-container hidden" id="invalidPostcodeErrorMessage"><p className="centred">Invalid Postcode
            entered</p></div>
        <div id="loadingSpinner" className="spinner centred hidden"></div>
        </>
}
export default Disruptions;