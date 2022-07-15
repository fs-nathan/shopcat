import React from "react";
const Loader = () => {
    return (
        <div className="w-full flex justify-center items-center" style={{ height: 'calc(100vh - 6rem)' }}>
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

export default Loader;
