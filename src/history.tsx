import React, {useState, useEffect} from 'react';
import './sitewide.css';


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

const contentText = require('./history.json')

function History(): React.ReactElement {
    const [content, setContent] = useState<string>("default text");
    const [contentEntryIndex, setContentEntryIndex] = useState<number>(0);

    useEffect(() =>{ populatePage();
        fetch ('history.json')
        .then ((response: Response) => response.json())
        .then (content => setContent(content))
        .catch((error: Error) => console.error('cannot fetch content', error));
    }, [populatePage]);

    if (!contentText || contentText[0] === undefined) {
        return <div>Loading content...</div>;
    }

    function populatePageNavigation() :void {
        console.log('populate navigation');
        let pageNavigation = document.getElementById('navigation');
        if (pageNavigation == null) {
            return;
        }
        pageNavigation.innerHTML = '';
        contentText.forEach((element: history) :void => {
            let newButton = document.createElement("button");
            newButton.id = element.name;
            newButton.innerHTML = element.name;
            newButton.addEventListener("click", () => { setContentEntryIndex(element.id - 1)});
            pageNavigation?.appendChild(newButton);
        })
    }

    function populateContent() :void {
        console.log('populate content');
        let container = document.getElementById('content-container');
        if (container == null){
            return;
        }
        container.innerHTML = "";
        container.innerHTML = contentText[contentEntryIndex].content;
    }
    function populatePage() :void {
        console.log('populate page');
        populatePageNavigation();
        populateContent();
    }

    return <div className="container-fluid centred">
    <h1> 🚌 History of TfL Buses 🚌 </h1>
    <div id="navigation"> </div>
    <div id="content-container">content blank </div>
    </div>
}
export default History;