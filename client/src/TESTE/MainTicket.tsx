import React, { useState, useEffect, useRef } from 'react';
import './MainTicket.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit } from 'react-icons/fa';

interface Ticket {
  id: number;
  title: string;
  description: string;
  department: string;
  id_state: number;
  createdAt: string;
  updateAt: string;
  observacoes: string;
  createdByName: string;
  updatedByName: string;
}

const TicketList = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    Pendente: true,
    Recusado: true,
    EmTratamento: true,
    Finalizado: true,
  });
  const [search, setSearch] = useState('');
  const [searchPage, setSearchPage] = useState(1);

  const pagesize = 6;
  const loader = useRef<HTMLDivElement | null>(null);

  const userId = localStorage.getItem('id') !== null ? Number(localStorage.getItem('id')) : null;
  const admin = localStorage.getItem('admin') !== null ? Number(localStorage.getItem('admin')) : null;
  const departmentId = localStorage.getItem('id_department') !== null ? Number(localStorage.getItem('id_department')) : null;
  const department = localStorage.getItem('department');
  const name = localStorage.getItem('name');

  const fetchTickets = async (isSearch: boolean = false) => {
    setIsLoading(true);

    let status = '';
    if (filters.Pendente) status += '1,';
    if (filters.Recusado) status += '2,';
    if (filters.EmTratamento) status += '3,';
    if (filters.Finalizado) status += '4,';

    if (status.endsWith(',')) status = status.slice(0, -1);

    const pageNumber = isSearch ? searchPage : page;

    try {
      const params = new URLSearchParams({
        pagenumber: pageNumber.toString(),
        pagesize: pagesize.toString(),
        status: status.toString(),
        search: search || '', 
      });
    
      if (admin !== null && admin !== 1) {
        if (userId !== null) {
          params.append('created_id', userId.toString());
        }
        if (departmentId !== null) {
          params.append('department_id', departmentId.toString());
        }
      }
    
      const response = await fetch(`/api/api/tickets?${params.toString()}`);

      if (response.status === 404) {
        setTickets([]);
        setHasMore(false);
        return;
      }

      const data = await response.json();

      if (isSearch) {
        setTickets(data.tickets);
        setHasMore(data.hasMore);
        setSearchPage(1);
      } else {
        setTickets((prevTickets) => [...prevTickets, ...data.tickets]);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('Erro ao buscar tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (searchValue: string) => {
    setSearch(searchValue);
  };

  const handleSearchClick = () => {
    setTickets([]); 
    setSearchPage(1);
    fetchTickets(true);
    setPage(2);
  };

  const handleFilterChange = (state: string) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      newFilters[state] = !newFilters[state];

      const activeFilters = Object.values(newFilters).filter(Boolean);
      if (activeFilters.length === 0) {
        newFilters.Pendente = true;
      }

      return newFilters;
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          fetchTickets();
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );
    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
  },[hasMore, page, isLoading]);

  const handleViewDetails = (ticket) => {
    navigate(`/detailsticket`, {
      state: { ticket },
    });
  };

  const handleEditTicket = (ticket) => {
    navigate(`/editticket`, {
      state: { ticket },
    });
  };

  return (
    <div className="main-ticket-container">
      <h1>Lista de Tickets</h1>

      <div className="state-filter-container">
        {['Pendente', 'Recusado', 'EmTratamento', 'Finalizado'].map((state) => (
          <label key={state}>
            <input
              type="checkbox"
              checked={filters[state]}
              onChange={() => handleFilterChange(state)}
            />
            {state}
          </label>
        ))}
        <label>
          <input
            type="text"
            placeholder="Pesquisar por título, descrição ou observações"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </label>
        <button onClick={handleSearchClick}>Pesquisar</button>
      </div>


      <div className="ticket-list">
        <h1>Lista de Tickets</h1>
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id} className="ticket-item">
              <span>{ticket.title}</span>

            {(ticket.id_state === 1 || ticket.id_state === 3 || admin === 1) && (
              <button onClick={() => handleEditTicket(ticket)} title="Editar">
                <FaEdit />
              </button>
            )}

              <button onClick={() => handleViewDetails(ticket)} title="Ver Detalhes">
                <FaEye />
              </button>
            </li>
          ))}
        </ul>
        <div ref={loader} style={{ height: '20px' }} />
      </div>

      {isLoading && <p>Carregando...</p>}
      {!hasMore && <p>Todos os tickets foram carregados.</p>}
    </div>
  );
};

export default TicketList;