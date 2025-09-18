import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SalesRoute from './components/SalesRoute';
import CutRoute from './components/CutRoute';
import VeneerRoute from './components/VeneerRoute';
import SignIn from './assets/Pages/SignIn.jsx';
import SalesHome from './assets/Pages/SalesHome';
import CutHome from './assets/Pages/CutHome';
import VeneerHome from './assets/Pages/VeneerHome';
import CreateOrder from './assets/Pages/CreateOrder';
import FindCustomer from './assets/Pages/FindCustomer';
import CreateCustomer from './assets/Pages/CreateCustomer';
import CustomerProfile from './assets/Pages/CustomerProfile';
import OrderDetails from './assets/Pages/OrderDetails';
import Test from './assets/Pages/Test';
import Header from './components/Header';




export default function App() {
    return <BrowserRouter>
        <Header/>

        <Routes>

            <Route path="/" element={<SignIn />} />
            <Route path="/test" element={<Test />} />

            <Route element={<SalesRoute />}>
                <Route path="/sales" element={<SalesHome />} />
                <Route path="/sales/create/:id" element={<CreateOrder />} />
                <Route path="/sales/customer" element={<FindCustomer />} />
                <Route path="/sales/customer/create" element={<CreateCustomer />} />
                <Route path="/sales/customer/:id" element={<CustomerProfile />} />
                <Route path="/sales/order/:id" element={<OrderDetails />} />

            </Route>

            <Route element={<CutRoute />}>
                <Route path="/cut-dep" element={<CutHome />} />
            </Route>

            <Route element={<VeneerRoute />}>
                <Route path="/veneer-dep" element={<VeneerHome />} />
            </Route>

        </Routes>

    </BrowserRouter>
}
