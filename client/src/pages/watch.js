import React, { useState, useContext } from 'react';
import FormContext from '../modules/FormContext';

function Watch() {
    const {grade, name, school} = useContext(FormContext);

    return (
        <div>
            <div className='watch_frame'>
                
            </div>
        </div>
    );
}

export default Watch;