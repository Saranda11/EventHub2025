import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token verifikimi mungon ose është i pavlefshëm.");
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      await authApi.verifyEmail(verificationToken);
      setStatus("success");
      setMessage("Email-i juaj është verifikuar me sukses!");
      toast.success("Email-i është verifikuar me sukses!");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Verifikimi i email-it dështoi. Token-i mund të jetë i skaduar ose i pavlefshëm."
      );
      toast.error("Verifikimi i email-it dështoi");
    }
  };

  const handleResendVerification = async () => {
    const email = prompt("Ju lutemi shkruani adresën tuaj të email-it:");
    if (!email) return;

    setIsResending(true);
    try {
      await authApi.resendVerificationEmail(email);
      toast.success("Email-i i verifikimit është dërguar përsëri!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Dështoi dërgimi i email-it të verifikimit");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {status === "loading" && <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />}
                {status === "success" && <CheckCircle className="w-16 h-16 text-green-500" />}
                {status === "error" && <XCircle className="w-16 h-16 text-red-500" />}
              </div>
              <CardTitle className="text-2xl font-bold">
                {status === "loading" && "Duke verifikuar email-in..."}
                {status === "success" && "Email-i u verifikua!"}
                {status === "error" && "Verifikimi dështoi"}
              </CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {status === "success" && (
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Do të ridrejtoheni automatikisht në faqen e kyçjes pas 3 sekondash.
                  </p>
                  <Button asChild className="w-full">
                    <Link to="/login">Kyçuni tani</Link>
                  </Button>
                </div>
              )}

              {status === "error" && (
                <div className="text-center space-y-4">
                  <Button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="w-full"
                    variant="outline"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Duke dërguar...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Dërgo përsëri email-in e verifikimit
                      </>
                    )}
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link to="/register">Kthehu te regjistrimi</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
