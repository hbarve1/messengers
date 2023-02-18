import { SocketContext } from './Context';
import { useContext } from 'react';

import styles from './videoPlayer.module.css';

function VideoPlayer() {
  const {
    name,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    callEnded,
    call,
    leaveCall,
  } = useContext(SocketContext);

  console.log(callAccepted && !callEnded, callAccepted, callEnded, userVideo);

  return (
    <div className={styles.container}>
      {stream && (
        <div>
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            style={{ width: '300px' }}
          />
          <h1>{name || 'Name'}</h1>
        </div>
      )}

      {callAccepted && !callEnded && (
        <div>
          <h1>{call.name || 'Name'}</h1>

          <video
            playsInline
            ref={userVideo}
            autoPlay
            style={{ width: '300px' }}
          />
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
