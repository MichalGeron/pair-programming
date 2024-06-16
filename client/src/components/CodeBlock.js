import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import axios from 'axios';

const socket = io('http://localhost:4000');

const CodeBlock = () => {
    const { id } = useParams();
    const [code, setCode] = useState('');
    const [isMentor, setIsMentor] = useState(false);
    const [solution, setSolution] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:4000/codeblocks/${id}`)
            .then(response => {
                setCode(response.data.code);
                setIsMentor(response.data.isMentor);
                setSolution(response.data.solution);
            })
            .catch(error => console.error(error));
    }, [id]);

    useEffect(() => {
        socket.emit('join', id);
        socket.on('codeUpdate', newCode => {
            setCode(newCode);
        });
        return () => socket.off('codeUpdate');
    }, [id]);

    const handleCodeChange = (e) => {
        setCode(e.target.value);
        socket.emit('codeChange', { room: id, code: e.target.value });
    };

    useEffect(() => {
        hljs.highlightAll();
    }, [code]);

    useEffect(() => {
        if (code === solution) {
            alert('😃');
        }
    }, [code, solution]);

    return (
        <div>
            <h1>Code Block</h1>
            {isMentor ? (
                <pre>
                    <code className="javascript">{code}</code>
                </pre>
            ) : (
                <textarea value={code} onChange={handleCodeChange} />
            )}
            {code === solution && <div style={{ fontSize: '2em' }}>😃</div>}
        </div>
    );
};

export default CodeBlock;
