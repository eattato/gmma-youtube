import "../pages/formBase.css"
import "../pages/watch.css"
import React, { useState, useContext, useEffect } from 'react';
import FormContext from '../modules/FormContext';
import * as CryptoJS from 'crypto-js';

function VideoPlayer({ embedId }) {
   return (
    <iframe
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${embedId}?autoplay=1`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded video"
      frameBorder="0"
    />
   );
}

function Watch() {
    const {grade, name, school, startTime} = useContext(FormContext);
    const [timeLeft, setTimeLeft] = useState(30);

    const sendDone = () => {
        let key = "gmma";
        let secretData = `${Date.now() - startTime}`;

        fetch("/done", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                grade: grade,
                name: name,
                school: school,
                secret: CryptoJS.AES.encrypt(secretData, key).toString()
            })
        });
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((left) => {
                left -= 1;
                if (left == 0) {
                    console.log("timer ended");
                    clearInterval(timer);
                    sendDone();
                }
                return left;
            })
        }, 1000)

        return () => {
            console.log("timer cancelled");
            clearInterval(timer);
        }
    }, []);

    return (
        <div className='form_frame'>
            <div className='form_title'>창의경영고 '1분 1초' 설문</div>
            <p className='form_desc'>창의경영고 일학습병행 홍보 영상 '1분 1초'를 30초 이상 시청해주세요.</p>
            <VideoPlayer embedId={"M7nbiMANVD8"} />
            <div className='form_timer'>{timeLeft ? `${timeLeft}초 남음..` : "시청 완료!"}</div>
        </div>
    );
}

export default Watch;