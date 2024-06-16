import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';

const socket = io('http://localhost:4000');

const CodeBlock = () => {
  const { id } = useParams();
  const [codeBlock, setCodeBlock] = useState({ title: '', code: '' });
  const [role, setRole] = useState('');

  useEffect(() => {
    const userRole = prompt('Enter your role (mentor/student):');
    setRole(userRole);
    socket.emit('join', { codeBlockId: id, role: userRole });
    
    socket.on('loadCodeBlock', (block) => {
      setCodeBlock(block);
    });

    socket.on('codeUpdate', (newCode) => {
      setCodeBlock((prevBlock) => ({ ...prevBlock, code: newCode }));
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleCodeChange = (event) => {
    const newCode = event.target.value;
    setCodeBlock((prevBlock) => ({ ...prevBlock, code: newCode }));
    socket.emit('codeChange', { codeBlockId: id, code: newCode });
  };

  useEffect(() => {
    hljs.highlightAll();
  }, [codeBlock.code]);

  return (
    <div>
      <h1>{codeBlock.title}</h1>
      {role === 'mentor' ? (
        <pre>
          <code className="javascript">
            {codeBlock.code}
          </code>
        </pre>
      ) : (
        <textarea value={codeBlock.code} onChange={handleCodeChange}></textarea>
      )}
    </div>
  );
};

export default CodeBlock;
