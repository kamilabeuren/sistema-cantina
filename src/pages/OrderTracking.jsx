import { useParams } from "react-router-dom";

function OrderTracking() {
  const { id } = useParams();

  const order = JSON.parse(localStorage.getItem("order"));

  return (
    <div>
      <h1>Pedido confirmado!</h1>

      <p>Número do pedido: #{id}</p>

      <p>Cliente: {order?.customerName}</p>

      <p>Forma de pagamento: {order?.paymentMethod}</p>

      <p>Status: {order?.status}</p>

      <h2>Comprovante</h2>

      <p>Pedido #{id}</p>

      <p>Obrigado pela sua compra!</p>
    </div>
  );
}

export default OrderTracking;