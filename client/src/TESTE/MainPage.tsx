import React from 'react';
import { CgFileDocument } from 'react-icons/cg';
import { MdLogin } from "react-icons/md";
import './MainPage.css';
import { useNavigate } from 'react-router-dom';

function MainPage() {
    const navigate = useNavigate(); // Mova esta linha para cá

    const handleLoginClick = () => {
        navigate('/login'); 
    };

    const handleOverViewClick = () => {
        navigate('/mainticket'); 
    };

    return (
        <div className="App">
            <h1>Test Project</h1>
            <div className="buttons">
                <div className="login">
                    <button className="buttonLogin" onClick={handleLoginClick}>
                        <MdLogin size={50} />
                    </button>
                </div>

                <div className="documentation">
                    <button className="buttonDocumentation" onClick={handleOverViewClick}>
                        <CgFileDocument size={50} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MainPage;