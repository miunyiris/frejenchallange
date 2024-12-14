import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Menu.css';

interface MenuProps {
  userName: string; // Pass the user's name as a prop
  department: string; // Pass the user's department as a prop
}

const Menu: React.FC<MenuProps> = ({ userName, department }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Simulate logout logic (e.g., clear tokens, redirect to login page)
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="menu">
      <div className="menu-links">
        <Link to="/mainticket" className="menu-link">
          Página Inicial
        </Link>
        <Link to="/newticket" className="menu-link">
          Criar Ticket
        </Link>
        <Link to="/user" className="menu-link">
          Perfil
        </Link>
      </div>
      <div className="menu-right">
        <div className="welcome-container">
          <span className="welcome-name">Bem vindo, {userName}</span>
          <span className="welcome-department">Departamento: {department}</span>
        </div>
        <button className="menu-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Menu;
