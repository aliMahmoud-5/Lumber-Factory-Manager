import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';


export default function SalesRoute() {
    const { currentUser } = useSelector((state) => state.user);

    return currentUser.department === 'sales' ? <Outlet /> : <Navigate to='/' />
}