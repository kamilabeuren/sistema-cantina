import { Routes, Route } from "react-router-dom";
import Payment from "./pages/Payment";
import OrderTracking from "./pages/OrderTracking";

function App() {
  return (
    <Routes>
      <Route path="/payment" element={<Payment />} />
      <Route path="/order" element={<OrderTracking />} />
    </Routes>
  );
}

export default App;