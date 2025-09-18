import { useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signinFailure, signinStart, signinSuccess } from '../../redux/user/userSlice';




export default function SignIn() {
    const [formData, setFromData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const handleChange = (e) => {
        setFromData(
            {
                ...formData,
                [e.target.id]: e.target.value,
            }
        );
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(signinStart());
            const res = await fetch('/api/auth/signin',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );
            const data = await res.json();
            console.log(data.department);

            if (data.success === false) {
                dispatch(signinFailure(data.message));

                return;
            }
            dispatch(signinSuccess(data));
            if (data.department === 'sales') {
                Navigate('/sales');
            } else if (data.department === 'cut') {
                Navigate('/cut-dep');
            }
            else if (data.department === 'veneer') {
                Navigate('/veneer-dep');
            }
        } catch (error) {
            dispatch(signinFailure(error.message));
        }

    };


    return (
        <div className='p-3 mx-auto max-w-lg'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="text" placeholder="Ener Your ID" className="border p-3 rounded-lg" id="id" onChange={handleChange} />
                <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" onChange={handleChange} />
                <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'SignIn'}</button>

            </form>
            
            {error && <p className='text-red-500 mt-5'>{error}</p>}
        </div>
    );
}
