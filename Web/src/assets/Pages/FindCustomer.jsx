import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerInfo from '../../components/CustomerInfo';

export default function FindCustomer() {
    const [phone, setPhone] = useState();
    const [customer, setCustomer] = useState();
    const [allCustomers, SetAllCustomers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);


    useEffect(() => {
        const allcustomers = async () => {
            try {
                const res = await fetch('/api/customer/getAll');
                const data = await res.json();
                console.log(data);
                SetAllCustomers(data);
            } catch (err) {
                console.log(err);
            }
        }
        allcustomers();
        console.log(allCustomers);
        
    }, []);


    const filteredCustomers = allCustomers.filter((cust) =>
        cust.phone.includes(phone || "")
    );

    const PhoneAutocomplete = ({ allCustomers }) => {
        const [query, setQuery] = useState("");
        const [showDropdown, setShowDropdown] = useState(false);

        const filteredCustomers = allCustomers.filter((cust) =>
            cust.phone.includes(query)
        );
    

        const handleSelect = (phone) => {
            setQuery(phone);
            setShowDropdown(false);
        };

    }
    

    const handleSubmit = async (e) => {

            e.preventDefault();
            const res = await fetch("/api/customer/get", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone }),
            });

            const data = await res.json();
            if (!data) {
                setCustomer(null);
            }
            setCustomer(data);


        
    };
    const handleChange = (e) => {
        setPhone(e.target.value);
    };

        return (
            <div className="min-h-screen bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="font-serif text-4xl text-indigo-950">Find Customer</h1>
                    <form onSubmit={handleSubmit} className="relative flex items-center space-x-2">
                        <div className="relative w-64">
                            <input
                                type="text"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay to allow click
                                className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                                required
                            />

                            {showDropdown && filteredCustomers.length > 0 && (
                                <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded border bg-white shadow">
                                    {filteredCustomers.map((cust) => (
                                        <li
                                            key={cust.phone}
                                            onClick={() => {
                                                setPhone(cust.phone);
                                                setShowDropdown(false);
                                            }}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {cust.phone} {cust.name && `- ${cust.name}`}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
                        >
                            Submit
                        </button>
                    </form>
                </div>

                <hr className="mb-8 border-gray-300" />

                <div className="flex space-x-4">
                    <Link to='/sales/customer/create'>
                        <button className="rounded-full bg-indigo-900 px-6 py-2 text-stone-300 hover:cursor-pointer hover:opacity-60">
                        Create Customer
                    </button>
                    </Link>
                    
                </div>
            {customer ? (
                    <Link to={`/sales/customer/${customer.id}`}>
                        < button className='m-10 hover:cursor-pointer hover:opacity-60'>
                            <CustomerInfo customer={customer} />
                        </button>
                    </Link>
                        )  : (
                        allCustomers.map((c) => {
                            return(
                            <Link to={`/sales/customer/${c.id}`} key={c.id}>
                                <button className='m-10 hover:cursor-pointer hover:opacity-60'>
                                    <CustomerInfo customer={c} />
                                </button>
                            </Link>
                            )
                        })
                    )}
                    
                
            </div>
        );
};
