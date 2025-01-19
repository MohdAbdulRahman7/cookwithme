// import React, {useState} from 'react';
// import { getNext } from '../helpers/apiUtils';
// import { textToSpeech } from '../helpers/textToSpeech';
// const SideWindow = ({ setRes, list }) => { 


//     return (
//         <div>
//             <h1>Side Window</h1>
//             <ul>
//                 {list.map((item, index) => (
//                     <li key={index}>{item}</li>
//                 ))}
//             </ul>
//             <button onClick={() => getNext().then(response => {
//                             console.log('Response from backend:', response);
//                             textToSpeech(response.response);
//                             setRes(response.response);
//                         }).catch(error => {
//                             console.error('Error getting next:', error);
//                         })}>Next</button>
//         </div>
//     );

// }

// export default SideWindow;

import React from 'react';
import { getNext } from '../helpers/apiUtils';
import { textToSpeech } from '../helpers/textToSpeech';
const SideWindow = ({ setRes, list, img }) => { 


    return (
        <div className="side-window-container">
        <h1 className="side-window-header" style={{ textTransform: 'uppercase' }}>
            The Chef’s Corner
        </h1>            
            {img && <img src={img} alt="Img" />}
            {list.length > 0 && <ul className="side-window-list">
                {list.map((item, index) => (
                    <li key={index} className="side-window-item">{item}</li>
                ))}
            </ul>
            <button
                onClick={() => getNext().then(response => {
                    console.log('Response from backend:', response);
                    textToSpeech(response.response);
                    setRes(response.response);
                }).catch(error => {
                    console.error('Error getting next:', error);
                })}
                className="next-button"
            >
                <FaArrowRight className="next-icon" />
            </button>
        </div>
    );
}

export default SideWindow;
