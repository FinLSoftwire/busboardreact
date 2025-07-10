import React from 'react';
import {Nav} from "react-bootstrap";
import './navbar.css';

const Navbar = () => {

    return (<>
    <Nav className="navbar">
        <div className="container-fluid">
            <img src="./bus.png" className="icon"></img>
                <div className = 'nav-item'><a href="/">Home</a></div>
                <div className = 'nav-item'><a href="/history">History</a></div>
        </div>
    </Nav>
        </>
)
    ;
}

export default Navbar;