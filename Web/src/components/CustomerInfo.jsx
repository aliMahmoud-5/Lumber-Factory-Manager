


export default function CustomerInfo({ customer }) {
    if (!customer) return (<h1 className='text-center text-5xl'>Customer not found please create a new customer </h1>);
    return (
        <div className="mt-8 border-gray-300 p-4 w-full max-w-md rounded-lg border">
            <h2 className="text-2xl font-semibold mb-2">{customer.name }</h2>
            <p>Id:{customer.id} </p>
            <p>Phone: {customer.phone}</p>
            <p>Address: {customer.address}</p>

        </div>
    );
}