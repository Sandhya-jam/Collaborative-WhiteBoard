import { useEffect } from "react";
import { getUser } from "../../utils/auth";
const attachPresenceListeners=(socket,setUsers,createPeerConnection,peerConnections,createOffer,createAnswer,remoteAudioRef)=>{
    socket.off("users-update");
    socket.off("voice-offer");

    socket.on("users-update",async(users)=>{
        //console.log("USERS UPDATE",users);
        setUsers(users);
        console.log("Current Users:", users);

        const me = getUser();

        for (const u of users) {

            if (u.userId === me._id) continue;

            let pc = peerConnections.current[u.userId];
            console.log("Existing PC:", pc);
            if (!pc) {
                console.log("Creating NEW PC");
                pc = createPeerConnection(u.userId);
            }else {
                console.log("Reusing OLD PC");
                console.log("State:", pc.signalingState);
                console.log("Local Description:", pc.localDescription);
            }
            // Only one side creates offer
            if (
                me._id > u.userId &&
                pc.signalingState === "stable" &&
                !pc.localDescription
            ){
                console.log("Creating initial offer");
                const offer = await createOffer(u.userId);
                socket.emit("voice-offer", {
                    targetUserId: u.userId,
                    senderUserId: me._id,
                    offer
                });
            }
        }
    });

    socket.on("voice-offer",async ({senderUserId,offer})=>{
        console.log("Offer received from",senderUserId);
        const answer=await createAnswer(senderUserId,offer);
        socket.emit("voice-answer",{
            targetUserId:senderUserId,
            senderUserId:getUser()._id,
            answer
        });
    });

    socket.on("voice-answer",async({senderUserId,answer})=>{
        console.log("Answer received")
        const pc=peerConnections.current[senderUserId];

        if(!pc) return;

        console.log("Before Answer:", pc.signalingState);

        await pc.setRemoteDescription(answer);

        console.log("After Answer:", pc.signalingState);
    });

    socket.on("ice-candidate",async({senderUserId,candidate})=>{
        const pc=peerConnections.current[senderUserId];
        if(!pc) return;

        await pc.addIceCandidate(candidate);
        console.log("ICE Added");
    });
}

export default attachPresenceListeners;