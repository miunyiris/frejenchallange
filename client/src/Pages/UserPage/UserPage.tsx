import './UserPage.css';
import Menu from '../Menu/Menu.tsx'
import React, { useState, useEffect } from 'react';

interface Department {
  id: number;
  title: string;
}

const UserPage: React.FC = () => {

  const [userData, setUserData] = useState({
    id:localStorage.getItem('id') !== null ? Number(localStorage.getItem('id')) : null,
    name: localStorage.getItem('name'),
    password: '',
    department: localStorage.getItem('id_department') !== null ? Number(localStorage.getItem('id_department')) : null
  });

  const department = localStorage.getItem('department');
  const name = localStorage.getItem('name');

  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:1880/api/departments');
        if (!response.ok) {
          throw new Error('Falha ao carregar os departamentos');
        }
        const data = await response.json();
        
        setDepartments(data);
      } catch (error) {
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        name: userData.name,
        password: userData.password,
        department: userData.department,
      };

      const response = await fetch(`http://localhost:1880/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar o ticket');
      }

      localStorage.removeItem('name');
      localStorage.removeItem('id_department');
      localStorage.removeItem('department');
      localStorage.setItem('name', userData.name);
      localStorage.setItem('id_department', userData.department);
      localStorage.setItem('department', departments.find(dep => dep.id === userData.department)?.title || '');
    } catch (error) {
    }
  };

  return (
    <>
    <div className="menu">
    <Menu userName={name} department={department} />
    </div>
    <div className="user-details-container">
      <h1>Detalhes do Usuário</h1>
      <div className="user-details-card">
        <div className="user-detail">
          <strong>Nome:</strong>
          <input
            id="name"
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            placeholder="Digite o nome"
          />
        </div>
        <div className="user-detail">
          <strong>Password:</strong>
          <input
            id="password"
            type="text"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Caso queira alterar a senha, insira-a aqui"
          />
        </div>
        <div className="form-group">
          <label htmlFor="department">Departamento</label>
          <select
            id="department"
            name="department"
            value={userData.department}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o departamento</option>
            {departments.length > 0 ? (
              departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.title}
                </option>
              ))
            ) : (
              <option>Carregando...</option>
            )}
          </select>
        </div>
        <button type="submit" className="submit-button" onClick={handleSubmit}>
          Salvar Alterações
        </button>
      </div>
    </div>
    </>
  );
};

export default UserPage;
