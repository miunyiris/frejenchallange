import React from 'react';
import { Link } from 'react-router-dom';
import './TicketDetails.css';
import { useLocation } from 'react-router-dom';
import Menu from '../Menu/Menu.tsx'

const TicketDetails: React.FC = () => {
  const { state } = useLocation();
  const ticket = state?.ticket;

  const department = localStorage.getItem('department');
  const name = localStorage.getItem('name');

  const statusNames = {
    1: "Pendente",
    2: "Recusado",
    3: "Em Tratamento",
    4: "Finalizado",
  };
  
  if (!ticket) return <p>Ticket não encontrado.</p>;

  return (
    <>
    <div className="menu">
    <Menu userName={name} department={department} />
    </div>

    <div className="details-container">
      <div className="details-header">
        <h1>Detalhes do Ticket</h1>
      </div>
      <div className="details-content">
        <div className="details-item">
          <strong>Título:</strong> <span>{ticket.title}</span>
        </div>
        <div className="details-item">
          <strong>Descrição:</strong> <span>{ticket.description}</span>
        </div>
        <div className="details-item">
          <strong>Data de Criação:</strong> <span>{ticket.createdAt}</span>
        </div>
        <div className="details-item">
          <strong>Última Atualização:</strong> <span>{ticket.updatedAt}</span>
        </div>
        <div className="details-item">
          <strong>Departamento:</strong> <span>{ticket.department}</span>
        </div>
        <div className="details-item">
          <strong>Observações:</strong> <span>{ticket.observations}</span>
        </div>
        <div >
           <span className={`status ${statusNames[ticket.id_state]}`}>{statusNames[ticket.id_state]}</span>
        </div>
      </div>
<div className="button-container">
  <Link to="/mainticket" className="action-button">
    Voltar
  </Link>
</div>
    </div>
    </>
  );
};

export default TicketDetails;
