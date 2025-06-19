import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center min-h-[calc(100vh-140px)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Regjistrohu në Platformë</h1>
            <p className="mt-2 text-sm text-gray-600">
              Krijoni një llogari duke përdorur email-in tuaj universitar për të konfirmuar statusin tuaj si student
            </p>
          </div>
          
          {/* Register Form */}
          <div className="bg-white shadow-lg rounded-xl p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Krijoni një llogari</h2>
              <p className="text-sm text-gray-600 mb-6">Bashkohuni me EventHub dhe filloni të eksploroni eventet</p>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Emri i plotë
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Agim Krasniqi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email-i universitar
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="emri@umib.net"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Fjalëkalimi
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmoni fjalëkalimin
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Regjistrohu
              </button>
            </form>

            <div className="text-center">
              <span className="text-sm text-gray-600">Keni tashmë një llogari? </span>
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-blue-600 hover:underline"
              >
                Kyçuni
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register; 