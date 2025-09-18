import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

export default function Test() {
    const { id } = useParams();
    const [cutChecked, setCutChecked] = useState([{ id: "", bool: false }]);
    const [veneerChecked, setVeneerChecked] = useState([{ id: "", bool: false }]);
    const { currentUser } = useSelector((state) => state.user);
    const [customer, setCustomer] = useState(null);
    const [input, setInput] = useState([{ width: "", height: "" }]);
    const [cuts, setCuts] = useState([{ width: "", height: "" }]);
    const [veneers, setVeneers] = useState([{ width: "", height: "" }]);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customer_id: "",
        user_id: "",
        cuts,
        veneers,
    });

    const fetchCustomer = async (id) => {
        try {
            const res = await fetch(`/api/customer/get/${id}`);

            if (!res.ok) {
                throw new Error("Failed to fetch customer data");
            }
            const cust = await res.json();
            setCustomer(cust);
        } catch (error) {
            console.error("Error fetching customer:", error);
        }
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            cuts,
            veneers,
        }));
    }, [cuts, veneers]);




    useEffect(() => {
        if (id && currentUser?.id) {
            setFormData((prev) => ({
                ...prev,
                customer_id: id,
                user_id: currentUser.id,
            }));
            fetchCustomer(id);
        }
    }, [id, currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/order/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to submit order");
            }

            const data = await response.json();
            console.log("Order created successfully:", data);
            navigate(`/sales/order/${data.id}`);
        } catch (error) {
            console.error("Error submitting order:", error);
        }
    };

    const handleCutChange = (index, field, value) => {
        const updatedCuts = [...cuts];
        updatedCuts[index][field] = value;
        setCuts(updatedCuts);
    };

    const handleCheckboxChange = (index, field) => {
        const updatedInput = [...input];
        updatedInput[index][field] = !updatedInput[index][field];
        setInput(updatedInput);

        if (field === "cutChecked") {
            if (updatedInput[index][field]) {
                setCuts([...cuts, { width: updatedInput[index].width, height: updatedInput[index].height }]);
            } else {
                setCuts(cuts.filter((_, i) => i !== index));
            }
        }

        if (field === "veneerChecked") {
            if (updatedInput[index][field]) {
                setVeneers([...veneers, { width: updatedInput[index].width, height: updatedInput[index].height }]);
            } else {
                setVeneers(veneers.filter((_, i) => i !== index));
            }
        }
    };


    const handleInputChange = (index, field, value) => {
        const updatedInput = [...input];
        updatedInput[index][field] = value;
        setInput(updatedInput);

        if (updatedInput[index].cutChecked) {
            const updatedCuts = [...cuts];
            updatedCuts[index] = { width: updatedInput[index].width, height: updatedInput[index].height };
            setCuts(updatedCuts);
        } else {
            setCuts(cuts.filter((_, i) => i !== index));
        }

        if (updatedInput[index].veneerChecked) {
            const updatedVeneers = [...veneers];
            updatedVeneers[index] = { width: updatedInput[index].width, height: updatedInput[index].height };
            setVeneers(updatedVeneers);
        } else {
            setVeneers(veneers.filter((_, i) => i !== index));
        }
        console.log("cuts");
        console.log(cuts);
        console.log("veneers");
        console.log(veneers);
        console.log("input");
        console.log(input);
    };


    const handleVeneerChange = (index, field, value) => {
        const updatedVeneers = [...veneers];
        updatedVeneers[index][field] = value;
        setVeneers(updatedVeneers);
    };

    const addInput = () => {
        setInput([...input, { width: "", height: "" }]);
    };

    const addVeneer = () => {
        setVeneers([...veneers, { width: "", height: "" }]);
    };

    const removeInput = (index) => {
        setInput(input.filter((_, i) => i !== index));
    };

    const removeVeneer = (index) => {
        setVeneers(veneers.filter((_, i) => i !== index));
    };

    const fillVeneerWithCut = (cut) => {

        setVeneers([...veneers, { ...cut }]);
    };

    return (
        <div className="p-4">
            <h1 className="mt-5 mb-4 flex justify-center text-5xl font-bold">Create Order</h1>
            <div className='g-10 mt-30 flex justify-center gap-60'>
                <div className=" mb-30 rounded-lg bg-indigo-900 p-10 text-white">
                    <h1 className='font-bold'>User ID: &nbsp;<span className='font-normal'>{formData.user_id}</span></h1>
                    <h1 className='font-bold'>User name: &nbsp;<span className='font-normal'>{currentUser.name}</span></h1>
                    <h1 className='font-bold'>Customer ID: &nbsp;<span className='font-normal'>{formData.customer_id}</span></h1>
                    <h1 className='font-bold'>
                        Customer name:&nbsp;<span className='font-normal'>{customer?.name || "Loading..."}</span>
                    </h1>
                    <h1 className='font-bold'>
                        Customer phone:&nbsp;<span className='font-normal'>{customer?.phone || "Loading..."}</span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <h2 className="mb-2 text-lg font-semibold">Input <span className='text-sm font-normal'>(in cm)</span></h2>
                        {input.map((inp, index) => (
                            <div key={index} className="mb-2 flex items-center space-x-2">
                                <input
                                    type="number"
                                    placeholder="Width"
                                    value={inp.width}
                                    onChange={(e) =>
                                        handleInputChange(index, "width", e.target.value)
                                    }
                                    className="border rounded p-2 w-1/2"
                                />
                                <input
                                    type="number"
                                    placeholder="Height"
                                    value={inp.height}
                                    onChange={(e) =>
                                        handleInputChange(index, "height", e.target.value)
                                    }
                                    className="border rounded p-2 w-1/2"
                                />


                                <label>
                                    <input type="checkbox"
                                        checked={inp.cutChecked}
                                        onChange={() => handleCheckboxChange(index, "cutChecked")}
                                    />
                                    Cut
                                </label>

                                <label>
                                    <input type="checkbox"
                                        checked={inp.veneerChecked}
                                        onChange={() => handleCheckboxChange(index, "veneerChecked")}
                                    />
                                    Veneer
                                </label>

                                <button
                                    type="button"
                                    onClick={() => removeInput(index)}
                                    className="bg-red-500 text-white py-1 px-2 rounded"
                                >
                                    Remove
                                </button>

                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addInput}
                            className="rounded bg-indigo-900 px-4 py-2 text-white"
                        >
                            Add Input
                        </button>
                    </div>

                    {/*<div>
                        <h2 className="mb-2 text-lg font-semibold">Veneers <span className='text-sm font-normal'>(in cm)</span></h2>
                    {veneers.map((veneer, index) => (
                        <div key={index} className="mb-2 flex items-center space-x-2">
                            <input
                                type="number"
                                placeholder="Width"
                                value={veneer.width}
                                onChange={(e) =>
                                    handleVeneerChange(index, "width", e.target.value)
                                }
                                className="border rounded p-2 w-1/2"
                            />
                            <input
                                type="number"
                                placeholder="Height"
                                value={veneer.height}
                                onChange={(e) =>
                                    handleVeneerChange(index, "height", e.target.value)
                                }
                                className="border rounded p-2 w-1/2"
                            />
                            <button
                                type="button"
                                onClick={() => removeVeneer(index)}
                                className="bg-red-500 text-white py-1 px-2 rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addVeneer}
                        className="rounded bg-indigo-900 px-4 py-2 text-white"
                    >
                        Add Veneer
                    </button>
                </div>*/}

                    <button
                        type="submit"
                        className="mt-4 rounded bg-black px-4 py-2 pr-20 pl-20 text-white"
                    >
                        Submit
                    </button>
                </form>

            </div>
        </div>
    );
}
