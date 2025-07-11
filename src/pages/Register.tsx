import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import RegisterForm from "@/components/RegisterForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Register = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
