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

  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState('');

  // Carregar os departamentos ao montar o componente
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/api/departments');
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
      const response = await fetch('/api/api/tickets', {
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
    <div className="create-ticket">
      <h2>Criar Ticket</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={ticketData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Descrição:</label>
          <textarea
            id="description"
            name="description"
            value={ticketData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="department">Departamento Responsável:</label>
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

        <button type="submit">Criar Ticket</button>
      </form>
    </div>
  );
};

export default CreateTicket;