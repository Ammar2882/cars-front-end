import { Route, Routes, Navigate } from 'react-router-dom';
import Main from './components/Main';
import Signup from './components/Signup';
import Login from './components/Login';
import Categories from './components/CategoriesMain'

function App(): JSX.Element {
  const user = localStorage.getItem('token');

  return (
    <Routes>
      {user && <Route path="/" element={<Main />} />}
      {user && <Route path="/categories" element={<Categories />} />}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;
