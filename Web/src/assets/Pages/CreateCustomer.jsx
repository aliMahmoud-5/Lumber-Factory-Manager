import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const CreateCustomer = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/customer/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);
            navigate(`/sales/customer/${data.id}`);

        }
        catch(err) {
            console.log({err});
        }
        
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <h1 className="text-indigo-950 text-3xl font-bold mb-6">Create Customer</h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6 w-96"
            >
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Phone number</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-900 text-white p-2 rounded font-bold hover:cursor pointer hover:opacity-60"
                >
                    Create
                </button>
            </form>
        </div>
    );
};

export default CreateCustomer;
