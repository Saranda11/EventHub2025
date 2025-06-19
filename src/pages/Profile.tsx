import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import ProfileForm from "@/components/ProfileForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Calendar, User, Globe } from "lucide-react";

const Profile = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return "Datë e panjohur";
    }
  };

  const getInterestsArray = (interests: string = "") => {
    if (!interests) return [];
    return interests
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profili Juaj</h1>
            <p className="mt-2 text-sm text-gray-600">Shikoni dhe përditësoni informacionin e llogarisë suaj</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* User information sidebar */}
            <div className="col-span-1 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Informacioni i Llogarisë</CardTitle>
                  <CardDescription>Detajet e llogarisë suaj</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Emri</p>
                      <p className="text-sm text-muted-foreground">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Telefoni</p>
                        <p className="text-sm text-muted-foreground">{user.phone}</p>
                      </div>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Vendndodhja</p>
                        <p className="text-sm text-muted-foreground">{user.location}</p>
                      </div>
                    </div>
                  )}
                  {user.preferredLanguage && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Gjuha e Preferuar</p>
                        <p className="text-sm text-muted-foreground">{user.preferredLanguage}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Statusi i Llogarisë</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Anëtar që nga</p>
                      <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Lloji i llogarisë</p>
                    <Badge className="mt-1">{user.role === "user" ? "Përdorues" : "Administrator"}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Përditësuar së fundi</p>
                    <p className="text-sm text-muted-foreground">{formatDate(user.updatedAt)}</p>
                  </div>
                </CardContent>
              </Card>

              {user.interests && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Interesat</CardTitle>
                    <CardDescription>Eventet që ju interesojnë</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {getInterestsArray(user.interests).map((interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Profile update form */}
            <div className="col-span-1 md:col-span-2">
              <ProfileForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
