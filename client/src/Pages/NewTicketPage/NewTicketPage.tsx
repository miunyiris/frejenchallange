import './NewTicketPage.css';
import Menu from '../Menu/Menu.tsx'
import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';

interface Department {
  id: number;
  title: string;
}

const CreateTicket = () => {
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
    department: ''
  });

  const department = localStorage.getItem('department');
  const name = localStorage.getItem('name');

  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState('');

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
        setError(`Erro: ${error.message}`);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({
      ...ticketData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ticketData.title || !ticketData.description || !ticketData.department) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setError('');

    try {
      const body = {
        title: ticketData.title,
        description: ticketData.description,
        created_by: 1,
        id_department: ticketData.department,
      };
      const response = await fetch('http://localhost:1880/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Falha ao criar o ticket');
      }

      const data = await response.json();

      navigate(`/detailsticket`, {
        state: { "ticket":data },
      });
    } catch (error) {
      setError(`Erro: ${error.message}`);
    }
  };


  return (
    <>
    <div className="menu">
    <Menu userName={name} department={department} />
    </div>
    <div className="form-container">
      <h1>Criar Novo Ticket</h1>
      <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={ticketData.title}
            onChange={handleChange}
            placeholder="Digite o título do ticket"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={ticketData.description}
            onChange={handleChange}
            placeholder="Descreva o problema ou solicitação"
            rows={4}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="department">Departamento</label>
          <select
            id="department"
            name="department"
            value={ticketData.department}
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

        <button type="submit" className="back-button">
         Voltar 
        </button>
        <button type="submit" className="submit-button">
          Criar Ticket
        </button>
      </form>
    </div>
    </>
  );
};

export default CreateTicket;
