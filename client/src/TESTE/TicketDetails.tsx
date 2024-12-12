import React from 'react';
import { useLocation } from 'react-router-dom';

const TicketDetails = () => {
  const { state } = useLocation();
  const ticket = state?.ticket;
  
  if (!ticket) return <p>Ticket não encontrado.</p>;

  return (
    <div>
      <h1>Detalhes do Ticket</h1>
      <p>ID: {ticket.id}</p>
      <p>Título: {ticket.title}</p>
      <p>Descrição: {ticket.description}</p>
      <p>Estado: {ticket.id_state}</p>
      <p>Observações: {ticket.observacoes}</p>
      <p>Departamento: {ticket.department}</p>
      <p>Criado por: {ticket.createdByName}</p>
      <p>Atualizado por: {ticket.updatedByName}</p>
      <p>Criado em: {ticket.createdAt}</p>
      <p>Atualizado em: {ticket.updatedAt}</p>
    </div>
  );
};

export default TicketDetails;