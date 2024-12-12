import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditTicket = () => {
  const { state } = useLocation();
  const ticket = state?.ticket;
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [updatedState, setUpdatedState] = useState<string>('');
  const [updatedObservations, setUpdatedObservations] = useState<string>('');
  const [observationsError, setObservationsError] = useState<string>('');

  const stateToId: { [key: string]: number } = {
    Pendente: 1,
    Recusado: 2,
    'Em Tratamento': 3,
    Finalizado: 4,
  };

  useEffect(() => {
    if (ticket) {
      const idToState: { [key: number]: string } = {
        1: 'Pendente',
        2: 'Recusado',
        3: 'Em Tratamento',
        4: 'Finalizado',
      };
  
      setUpdatedState(idToState[ticket.id_state] || 'Pendente');
      setUpdatedObservations(ticket.observacoes || '');
    } else {
      setError('Ticket não encontrado');
    }
  }, [ticket]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpdatedState(e.target.value);
  };

  const handleObservationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > 255) {
      setObservationsError('As observações não podem ter mais de 255 caracteres');
    } else {
      setObservationsError('');
    }
    setUpdatedObservations(value);
  };

  const handleSave = async () => {
    try {
      const stateId = stateToId[updatedState] || 1;

      const updatedTicket = {
        idState: stateId,
        observacoes: updatedObservations,
        userId:1
      };

      const response = await fetch(`/api/api/tickets/${ticket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTicket),
      });

      const responseData = await response.json();

      if (!response.ok) throw new Error('Erro ao salvar alterações');

      navigate(`/detailsticket`, {
        state: { "ticket":responseData },
      });
    } catch (err) {
      setError('Erro ao salvar as alterações');
    }
  };

  const isSaveDisabled =
    updatedState === 'Recusado' && (updatedObservations?.trim() === '' || updatedObservations === null);

  if (error) return <p>{error}</p>;
  if (!ticket) return <p>Ticket não encontrado</p>;

  return (
    <div className="edit-ticket-container">
      <h1>Editar Ticket</h1>
      
      <div>
        <h2>{ticket.title}</h2>
        <p>{ticket.description}</p>
      </div>

      <div>
        <label htmlFor="state">Estado</label>
        <select id="state" value={updatedState} onChange={handleStateChange}>
          <option value="Pendente">Pendente</option>
          <option value="Recusado">Recusado</option>
          <option value="Em Tratamento">Em Tratamento</option>
          <option value="Finalizado">Finalizado</option>
        </select>
      </div>

      <div>
        <label htmlFor="observations">Observações (Máximo 255 caracteres)</label>
        <textarea
          id="observations"
          value={updatedObservations}
          onChange={handleObservationsChange}
          maxLength={255}
        ></textarea>
        {observationsError && <p style={{ color: 'red' }}>{observationsError}</p>}
      </div>

      <div>
        <button onClick={handleSave} disabled={isSaveDisabled}>Salvar Alterações</button>
      </div>

      {isSaveDisabled && (
        <p style={{ color: 'red' }}>Por favor, escreva observações ao alterar o estado para "Recusado".</p>
      )}
    </div>
  );
};

export default EditTicket;