import "../pages/form.css"
import React, { useState, createContext, useContext } from 'react';
import FormContext from "../modules/FormContext"

function InputLine({ label, placeholder, value, error, type, onChange }) {
    const change = (event) => {
        if (!onChange) return;
        onChange(event.target.value);
    }

    return (
        <div className='form_line'>
            <div className='form_line_label'>{label}</div>
            <input className='form_line_input' placeholder={placeholder} type={type} value={value} onChange={change} />
            <div className='form_line_error'>{error}</div>
        </div>
    );
}

function InputListBox({ label, onClick }) {
    const click = () => {
        onClick();
    }

    return (
        <li className={`form_line_list_box ${onClick? "clickable" : ""}`} onClick={click}>{label}</li>
    );
}

function InputList({ label, placeholder, type, value, error, list, onChange, onClick }) {
    const change = (event) => {
        if (!onChange) return;
        onChange(event.target.value);
    }

    const click = () => {
        if (!onClick) return;
        onClick();
    }

    return (
        <div className='form_line'>
            <div className='form_line_label'>{label}</div>
            <div className="form_line_input_frame">
                <input className='form_line_input' placeholder={placeholder} type={type} value={value} onChange={change} />
                <button className="form_line_input_search" type="button" onClick={click}>검색</button>
            </div>
            <ul className={`form_line_list ${list.length > 0 ? "active" : ""}`}>
                {list.map((li) => <InputListBox label={li.label} onClick={li.click} />)}
            </ul>
            <div className='form_line_error'>{error}</div>
        </div>
    );
}

function Form() {
    const [grade, setGrade, name, setName, school, setSchool] = useContext(FormContext);
    const [gradeError, setGradeError] = useState(null);
    const [nameError, setNameError] = useState(null);

    const [schoolError, setSchoolError] = useState(null);
    const [schoolLoading, setSchoolLoading] = useState(false);
    const [schoolLock, setSchoolLock] = useState(false);
    const [schoolList, setSchoolList] = useState([]);

    const changeGrade = (value) => {
        setGrade(value);
        if (value.length != 5) {
            setGradeError("학번은 5글자 입니다.");
        } else if (isNaN(value)) {
            setGradeError("학번은 숫자로만 구성될 수 있습니다.");
        } else setGradeError(null);
    }

    const changeName = (value) => {
        setName(value);
        if (name.length > 20) {
            setNameError("이름은 최대 20글자 입니다.");
        } else {
            setNameError(null);
        }
    }

    const changeSchool = (value) => {
        setSchool(value);
        setSchoolLock(false);
        setSchoolList([]);
    }

    const searchSchool = () => {
        if (schoolLoading) return;
        setSchoolLoading(true);
        setSchoolLock(false);
        setSchoolList([{ label: "로딩 중..", click: null }]);

        fetch("/school", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                school: school
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (!res.result) {
                setSchoolList([{ label: `로드 실패 - ${res.reason}`, click: null }]);
                return;
            }

            if (res.data.length == 0) {
                setSchoolList([{ label: "학교를 찾을 수 없었어요..", click: null }]);
                return;
            }

            setSchoolList(res.data.map((li) => ({
                label: li,
                click: () => {
                    setSchoolList([]);
                    setSchool(li);
                    setSchoolLock(true);
                }
            })));
        })
        .finally(() => {
            setSchoolLoading(false);
        });
    }

    const submit = () => {
        changeGrade(grade);
        changeName(name);

        if (!gradeError && !nameError) {
            console.log("submit");
        }
    }

    return (
        <div className='form_frame'>
            <div className='form_title'>창의경영고 1분 1초 설문</div>
            <p className='form_desc'>학급 정보를 입력한 뒤, 창의경영고 일학습병행 홍보 영상 '1분 1초'를 30초 이상 시청해주세요.</p>
            <form>
                <InputLine label="학번" placeholder="학번을 입력하세요." type="number" value={grade} error={gradeError} onChange={changeGrade} />
                <InputLine label="이름" placeholder="이름을 입력하세요." type="text" value={name} error={nameError} onChange={changeName} />
                <InputList label="학교명" placeholder="학교명을 입력하세요." type="text" value={school} error={schoolError} list={schoolList} onChange={changeSchool} onClick={searchSchool} />
                <button className='submit' type='button' onClick={submit}>제출하고 시청하기</button>
            </form>
        </div>
    );
}

export default Form;