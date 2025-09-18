import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';


export default function VeneerRoute() {
    const { currentUser } = useSelector((state) => state.user);

    return currentUser.department === 'veneer' ? <Outlet /> : <Navigate to='/' />
}