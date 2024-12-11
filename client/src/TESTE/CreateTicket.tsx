import React, { useState } from 'react';

const CreateTicket = () => {
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
    department: ''
  });

  const [error, setError] = useState(''); // Para armazenar erros de validação

  const departments = [
    { id: 1, name: 'IT' },
    { id: 2, name: 'Recursos Humanos' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'Contabilidade' },
    { id: 5, name: 'Vendas' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({
      ...ticketData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação
    if (!ticketData.title || !ticketData.description || !ticketData.department) {
      setError('Por favor, preencha todos os campos.');
      return; // Impede o envio do formulário
    }

    // Limpa o erro se os campos forem válidos
    setError('');

    try {

    const body = {
        title: ticketData.title,
        description: ticketData.description,
        created_by: 1,
        id_department:2
        };
      // Envia os dados para a API via POST
      const response = await fetch('/api/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Falha ao criar o ticket');
      }

      const data = await response.json();
      console.log('Ticket criado com sucesso:', data);
      
      // Você pode fazer algo como limpar o formulário ou redirecionar o usuário após o sucesso
      setTicketData({ title: '', description: '', department: '' });
    } catch (error) {
      setError(`Erro: ${error.message}`);
    }
  };
  return (
    <div className="create-ticket">
      <h2>Criar Ticket</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe a mensagem de erro */}

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
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Criar Ticket</button>
      </form>
    </div>
  );
};

export default CreateTicket;