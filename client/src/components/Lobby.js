import React from 'react';
import { Link } from 'react-router-dom';

const Lobby = () => {
    return (
        <div>
            <h1>Choose code block</h1>
            <ul>
                <li><Link to="/codeblock/1">Async case</Link></li>
                <li><Link to="/codeblock/2">Callback hell</Link></li>
                <li><Link to="/codeblock/3">Promise example</Link></li>
                <li><Link to="/codeblock/4">Event loop</Link></li>
            </ul>
        </div>
    );
};

export default Lobby;
