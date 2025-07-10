import React from 'react';
import {Nav} from "react-bootstrap";
import './navbar.css';

const Navbar = () => {

    return (<>
    <Nav className="navbar navbar-default">
        <div className="container-fluid">
            <ul className="nav navbar-nav">
                <li className = 'nav-item'><a href="/">Home</a></li>
                <li className = 'nav-item'><a href="/history">History</a></li>
            </ul>
        </div>
    </Nav>
        </>
)
    ;
}

export default Navbar;