import React from 'react';
import { getNext } from '../helpers/apiUtils';
import { textToSpeech } from '../helpers/textToSpeech';
import { FaArrowRight } from 'react-icons/fa';
import "../App.css"
const SideWindow = ({ setRes, list, img, setList }) => { 


    return (
        <>
            <div className="side-window-container">
            <h1 className="side-window-header" style={{ textTransform: 'uppercase' }}>
                The Chef’s Corner
            </h1>            
                {img && <img src={img} alt="Img" />}
                {list.length > 0 && <ul className="side-window-list">
                    {list.map((item, index) => (
                        item && <li key={index} className="side-window-item">{item}</li>
                    ))}
                </ul>}
                <button
                    onClick={() => getNext().then(response => {
                        console.log('Response from backend:', response);
                        textToSpeech(response.response);
                        setRes(response.response);
                        setList([...list, response.response]);
                    }).catch(error => {
                        console.error('Error getting next:', error);
                    })}
                    className="next-button"
                >
                    <FaArrowRight className="next-icon" />
                </button>
            </div>
        </>
    );
}

export default SideWindow;
