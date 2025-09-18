import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';

import userSlice, { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserStart, signoutUserFailure, signoutUserSuccess } from "../redux/user/userSlice";



const Header = () => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            dispatch(signoutUserStart());
            const res = await fetch('/api/auth/signout');
            const data = await res.json();
            if (data.success === false) {
                dispatch(signoutUserFailure(data.message));
                return;
            }
            dispatch(signoutUserSuccess(data));
            navigate('/');
        } catch (error) {
            dispatch(signoutUserFailure(error.message));
        }
    };


    return (
        <header className="bg-purple-600 text-white p-6 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Lumber Factory</h1>
                    {user.currentUser && <p>{user.currentUser.department} Department</p> }
                </div>
                
                {user.currentUser && <a href="/sales" className=" text-white p-6 rounded-lg w-10 h-10 hover:underline">Home</a>}
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>

                <nav>
                    {user.currentUser && <button onClick={handleSignOut} className="flex items-center justify-center text-white bg-red-950 p-6 rounded-lg w-10 h-10">Exit</button> }

                </nav>
            </div>
        </header>
    );
};

export default Header;
