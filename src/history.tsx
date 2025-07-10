import React, {useState, useEffect} from 'react';
import './sitewide.css';

const contentText = require('./history.json')

class history{
    public id: number;
    public name: string;
    public content: string;
    constructor(id: number, name: string, content: string) {
        this.id = id;
        this.name = name;
        this.content = content;
    }
}

function History(): React.ReactElement {
    const [contentEntryIndex, setContentEntryIndex] = useState<number>(0);

    useEffect(() =>{ populatePage();}, [populatePage]);

    if (!contentText || contentText[0] === undefined) {
        return <div>Loading content...</div>;
    }

    function populatePageNavigation() :void {
        let pageNavigation = document.getElementById('history-page-navigation');
        if (pageNavigation == null) {
            return;
        }
        pageNavigation.innerHTML = '';
        contentText.forEach((element: history) :void => {
            let newButton = document.createElement("button");
            newButton.id = element.name;
            newButton.className = "page-navigation-button";
            newButton.innerHTML = element.name;
            newButton.addEventListener("click", () => { setContentEntryIndex(element.id - 1)});
            pageNavigation?.appendChild(newButton);
        })
    }

    function populateContent() :void {
        let container = document.getElementById('history-content-container');
        if (container == null){
            return;
        }
        container.innerHTML = "";
        container.innerHTML = contentText[contentEntryIndex].content;
    }
    function populatePage() :void {
        populatePageNavigation();
        populateContent();
    }

    return <div className="container-fluid centred">
    <h1> 🚌 History of TfL Buses 🚌 </h1>
    <div id="history-page-navigation" className="page-navigation"> </div>
    <div id="history-content-container"className="content-container">content blank </div>
    </div>
}
export default History;