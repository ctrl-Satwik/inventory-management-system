import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <h2>Loading...</h2>;

return (
  <div>
    <h1 className="text-3xl font-bold mb-6">
      Dashboard
    </h1>

    {/* Stats Cards */}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-blue-500 text-black rounded-xl shadow p-6">
        <h3 className="text-black font-semibold">
          Products
        </h3>

        <p className="text-4xl font-bold mt-2">
          {data.total_products}
        </p>
      </div>

      <div className="bg-green-500 text-black rounded-xl shadow p-6">
        <h3 className="text-black font-semibold">
          Customers
        </h3>

        <p className="text-4xl font-bold mt-2">
          {data.total_customers}
        </p>
      </div>

      <div className="bg-purple-500 text-black rounded-xl shadow p-6">
        <h3 className="text-black font-semibold">
          Orders
        </h3>

        <p className="text-4xl font-bold mt-2">
          {data.total_orders}
        </p>
      </div>
    </div>

    {/* Low Stock Section */}

    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="p-5 border-b">
        <h2 className="text-xl font-semibold text-red-600">
          Low Stock Products
        </h2>
      </div>

      {data.low_stock_products.length === 0 ? (
        <div className="p-6 text-gray-500">
          No low stock products
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 text-left">
                Product
              </th>

              <th className="p-4 text-left">
                SKU
              </th>

              <th className="p-4 text-left">
                Quantity
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {data.low_stock_products.map(
              (product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    {product.name}
                  </td>

                  <td className="p-4">
                    {product.sku}
                  </td>

                  <td className="p-4">
                    {product.quantity}
                  </td>

                  <td className="p-4">
                    ₹{product.price}
                  </td>

                  <td className="p-4 text-center md:text-left">
                    <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      Low Stock
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  </div>
);
}

export default Dashboard;