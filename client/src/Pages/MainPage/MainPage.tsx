import React, { useState, useEffect, useRef } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import './MainPage.css';
import Menu from '../Menu/Menu.tsx';

interface Ticket {
  id: number;
  title: string;
  description: string;
  department: string;
  id_state: number;
  state:string;
  createdAt: string;
  updatedAt: string;
  observacoes: string;
  createdByName: string;
  updatedByName: string;
  observations:string;
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

  const statusNames = {
    1: "Pendente",
    2: "Recusado",
    3: "Em Tratamento",
    4: "Finalizado",
  };

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
    
      const response = await fetch(`http://localhost:1880/api/tickets?${params.toString()}`);

      console.log(response);

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
    <>
      <div className="menu">
        <Menu userName={name} department={department} />
      </div>
      <div className="homepage">
        <h1>Lista de Tickets</h1>

        <div className="state-filter-container">
  <div className="filter-checkboxes">
    {['Pendente', 'Recusado', 'EmTratamento', 'Finalizado'].map((state) => (
      <label key={state} className="checkbox-label">
        <input
          className="checkbox-state"
          type="checkbox"
          checked={filters[state]}
          onChange={() => handleFilterChange(state)}
        />
        {state}
      </label>
    ))}
  </div>

  <div className="filter-search">
    <label className="label-search">
      <input
        type="text"
        placeholder="Pesquisar por título, descrição ou observações"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
    </label>
    <button onClick={handleSearchClick} className="search-button">Pesquisar</button>
  </div>
</div>

        <div className="ticket-table-container">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Data de Criação</th>
                <th>Última Atualização</th>
                <th>Departamento</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="clickable-row">
                  <td onClick={() => handleViewDetails(ticket)}>{ticket.title}</td>
                  <td onClick={() => handleViewDetails(ticket)}>{ticket.createdAt}</td>
                  <td onClick={() => handleViewDetails(ticket)}>{ticket.updatedAt}</td>
                  <td onClick={() => handleViewDetails(ticket)}>{ticket.department}</td>
                  <td
                    onClick={() => handleViewDetails(ticket)}
                    className={`status ${statusNames[ticket.id_state]}`}
                  >
                    {statusNames[ticket.id_state] || "Status desconhecido"}
                  </td>
                  {(ticket.id_state === 1 || ticket.id_state === 3 || admin === 1) && (
                    <td>
                      <button
                        className="edit-button"
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   handleEditTicket(ticket);
                        // }}
                        onClick={() => handleEditTicket(ticket)}
                      >
                        Editar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {hasMore && (
                <tr ref={loader}>
                  <td colSpan={6} style={{ height: '20px', textAlign: 'center' }}>
                    Carregando...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TicketList;