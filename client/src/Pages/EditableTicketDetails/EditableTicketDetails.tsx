import React, { useState , useEffect} from 'react';
import { useParams, useNavigate, Link,useLocation} from 'react-router-dom';
import './EditableTicketDetails.css';
import Menu from '../Menu/Menu.tsx'

const EditableTicketDetails: React.FC = () => {
  const { state } = useLocation();
  const ticket = state?.ticket;
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [updatedState, setUpdatedState] = useState<string>('');
  const [updatedObservations, setUpdatedObservations] = useState<string>('');
  const [observationsError, setObservationsError] = useState<string>('');

  const department = localStorage.getItem('department');
  const name = localStorage.getItem('name');

  const stateToId: { [key: string]: number } = {
    Recusado: 1,
    'Em Tratamento': 2,
    Finalizado: 3,
  };

  useEffect(() => {
    if (ticket) {
      const idToState: { [key: number]: string } = {
        1: 'Recusado',
        2: 'Em Tratamento',
        3: 'Finalizado',
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
        idState: stateId +1,
        observations: updatedObservations,
        userId:1
      };

      const response = await fetch(`http://localhost:1880/api/tickets/${ticket.id}`, {
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
    <>
    <div className="menu">
    <Menu userName={name} department={department} />
    </div>

    <div className="editable-details-container">
      <h1>Editar Ticket</h1>
      <div className="editable-item">
        <strong>Título:</strong> <span>{ticket.title}</span>
      </div>
      <div className="editable-item">
        <strong>Observações:</strong>
        <textarea
          value={updatedObservations}
          onChange={handleObservationsChange}
          className="observations-input"
          id="observations"
          maxLength={255}
        ></textarea>
        {observationsError && <p style={{ color: 'red' }}>{observationsError}</p>}
      </div>
      <div className="editable-item">
        <strong>Status:</strong>
        <select
          value={updatedState}
          className="status-dropdown"
          onChange={handleStateChange}
        >
          <option value="Recusado">Recusado</option>
          <option value="Em Tratamento">Em Tratamento</option>
          <option value="Finalizado">Finalizado</option>
        </select>
      </div>
     <div className="button-container">
  <button className="action-button" onClick={handleSave}>
    Salvar
  </button>
  <Link to="/mainticket" className="action-button">
    Voltar
  </Link>
</div>

      {isSaveDisabled && (
        <p style={{ color: 'red' }}>Por favor, escreva observações ao alterar o estado para "Recusado".</p>
      )}
    </div>
    </>
  );
};

export default EditableTicketDetails;
