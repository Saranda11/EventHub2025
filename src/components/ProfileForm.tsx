import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProfileForm = () => {
  const { user, updateProfile, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    bio: "",
    interests: "",
    preferredLanguage: "Albanian",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        location: user.location || "",
        phone: user.phone || "",
        bio: user.bio || "",
        interests: user.interests || "",
        preferredLanguage: user.preferredLanguage || "Albanian",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear any previous success/error messages when form is changed
    setSuccess(false);
    setError("");
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccess(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      // Only send fields that have changed
      const updateData: any = {};
      if (formData.name !== user?.name) {
        updateData.name = formData.name;
      }
      if (formData.location !== user?.location) {
        updateData.location = formData.location;
      }
      if (formData.phone !== user?.phone) {
        updateData.phone = formData.phone;
      }
      if (formData.bio !== user?.bio) {
        updateData.bio = formData.bio;
      }
      if (formData.interests !== user?.interests) {
        updateData.interests = formData.interests;
      }
      if (formData.preferredLanguage !== user?.preferredLanguage) {
        updateData.preferredLanguage = formData.preferredLanguage;
      }

      // Don't make API call if nothing has changed
      if (Object.keys(updateData).length === 0) {
        setSuccess(true);
        setIsLoading(false);
        return;
      }

      await updateProfile(updateData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Dështoi përditësimi i profilit. Ju lutemi provoni përsëri.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Përditëso Profilin</CardTitle>
        <CardDescription>Përditëso informacionin tënd personal</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm text-white bg-red-500 rounded-md">{error}</div>}
          {success && (
            <div className="p-3 text-sm text-white bg-green-500 rounded-md">Profili u përditësua me sukses!</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Emri i Plotë</Label>
            <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Email-i nuk mund të ndryshohet</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Vendndodhja</Label>
            <Input
              id="location"
              name="location"
              type="text"
              placeholder="Qyteti, Shteti"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Numri i Telefonit</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+355 69 123 4567"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredLanguage">Gjuha e Preferuar</Label>
            <Select
              value={formData.preferredLanguage}
              onValueChange={(value) => handleSelectChange("preferredLanguage", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Zgjidh gjuhën" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Albanian">Shqip</SelectItem>
                <SelectItem value="English">Anglisht</SelectItem>
                <SelectItem value="German">Gjermanisht</SelectItem>
                <SelectItem value="French">Frengjisht</SelectItem>
                <SelectItem value="Spanish">Spanjisht</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Interesat për Evente</Label>
            <Input
              id="interests"
              name="interests"
              type="text"
              placeholder="Muzikë, Sport, Teknologji, Ushqim"
              value={formData.interests}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">Listë e interesave të ndara me presje</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Rreth Meje</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Na tregoni për veten tuaj..."
              value={formData.bio}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || authLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Duke përditësuar...
              </>
            ) : (
              "Përditëso Profilin"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
