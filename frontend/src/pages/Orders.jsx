import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {
const [orders, setOrders] = useState([]);
const [customers, setCustomers] = useState([]);
const [products, setProducts] = useState([]);
const [selectedOrder, setSelectedOrder] = useState(null);

const [formData, setFormData] = useState({
customer_id: "",
product_id: "",
quantity: "",
});

const fetchOrders = async () => {
try {
const response = await api.get("/orders");
setOrders(response.data);
} catch (error) {
console.error(error);
}
};

const fetchCustomers = async () => {
try {
const response = await api.get("/customers");
setCustomers(response.data);
} catch (error) {
console.error(error);
}
};

const fetchProducts = async () => {
try {
const response = await api.get("/products");
setProducts(response.data);
} catch (error) {
console.error(error);
}
};

useEffect(() => {
fetchOrders();
fetchCustomers();
fetchProducts();
}, []);

const getCustomer = (id) => {
return customers.find(
(customer) => customer.id === id
);
};

const getProduct = (id) => {
return products.find(
(product) => product.id === id
);
};

const createOrder = async (e) => {
e.preventDefault();


try {
  await api.post("/orders", {
    customer_id: Number(formData.customer_id),
    product_id: Number(formData.product_id),
    quantity: Number(formData.quantity),
  });

  setFormData({
    customer_id: "",
    product_id: "",
    quantity: "",
  });

  fetchOrders();
  fetchProducts();
} catch (error) {
  console.error(error);
  alert(error.response?.data?.detail || "Error");
}


};

const deleteOrder = async (id) => {
try {
await api.delete(`/orders/${id}`);


  fetchOrders();
} catch (error) {
  console.error(error);
}


};

return ( <div> <h1 className="text-3xl font-bold mb-6">
Orders </h1>


  {/* Create Order Form */}

  <form
    onSubmit={createOrder}
    className="bg-white p-6 rounded-xl shadow mb-6"
  >
    <h2 className="text-xl font-semibold mb-4">
      Create Order
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <select
        value={formData.customer_id}
        onChange={(e) =>
          setFormData({
            ...formData,
            customer_id: e.target.value,
          })
        }
        className="border p-3 rounded-lg"
        required
      >
        <option value="">
          Select Customer
        </option>

        {customers.map((customer) => (
          <option
            key={customer.id}
            value={customer.id}
          >
            {customer.full_name}
          </option>
        ))}
      </select>

      <select
        value={formData.product_id}
        onChange={(e) =>
          setFormData({
            ...formData,
            product_id: e.target.value,
          })
        }
        className="border p-3 rounded-lg"
        required
      >
        <option value="">
          Select Product
        </option>

        {products.map((product) => (
          <option
            key={product.id}
            value={product.id}
          >
            {product.name} (Stock: {product.quantity})
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={(e) =>
          setFormData({
            ...formData,
            quantity: e.target.value,
          })
        }
        className="border p-3 rounded-lg"
        required
      />
    </div>

    <button
      type="submit"
      className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
    >
      Create Order
    </button>
  </form>

  {/* Orders Table */}

  <div className="bg-white rounded-xl shadow overflow-hidden">
    <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b bg-gray-50">
          <th className="p-4 text-left">
            Order ID
          </th>

          <th className="p-4 text-left">
            Customer
          </th>

          <th className="p-4 text-left">
            Product
          </th>

          <th className="p-4 text-left">
            Quantity
          </th>

          <th className="p-4 text-left">
            Total Amount
          </th>

          <th className="p-4 text-left">
            Action
          </th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => (
          <tr
            key={order.id}
            className="border-b hover:bg-gray-50"
          >
            <td className="p-4">
              {order.id}
            </td>

            <td className="p-4">
              {getCustomer(order.customer_id)?.full_name}
            </td>

            <td className="p-4">
              {getProduct(order.product_id)?.name}
            </td>

            <td className="p-4">
              {order.quantity}
            </td>

            <td className="p-4">
              ₹{order.total_amount}
            </td>

            <td className="p-4 space-x-2">
              <button
                onClick={() =>
                  setSelectedOrder(order)
                }
                className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
              >
                View
              </button>

              <button
                onClick={() =>
                  deleteOrder(order.id)
                }
                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  </div>

  {/* Order Details Modal */}

  {selectedOrder && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-[550px]">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">
            Order Details
          </h2>

          <button
            onClick={() =>
              setSelectedOrder(null)
            }
            className="text-gray-500 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <p>
            <strong>Order ID:</strong>{" "}
            {selectedOrder.id}
          </p>

          <p>
            <strong>Customer:</strong>{" "}
            {
              getCustomer(
                selectedOrder.customer_id
              )?.full_name
            }
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {
              getCustomer(
                selectedOrder.customer_id
              )?.email
            }
          </p>

          <p>
            <strong>Product:</strong>{" "}
            {
              getProduct(
                selectedOrder.product_id
              )?.name
            }
          </p>

          <p>
            <strong>SKU:</strong>{" "}
            {
              getProduct(
                selectedOrder.product_id
              )?.sku
            }
          </p>

          <p>
            <strong>Unit Price:</strong> ₹
            {
              getProduct(
                selectedOrder.product_id
              )?.price
            }
          </p>

          <p>
            <strong>Quantity:</strong>{" "}
            {selectedOrder.quantity}
          </p>

          <p className="text-lg font-bold text-green-600">
            Total Amount: ₹
            {selectedOrder.total_amount}
          </p>
        </div>

        <button
          onClick={() =>
            setSelectedOrder(null)
          }
          className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  )}
</div>


);
};

export default Orders;
