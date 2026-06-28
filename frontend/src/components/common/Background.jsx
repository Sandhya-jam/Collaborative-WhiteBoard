export default function Background(){

    return(
        <>
        <div className="fixed inset-0-z-10 bg-[#0D1117]"/>

        <div
        className="fixed top-[-200px] left-[-150px] w-[450px] h-[450px] rounded-full bg-purple-600/20 blur-[150px]-z-10"/>

        <div
        className="fixed bottom-[-200px] right-[-150px] w-[450px] h-[450px] rounded-full bg-blue-600/20 blur-[150px]-z-10"/>
        </>
    );
}