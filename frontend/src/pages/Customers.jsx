import { useEffect, useState } from "react";
import api from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createCustomer = async (e) => {
    e.preventDefault();

    try {
      await api.post("/customers", formData);

      setFormData({
        full_name: "",
        email: "",
        phone: "",
      });

      fetchCustomers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Error");
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Customers
      </h1>

      {/* Add Customer Form */}

      <form
        onSubmit={createCustomer}
        className="bg-white p-6 rounded-xl shadow mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          Add Customer
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Add Customer
        </button>
      </form>

      {/* Customer Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-6"
                >
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    {customer.id}
                  </td>

                  <td className="p-4">
                    {customer.full_name}
                  </td>

                  <td className="p-4">
                    {customer.email}
                  </td>

                  <td className="p-4">
                    {customer.phone}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        deleteCustomer(customer.id)
                      }
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default Customers;