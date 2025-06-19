import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

// Allowed university domains
const ALLOWED_DOMAINS = [
  "umib.net", // University of Mitrovica "Isa Boletini"
  "uni-pr.edu", // University of Pristina
  "uni-pr.edu.usitestat.com", // University of Pristina (additional domain)
  "pr.ac.rs", // University of Priština (North Mitrovica)
  "uni-prizren.com", // University of Prizren "Ukshin Hoti"
  "uni-gjk.org", // University of Gjakova "Fehmi Agani"
  "ushaf.net", // University of Applied Sciences in Ferizaj
];

const isValidUniversityDomain = (email: string): boolean => {
  if (!email || typeof email !== "string") {
    return false;
  }

  const emailLower = email.toLowerCase();
  const domain = emailLower.split("@")[1];

  if (!domain) {
    return false;
  }

  return ALLOWED_DOMAINS.includes(domain);
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCodeVerification, setShowCodeVerification] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate email domain in real-time
    if (name === "email") {
      if (value && value.includes("@")) {
        if (!isValidUniversityDomain(value)) {
          setEmailError(
            `Vetëm adresat e email-it universitare janë të lejuara. Domenet e pranuara: ${ALLOWED_DOMAINS.join(", ")}`
          );
        } else {
          setEmailError("");
        }
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate university domain
    if (!isValidUniversityDomain(formData.email)) {
      setError(
        `Vetëm adresat e email-it universitare janë të lejuara. Domenet e pranuara: ${ALLOWED_DOMAINS.join(", ")}`
      );
      return;
    }

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Fjalëkalimet nuk përputhen");
      return;
    }

    if (formData.password.length < 6) {
      setError("Fjalëkalimi duhet të jetë të paktën 6 karaktere");
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      setShowCodeVerification(true);
    } catch (err: any) {
      setError(err.message || "Regjistrimi dështoi. Ju lutemi provoni përsëri.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Ju lutemi shkruani kodin 6-shifror të verifikimit");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      await authApi.verifyEmailByCode(formData.email, verificationCode);
      setIsSuccess(true);
      toast.success("Email-i është verifikuar me sukses!");
    } catch (err: any) {
      setError(err.message || "Kodi i verifikimit është i gabuar ose i skaduar");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");

    try {
      await authApi.resendVerificationEmail(formData.email);
      toast.success("Kodi i ri i verifikimit është dërguar në email-in tuaj");
    } catch (err: any) {
      setError(err.message || "Dërgimi i kodit dështoi");
    } finally {
      setIsResending(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">Regjistrimi u krye me sukses!</CardTitle>
          <CardDescription>
            Llogaria juaj është krijuar. Ju lutemi kontrolloni email-in tuaj për të verifikuar llogarinë.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Verifikoni email-in tuaj</p>
                <p className="text-blue-600 mt-1">
                  Ne kemi dërguar një email verifikimi në <strong>{formData.email}</strong>. Klikoni lidhjen në email
                  për të aktivizuar llogarinë tuaj.
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => navigate("/login")} className="w-full">
            Shkoni te kyçja
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showCodeVerification) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <ShieldCheck className="w-16 h-16 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-600">Verifikoni Email-in</CardTitle>
          <CardDescription>
            Ne kemi dërguar një kod 6-shifror në <strong>{formData.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyCode} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-white bg-red-500 rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="code">Kodi i Verifikimit</Label>
              <Input
                id="code"
                name="code"
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                className="text-center text-lg font-mono tracking-widest"
              />
              <p className="text-xs text-gray-600">
                Shkruani kodin 6-shifror që morët në email
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Duke verifikuar...
                </>
              ) : (
                "Verifiko Email-in"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Nuk morët kodin?</p>
            <Button 
              variant="outline" 
              onClick={handleResendCode} 
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Duke dërguar...
                </>
              ) : (
                "Dërgo përsëri kodin"
              )}
            </Button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Kontrolloni email-in tuaj</p>
                <p className="text-blue-600 mt-1">
                  Kodi skadon pas 15 minutash. Nëse nuk e gjeni, kontrolloni dosjen "Spam".
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Krijoni një llogari</CardTitle>
        <CardDescription>Bashkohuni me EventHub dhe filloni të eksploroni eventet</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-white bg-red-500 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Emri i plotë</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Agim Krasniqi"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email-i universitar</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="emri@umib.net"
              value={formData.email}
              onChange={handleChange}
              required
              className={emailError ? "border-red-500" : ""}
            />
            {emailError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {emailError}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Fjalëkalimi</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmoni fjalëkalimin</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !!emailError}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Duke krijuar llogarinë...
              </>
            ) : (
              "Regjistrohu"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-center">
          Keni tashmë një llogari?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Kyçuni
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
