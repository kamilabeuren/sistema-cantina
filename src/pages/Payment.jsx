import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleFinishOrder = (event) => {
    event.preventDefault();

    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    const order = {
      number: orderNumber,
      customerName,
      paymentMethod,
      status: "Recebido",
    };

    localStorage.setItem("order", JSON.stringify(order));

    navigate(`/order/${orderNumber}`);
  };

  return (
    <div>
      <h1>Pagamento</h1>

      <form onSubmit={handleFinishOrder}>
        <div>
          <label>Nome do cliente</label>

          <input
            type="text"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            required
          />
        </div>

        <div>
          <label>Forma de pagamento</label>

          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            required
          >
            <option value="">Selecione</option>
            <option value="Pix">Pix</option>
            <option value="Cartão">Cartão</option>
            <option value="Dinheiro">Dinheiro</option>
          </select>
        </div>

        <button type="submit">
          Finalizar pedido
        </button>
      </form>
    </div>
  );
}

export default Payment;