export default function useInvite(roomId){
    const copyInvite=async()=>{
        const link=`${window.location.origin}/room/${roomId}`;
        await navigator.clipboard.writeText(link);

        return link;
    };
    return {
        copyInvite
    };
}