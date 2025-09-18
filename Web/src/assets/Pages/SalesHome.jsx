import { useSelector, } from "react-redux";
import { Link, } from 'react-router-dom';
import { useEffect, useState } from "react";
import { format } from 'date-fns';
export default function SalesHome() {
    const user = useSelector((state) => state.user);
    const [cutQueue, setCutQueue] = useState();
    const [veneerQueue, setVeneerQueue] = useState();




    const DateFormatter = (date) => {
        if (!date) return "Invalid Date";
        const parsedDate = date instanceof Date ? date : new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "Invalid Date";
        }

        return format(parsedDate, 'MMMM d, yyyy -- hh:mm a');
    };
    

    useEffect(() => {
        const fetchCuts = async () => {
            try {
                const res = await fetch('/api/order/cut-queue');
                const data = await res.json();
                setCutQueue(data);
            }
            catch (error) {
                console.log(error);
            }
        };
        const fetchVeneers = async () => {
            try {
                const res = await fetch('/api/order/veneer-queue');
                const data = await res.json();
                setVeneerQueue(data);
            }
            catch (error) {
                console.log(error);
            }
        };
        fetchCuts();
        fetchVeneers();
    },[])



    return (
        <div className="m-10">

            <div className='mb-7 flex justify-between'>

                <div className=" text-left">
                    <p className='text-indigo-900'><strong>ID:</strong> &nbsp; &nbsp;<span className='text-black'>{user.currentUser.id}</span></p>
                    <p className='text-indigo-900'><strong>Name:</strong> &nbsp;&nbsp;<span className='text-black'>{user.currentUser.name.toUpperCase()}</span></p>  
                    <p className='text-indigo-900'><strong>Department:</strong> &nbsp;&nbsp;<span className='text-black'>{user.currentUser.department.toUpperCase()}</span></p> 
                </div>

                


            </div>
            <div className="flex justify-center gap-6">
                <Link to={'/sales/customer'}> <button className="flex h-10 w-50 items-center justify-center rounded-md bg-indigo-900 p-6 text-stone-300 hover:cursor-pointer hover:opacity-70">Find Customer</button></Link>
            </div>

            <div className="mb-15">
                <p className="mb-2 font-bold text-indigo-900">Cut Queue</p>
                <div className="inline-flex gap-4 rounded-lg bg-purple-400 p-4">
                    
                    {cutQueue &&
                        cutQueue.length > 0 &&
                        cutQueue.map(([order,cuts, est, esd,name]) => {
                            if(cuts.length >0){ 
                                return (
                                    <Link to={`/sales/order/${order.id}`}>
                                        <div className="rounded-md bg-indigo-950 p-4 text-center text-white hover:opacity-60" key={order.id}>
                                            <p>Order id:&nbsp;{order.id}</p>
                                            <p>Customer id:&nbsp; {order.customer_id}</p>
                                            <p>Name:&nbsp; {name}</p>
                                            <p>estimated time:&nbsp; {est}mins</p>
                                            <p>estimated date:&nbsp; {DateFormatter(esd)}</p>
                                        </div>
                                    </Link>
                                );
                            }
                            return null;
                        })}

                           
                           
                    
                </div>
            </div>


            <div className="mb-6">
                <p className=" mb-2 font-bold text-indigo-900">Veneer Queue</p>
                <div className="inline-flex gap-4 rounded-lg bg-purple-400 p-4">

                    {veneerQueue &&
                        veneerQueue.length > 0 &&
                        veneerQueue.map(([order, veneers, est, esd, name]) => {

                            if (veneers.length > 0) {
                                return (
                                    <Link to={`/sales/order/${order.id}`}>
                                        <div className="rounded-md bg-indigo-950 p-4 text-center text-white hover:opacity-60" key={order.id}>
                                            <p>Order id:&nbsp;{order.id}</p>
                                            <p>Customer id:&nbsp; {order.customer_id}</p>
                                            <p>Name:&nbsp; {name}</p>
                                            <p>estimated time:&nbsp; {est}mins</p>
                                            <p>estimated date:&nbsp; {DateFormatter(esd)}</p>
                                        </div>
                                    </Link>
                                );
                            }
                            return null;
                            
                        })}
                </div>
            </div>


            


        </div>
    )
}