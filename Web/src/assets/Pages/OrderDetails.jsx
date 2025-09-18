import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
const LumberFactory = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState("");
    const [customer, setCustomer] = useState(""); 

    const [cuts, setCuts] = useState();
    const [veneers, setVeneers] = useState();
    const { id } = useParams();

    const DateFormatter = (date) => {
        if (!date) return "Invalid Date"; 
        const parsedDate = date instanceof Date ? date : new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "Invalid Date"; 
        }

        return format(parsedDate, 'MMMM d, yyyy -- hh:mm a');
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/order/display/${id}`);
                const data = await res.json();
                const { order, cuts, veneers } = data;
                setOrder(order);
                setCuts(cuts);
                setVeneers(veneers);



            }
            catch (err) {
                console.log(err);
            }
        };
        const fetchCustomer = async () => {
            try {
                const res = await fetch(`/api/customer/get/${order.customer_id}`);
                const data = await res.json();
                setCustomer(data);



            }
            catch (err) {
                console.log(err);
            }
        }
        fetchOrder();
        fetchCustomer();
    }, [order]);

    const formmatedPrice = (price) => {
        if (!price) return "N/A";
        const formatted = price.toFixed(2);

        return formatted;
    };

    

    

    const handleCancel = async () => {
        const res = await fetch(`/api/order/cancel/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        navigate(`/sales`);
    };

    return (
        <div className="m-10 mx-auto w-3/4 rounded-lg bg-gray-800 p-6 text-white">
            <h2 className="text-center text-2xl font-bold">Lumber Factory</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <p><strong>Employee:</strong> {order.user_id}</p>
                <p><strong>Order Date:</strong> {DateFormatter(order.order_date)}</p>
                <p><strong>Customer ID:</strong> {order.customer_id}</p>
                <p><strong>Estimated Delivery:</strong> {DateFormatter(order.estimated_delivery_date)}</p>
                <p><strong>Customer Name:</strong> {customer.name}</p>

                {order.real_date ? <p><strong>Delivery Date:</strong> {DateFormatter(order.real_date)}</p> : <p><strong>Delivery Date:</strong> &nbsp; Order still under process</p>}
                {order.start_cut && <p>Started cut</p> }
                {order.start_veneer && <p>Started veneer</p> }
            </div>
            <div className=" m-25 mt-4 flex flex-wrap justify-around rounded bg-gray-700 p-5">

                <div>
                    <h3 className=" text-center text-lg font-bold">Cuts</h3>
                    <div className="flex justify-center gap-2 text-sm">
                    <table className=" mx-auto border-collapse border border-gray-500">
                        <thead>
                            <tr>
                                <th className="border border-gray-500 px-4 py-2">Width</th>
                                <th className="border border-gray-500 px-4 py-2">Height</th>
                                <th className="border border-gray-500 px-4 py-2">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cuts && cuts.map((cut, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-500 px-4 py-2">{cut.width}</td>
                                    <td className="border border-gray-500 px-4 py-2">{cut.height}</td>
                                    <td className="border border-gray-500 px-4 py-2">{cut.unit_price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </div>

                
                <div>
                    <h3 className=" text-center text-lg font-bold">Veneers</h3>
                    <div className="flex justify-center gap-2 text-sm">
                        <table className="border-collapse border border-gray-500">
                            <thead>
                                <tr>
                                    <th className="border border-gray-500 px-4 py-2">Width</th>
                                    <th className="border border-gray-500 px-4 py-2">Height</th>
                                    <th className="border border-gray-500 px-4 py-2">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {veneers && veneers.map((veneer, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-500 px-4 py-2">{veneer.width}</td>
                                        <td className="border border-gray-500 px-4 py-2">{veneer.height}</td>
                                        <td className="border border-gray-500 px-4 py-2">{(veneer.meter_sqr_price * (veneer.width / 100) * (veneer.height / 100)).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
                

            </div>
            <p className="mt-4 text-center"><strong>Total Price:</strong> {formmatedPrice(order.total_price)}$</p>
            <div className="mt-4 flex justify-around">
                <button className="rounded bg-green-500 px-4 py-2">Make Payment</button>
                <button onClick={handleCancel} className="rounded bg-red-500 px-4 py-2">Cancel Order</button>
            </div>
        </div>
    );
};

export default LumberFactory;
