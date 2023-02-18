import { io } from 'socket.io-client';
import { createContext, useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';

const SocketContext = createContext<{
  call: {
    isReceivedCall: boolean;
    from: string;
    name: string;
    signal: any;
  };
  callAccepted: boolean;
  myVideo: any;
  userVideo: any;
  stream: MediaStream | undefined;
  name: string;
  setName: (name: string) => void;
  callEnded: boolean;
  me: string;
  callUser: (id: string) => void;
  leaveCall: () => void;
  answerCall: () => void;
}>({
  call: {
    name: '',
    from: '',
    signal: null,
    isReceivedCall: false,
  },
  callAccepted: false,
  myVideo: null,
  userVideo: null,
  stream: undefined,
  name: '',
  setName: function (): void {
    throw new Error('Function not implemented.');
  },
  callEnded: false,
  me: '',
  callUser: function (id: string): void {
    throw new Error('Function not implemented.');
  },
  leaveCall: function (): void {
    throw new Error('Function not implemented.');
  },
  answerCall: function (): void {
    throw new Error('Function not implemented.');
  },
});

const socket = io('http://localhost:4000');

function ContextProvider({ children }: { children: React.ReactNode }) {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [callError, setCallError] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [name, setName] = useState('');
  const [me, setMe] = useState('');
  const [call, setCall] = useState<{
    isReceivedCall: boolean;
    from: string;
    name: string;
    signal: any;
  }>({
    name: '',
    from: '',
    signal: null,
    isReceivedCall: false,
  });

  const myVideo = useRef<HTMLVideoElement>();
  const userVideo = useRef<HTMLVideoElement>();
  const connectionRef = useRef<Peer.Instance | undefined>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((currentStream) => {
        setStream(currentStream);

        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    socket.on('me', (id) => setMe(id));

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo?.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo?.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current?.destroy();

    // window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export { ContextProvider, SocketContext };
