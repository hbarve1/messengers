import { useContext } from 'react';
import { SocketContext } from './Context';

function Notification() {
  const { answerCall, call, callAccepted } = useContext(SocketContext);

  if (call.isReceivedCall && !callAccepted) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>{call.name} is calling:</h1>
        <button onClick={answerCall}>Answer</button>
      </div>
    );
  }

  return null;
}

export default Notification;
