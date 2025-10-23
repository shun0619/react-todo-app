import { useEffect } from 'react'
import  Auth  from './component/Auth';
import  Todo  from './component/Todo';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import type { CsrfToken } from './types';


function App() {

  useEffect(() => {
    axios.defaults.withCredentials = true;
    const getCsrfToken = async () => {
      const {data} = await axios.get<CsrfToken>(
        `${import.meta.env.VITE_APP_API_URL}/csrf`
      )
      console.log(data.csrf_token);
      axios.defaults.headers.common['X-CSRF-Token'] = data.csrf_token;
    }
    getCsrfToken();
    }, []);
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
