import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';

const CustomerProfile = () => {
    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        address: "",
        id: "",
        totalOrders: 0,
    });
    const [orders, setOrders] = useState([]);
    const {id } = useParams();

    const handleUpdate = (e) => {
        e.preventDefault();
        console.log("Updated customer:", customer);
    };

    useEffect(() => {
        const fetchAPI = async () => {
            try {
                const res = await fetch(`/api/customer/get/${id}`);
                const data = await res.json();
                setCustomer(data);
            }
            catch (error) {
                console.log(error);
            }
        };
        const fetchOrders = async () => {
            try {
                const res = await fetch(`/api/customer/get-orders/${id}`);
                const data = await res.json();
                setOrders(data);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchAPI();
        fetchOrders();

    },[]);
    const DateFormatter = (date) => {
        if (!date) return "Invalid Date";
        const parsedDate = date instanceof Date ? date : new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "Invalid Date";
        }

        return format(parsedDate, 'MMMM d, yyyy -:- hh:mm a');
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-1/4 bg-gray-800 p-6 text-white">
                <h2 className="mb-4 text-xl font-bold">Customer Profile</h2>
                <ul className="mb-5 rounded-lg bg-indigo-950 p-2">
                    <li className="p-2"><strong>Id:</strong> {customer.id}</li>
                    <li className="p-2"><strong>Name:</strong> {customer.name}</li>
                    <li className="p-2"><strong>Phone:</strong> {customer.phone}</li>
                    <li className="p-2"><strong>Address:</strong> {customer.address}</li>
                </ul>
                
                <button onClick={handleUpdate} className="mr-14 rounded-lg bg-indigo-900 px-4 py-2 text-white">
                    Update
                </button>
                <Link to={`/sales/create/${customer.id }`}> <button className="mt-4 rounded-lg bg-indigo-900 px-4 py-2 text-white">Create Order</button></Link>
            </div>

            <div className="grid w-3/4 grid-cols-2 gap-4 p-6">
                {orders &&
                    orders.length > 0 &&
                    orders.map((order) => {
                        return (
                            <Link to={`/sales/order/${order.id}`}>
                                <div className="rounded-md bg-indigo-950 p-4 text-center text-white hover:opacity-60" key={order.id}>
                                    <p>Order id:&nbsp;{order.id}</p>
                                    <p>Price:&nbsp; {order.total_price}$</p>
                                    <p>Delivered on:&nbsp; {order.real_date}</p>
                                    <p>Created on:&nbsp; {DateFormatter(order.order_date)}</p>
                                    <p>estimated date:&nbsp; {DateFormatter(order.estimated_delivery_date)}</p>
                                </div>
                            </Link>
                        )
                        
                    }) }
                
            </div>
        </div>
    );
};

export default CustomerProfile;
