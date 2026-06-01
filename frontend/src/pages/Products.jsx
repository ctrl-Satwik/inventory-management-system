import { useEffect, useState } from "react";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: "",
  });

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const startEdit = (product) => {
    setEditingId(product.id);

    setFormData({
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: product.quantity,
    });
    };

  const createProduct = async (e) => {
    e.preventDefault();

    if (Number(formData.quantity) < 0) {
    alert("Product quantity cannot be negative");
    return;
  }

    try {
      await api.post("/products", {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      });

      setFormData({
        name: "",
        sku: "",
        price: "",
        quantity: "",
      });

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Error");
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    if (Number(formData.quantity) < 0) {
    alert("Product quantity cannot be negative");
    return;
  }

    try {
        await api.put(
        `/products/${editingId}`,
        {
            ...formData,
            price: Number(formData.price),
            quantity: Number(formData.quantity),
        }
        );

        setEditingId(null);

        setFormData({
        name: "",
        sku: "",
        price: "",
        quantity: "",
        });

        fetchProducts();
    } catch (error) {
        console.error(error);
    }
};

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <form
        onSubmit={
            editingId
            ? updateProduct
            : createProduct
        }
        className="bg-white p-6 rounded-xl shadow mb-6"
        >
        <h2 className="text-xl font-semibold mb-4">
            {editingId
                ? "Update Product"
                : "Add Product"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            />

            <input
            name="sku"
            placeholder="SKU"
            value={formData.sku}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            />

            <input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            />

            <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            />
        </div>

        <button
            type="submit"
            className={`mt-4 text-white px-5 py-2 rounded-lg ${
                editingId
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            >
            {editingId
                ? "Update Product"
                : "Add Product"}
        </button>
        </form>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
            <thead>
            <tr className="border-b bg-gray-50">
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">SKU</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Action</th>
            </tr>
            </thead>

            <tbody>
            {products.map((product) => (
                <tr
                key={product.id}
                className="border-b hover:bg-gray-50"
                >
                <td className="p-4">{product.id}</td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.sku}</td>
                <td className="p-4">₹{product.price}</td>

                <td className="p-4">
                    <span
                    className={`px-3 py-1 rounded-full text-sm ${
                        product.quantity < 10
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                    >
                    {product.quantity}
                    </span>
                </td>

                <td className="p-4 space-x-4">
                    <button
                        onClick={() => startEdit(product)}
                        className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => deleteProduct(product.id)}
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
    </div>
  );
}

export default Products;