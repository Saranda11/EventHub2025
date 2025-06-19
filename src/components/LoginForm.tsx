import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";

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

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
          setEmailError(`Only university email addresses are allowed. Accepted domains: ${ALLOWED_DOMAINS.join(", ")}`);
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
      setError(`Only university email addresses are allowed. Accepted domains: ${ALLOWED_DOMAINS.join(", ")}`);
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-white bg-red-500 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">University Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@umib.net"
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !!emailError}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
