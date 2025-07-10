import React, {useState, useEffect} from 'react';
import {json} from "node:stream/consumers";

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
    const [content, setContent] = useState<history[]>([]);

    useEffect(() =>{populatePage();
        fetch ('/history.json')
        .then ((response: Response) => response.json())
        .then (content => setContent(content))
        .catch((error: Error) => console.error('cannot fetch content', error));
    }, []);

    if (!content || content[0] === undefined) {
        return <div>Loading content...</div>;
    }

    function populateNavigation(){
        let navigation = document.getElementById('navigation');
        if (navigation == null) {
            return <div>Loading navigation...</div>;
        }
        navigation.innerHTML = '';
        content.forEach((element: history) => {
            let newButton = document.createElement("button");
            newButton.id = element.name;
            newButton.innerHTML = element.name;
            navigation?.appendChild(newButton);
        })
    }

    function populateContent(){
        let container = document.getElementById('content-container');
        if (container == null){
            return <div>Loading content</div>;
        }
        container.innerHTML = "";
        container.innerHTML = content[0].content;
    }
    function populatePage(){
            populateNavigation();
            populateContent();
    }

    return <>
    <h1> History of TfL Buses </h1>
    <div id="navigation"> </div>
    <div id="content-container">content blank </div>
            </>
}
export default History;