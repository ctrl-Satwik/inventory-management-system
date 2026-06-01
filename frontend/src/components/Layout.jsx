import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { Menu, X } from "lucide-react";

function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Customers", path: "/customers" },
    { name: "Orders", path: "/orders" },
  ];


useEffect(() => {
  if (sidebarOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed lg:static
          top-0 left-0
          lg:sticky lg:top-0
          h-dvh
          overflow-y-auto
          w-64
          bg-slate-900
          text-white
          z-50
          transform
          transition-transform
          duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold">
            Inventory App
          </h2>

          {/* Close Button Mobile */}

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`block px-4 py-3 rounded-lg transition ${
                location.pathname === item.path
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}

      <div className="flex-1 flex flex-col min-h-screen">

        {/* Mobile Header */}

        <header className="lg:hidden bg-white shadow px-4 py-3 flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={28} />
          </button>

          <h1 className="ml-4 font-bold text-lg">
            Inventory App
          </h1>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;