import { useRef, useState } from "react";
import { getUser } from "./auth";
const audioAcess = ({socket,setMicStates}) => {
  const [micOn,setMicOn]=useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const localAudioStream=useRef(null);
  const peerConnections=useRef({});
  const hasAudioTrack=useRef(false);
  
  const initializeAudio = async () => {

    if (localAudioStream.current) return;

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        // Initially muted
        stream.getAudioTracks()[0].enabled = false;

        localAudioStream.current = stream;

        setMicOn(false);

        console.log("Audio initialized");

    } catch (err) {
        console.error(err);
    }

 }; 

  const toggleMic = () => {
    if (!localAudioStream.current) {
        console.error("Audio not initialized");
        return;
    }

    const track = localAudioStream.current.getAudioTracks()[0];
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
    setMicStates(prev=>({
        ...prev,
        [getUser()._id]:track.enabled
    }));
    socket.emit("mic-status",{
        micOn:track.enabled
    });
    console.log(
        track.enabled ? "Mic ON" : "Mic OFF"
    );
};

  const createPeerConnection=(remoteUserId)=>{
    const pc=new RTCPeerConnection({
        iceServers:[
            {
                urls:"stun:stun.l.google.com:19302"
            }
        ]
    });
    if (localAudioStream.current) {
        localAudioStream.current.getTracks().forEach(track => {
            pc.addTrack(track, localAudioStream.current);
        });
        console.log("Added audio tracks:", pc.getSenders());
    }
    pc.onicecandidate=(event)=>{
        if(!event.candidate) return;
        console.log("Sending ICE Candidate");

        socket.emit("ice-candidate",{
            targetUserId:remoteUserId,
            senderUserId:getUser()._id,
            candidate:event.candidate
        });
    }
    pc.oniceconnectionstatechange=()=>{
        console.log("ICE Connection:",pc.iceConnectionState);
    };
    pc.onconnectionstatechange=()=>{
        console.log("Connection:",pc.connectionState);
    };
    console.log("ICE Gathering:", pc.iceGatheringState);
    peerConnections.current[remoteUserId]=pc;
    console.log("PC: ",pc)
    pc.ontrack = (event) => {
        console.log("Remote Track Received");
        console.log(event.streams[0]);
        setRemoteStream(event.streams[0]);
    };
    return pc;
  }

  const createOffer=async(remoteUserId)=>{
    const pc=peerConnections.current[remoteUserId];
    if(pc.signalingState!=="stable" || pc.pendingLocalDescription){
        console.log("Skipping negotiation");
        return;
    }
    const offer=await pc.createOffer();
    await pc.setLocalDescription(offer);
    console.log(pc.getSenders().length);
    console.log(pc.getTransceivers().length);
    console.log("After setLocalDescription");
    console.log("ICE Gathering:", pc.iceGatheringState);
    console.log("Local Description:", pc.localDescription);
    console.log(pc.localDescription.sdp.match(/m=audio/g));
    console.log(offer);
    console.log(pc.signalingState);
    return offer;
  }

  const createAnswer=async(senderUserId,offer)=>{
    let pc=peerConnections.current[senderUserId];
    if(!pc){
        pc=createPeerConnection(senderUserId);
    }
    console.log("Received Offer", offer);
    //offer came from other person
    await pc.setRemoteDescription(offer);

    const answer=await pc.createAnswer();

    //make ans as our local description
    await pc.setLocalDescription(answer);

    return answer;

  }
  return{micOn,setMicOn,initializeAudio,toggleMic,createPeerConnection,peerConnections,createOffer,createAnswer,remoteStream};
}

export default audioAcess