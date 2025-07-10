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

    useEffect(() =>{
        fetch ('/history.json')
        .then((response: Response) => response.json())
            .then (content => setContent(content))
            .catch((error: Error) => console.error('cannot fetch content', error));
    }, []);

    console.log(content);
    if (!content) {
        return <div>Loading content...</div>;
    }

    function populateContent(){
        if (content != undefined){
            let body = document.createElement("div");
            body.innerHTML = content[0].name;
            document.getElementById('content-container')?.appendChild(body);
        }
    }

    return <>
    <h1> History of TfL Buses </h1>
    <div className="navigation"></div>
    <div id="content-container"></div>{populateContent()}
    </>
}
export default History;