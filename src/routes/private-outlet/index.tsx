import { Navigate } from 'react-router-dom';
import PrivateLayout from '@/@components/layouts/private';

const PrivateOutlet = () => {
  const authData = localStorage.getItem('auth');
  const auth = authData ? JSON.parse(authData) : null;

  const isLogged = auth && auth.token && auth.user.role.name === 'Admin';

  return isLogged ? <PrivateLayout /> : <Navigate to="/login" />;
};

export default PrivateOutlet;
