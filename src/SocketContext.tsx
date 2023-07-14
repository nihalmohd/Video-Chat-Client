import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer, { SignalData } from "simple-peer";
import { log } from "console";


interface MediaStream {
  srcObject: MediaStream;
  id: string;
  active: boolean;
  onaddtrack: ((event: Event) => void) | null;
  onremovetrack: ((event: Event) => void) | null;
  onactive: ((event: Event) => void) | null;
  oninactive: ((event: Event) => void) | null;
}

interface CallState {
  isReceivedCall: boolean;
  from: string;
  name: string;
  signal: SignalData;
}

interface ContextProps {
  call: CallState;
  callAccepted: boolean;
  myVideo: React.MutableRefObject<HTMLVideoElement | null>;
  userVideo: React.MutableRefObject<HTMLVideoElement | null>;
  stream: MediaStream | undefined;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  callEnded: boolean;
  me: string;
  callUser: (id: string) => void;
  leaveCall: () => void;
  answerCall: () => void;
}

const socketContext = createContext({} as ContextProps);

const socket = io("http://localhost:5000");

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [stream, setStream] = useState<any>();
  const [me, setMe] = useState<string>("");
  const [call, setCall] = useState<any>({});
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [name, setName] = useState<any>("");
  const myVideo = useRef<any>();
  const userVideo = useRef<any>();
  const connectionref = useRef<any>();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;


        socket.on("me", (id) => setMe(id));


        socket.on("callUser", ({ from, name: callerName, signal }: CallState) => {
          setCall({ isReceivedCall: true, from, name: callerName, signal });
        });
      });
  }, []);

  console.log(myVideo, "near useEffect");

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data: SignalData) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });
    peer.on("stream", (currentStream: MediaStream) => {
      if (userVideo.current) {
        // userVideo.current.srcObject = currentStream;
      }
    });
    if (call.signal) {
      peer.signal(call.signal);
    }
    connectionref.current = peer;
  };

  const callUser = (id: string) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data: SignalData) => {
      socket.emit("callUser", { userToCall: id, signalData: data, from: me, name });
    });
    peer.on("stream", (currentStream: MediaStream) => {
      if (userVideo.current) {
        // userVideo.current.srcObject = currentStream;
      }
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionref.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionref.current?.destroy();
    window.location.reload();
  };
  console.log(myVideo, "last one there will getting or not i checked");

  const contextValue: ContextProps = {
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
    answerCall
  };

  return (
    <socketContext.Provider value={contextValue}>
      {children}
    </socketContext.Provider>
  );
};

export { ContextProvider, socketContext }; export type { ContextProps, MediaStream };

