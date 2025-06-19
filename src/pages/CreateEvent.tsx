import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import EventForm from "@/components/EventForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CreateEvent = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Krijo Event të Ri</h1>
            <p className="mt-2 text-sm text-gray-600">Plotësoni detajet për të krijuar eventin tuaj</p>
          </div>
          <EventForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateEvent;
