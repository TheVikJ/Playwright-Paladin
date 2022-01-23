import React from 'react';

function Button({children, onClick, className}) {
    return (
        <button onClick={onClick} className={`${className ? className : ''} mb-5 block mx-auto mt-2 px-6 py-3 text-sm transition-colors duration-300 rounded rounded-full shadow-md text-white bg-red-500 hover:bg-red-600 shadow-red-400/30`}>
            {children}
        </button>
    );
}

export default Button;
