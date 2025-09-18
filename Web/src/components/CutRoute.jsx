import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';


export default function CutRoute() {
    const { currentUser } = useSelector((state) => state.user);

    return currentUser.department === 'cut' ? <Outlet /> : <Navigate to='/' />
}