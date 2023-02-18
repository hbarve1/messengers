import React, { useEffect, useRef, useState, useContext } from 'react';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { SocketContext } from './Context';

function Sidebar({ children }: { children: React.ReactNode }) {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } =
    useContext(SocketContext);

  const [idToCall, setIdToCall] = useState('');

  return (
    <div>
      <div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CopyToClipboard text={me}>
              <button>Copy ID</button>
            </CopyToClipboard>
          </div>

          <div>
            <label htmlFor="idToCall">ID to call</label>
            <input
              id="idToCall"
              type="text"
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
            />
            {callAccepted && !callEnded ? (
              <button onClick={leaveCall}>Hang Up</button>
            ) : (
              <button onClick={() => callUser(idToCall)}>Call</button>
            )}
          </div>
        </form>
        {children}
      </div>
    </div>
  );
}

export default Sidebar;
