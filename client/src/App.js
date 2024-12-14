import './App.css';
import LoginPage from './Pages/LoginPage/LoginPage.tsx';
import NewTicketPage from './Pages/NewTicketPage/NewTicketPage.tsx';
import MainPage from './Pages/MainPage/MainPage.tsx';
import TicketDetails from './Pages/TicketDetails/TicketDetails.tsx';
import UserPage from './Pages/UserPage/UserPage.tsx';
import EditableTicketDetails from './Pages/EditableTicketDetails/EditableTicketDetails.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return ( 
    <BrowserRouter>
      <Routes>
        <Route path="/newticket" element={<NewTicketPage />} />
        <Route path="/detailsticket" element={<TicketDetails />} />
        <Route path="/user" element={<UserPage/>} />
        <Route path="/editticket" element={<EditableTicketDetails />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/mainticket" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
