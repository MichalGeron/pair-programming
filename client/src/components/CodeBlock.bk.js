// src/components/CodeBlock.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socketIOClient from 'socket.io-client';

const ENDPOINT = "http://localhost:4000"; 

const CodeBlock = () => {
  const { id } = useParams();
  const [code, setCode] = useState('');
  const [isMentor, setIsMentor] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
      const userRole = prompt('Enter your role (mentor/student):');
      setIsMentor(userRole=="mentor");
      socket.emit('join', { codeBlockId: id, role: userRole });
      
      socket.on('loadCodeBlock', (block) => {
        setCodeBlock(block);
      });
  
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);

    socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    // Determine if the current user is the mentor (based on socket connection order)
    socket.on('mentorStatus', (status) => {
      setIsMentor(status);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);

    // Emit event to server when code changes
    socket.emit('codeChange', newCode);
  };

  return (
    <div>
      <h2>Code Block {id}</h2>
      {isMentor ? (
        <textarea value={code} readOnly />
      ) : (
        <textarea value={code} onChange={handleChange} />
      )}
    </div>
  );
};

export default CodeBlock;
