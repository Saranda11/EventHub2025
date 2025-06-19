import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Calendar, Clock, MapPin, Tag, Users, DollarSign } from "lucide-react";
import { eventApi, EventData, EventResponse } from "@/lib/eventApi";
import { toast } from "sonner";
import { format } from "date-fns";

interface EventFormProps {
  event?: EventResponse;
  isEditing?: boolean;
}

const CATEGORIES = [
  "Muzikë",
  "Sport",
  "Teknologji",
  "Ushqim & Pije",
  "Art & Kulturë",
  "Biznes",
  "Shëndet & Mirëqenie",
  "Edukim",
  "Sociale",
  "Tjetër",
];

const EventForm = ({ event, isEditing = false }: EventFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [tagsInput, setTagsInput] = useState("");
  const [formData, setFormData] = useState<EventData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    category: "",
    maxAttendees: 100,
    ticketPrice: 0,
    imageUrl: "",
    tags: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If editing, populate form with event data
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await eventApi.getEventCategories();
        if (fetchedCategories && fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();

    if (event && isEditing) {
      // Format dates for input fields
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      setFormData({
        title: event.title,
        description: event.description,
        startDate: format(startDate, "yyyy-MM-dd'T'HH:mm"),
        endDate: format(endDate, "yyyy-MM-dd'T'HH:mm"),
        location: event.location,
        category: event.category,
        maxAttendees: event.maxAttendees,
        ticketPrice: event.ticketPrice,
        imageUrl: event.imageUrl || "",
        tags: event.tags,
      });

      setTagsInput(event.tags.join(", "));
    }
  }, [event, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    // Handle number inputs
    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);

    // Parse tags from input
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    setFormData((prev) => ({
      ...prev,
      tags,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) {
      newErrors.title = "Titulli është i detyrushëm";
    } else if (formData.title.length < 5) {
      newErrors.title = "Titulli duhet të ketë së paku 5 karaktere";
    }

    if (!formData.description) {
      newErrors.description = "Përshkrimi është i detyrushëm";
    } else if (formData.description.length < 20) {
      newErrors.description = "Përshkrimi duhet të ketë së paku 20 karaktere";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Data e fillimit është e detyrushme";
    } else if (new Date(formData.startDate) < new Date()) {
      newErrors.startDate = "Data e fillimit nuk mund të jetë në të kaluarën";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Data e përfundimit është e detyrushme";
    } else if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "Data e përfundimit duhet të jetë pas datës së fillimit";
    }

    if (!formData.location) {
      newErrors.location = "Vendndodhja është e detyrushme";
    }

    if (!formData.category) {
      newErrors.category = "Kategoria është e detyrushme";
    }

    if (formData.maxAttendees <= 0) {
      newErrors.maxAttendees = "Numri maksimal i pjesëmarrësve duhet të jetë një numër pozitiv";
    }

    if (formData.ticketPrice < 0) {
      newErrors.ticketPrice = "Çmimi i biletës nuk mund të jetë negativ";
    }

    if (formData.imageUrl && !/^https?:\/\/.+/.test(formData.imageUrl)) {
      newErrors.imageUrl = "URL e imazhit duhet të jetë një URL e vlefshme";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Ju lutemi korrigjoni gabimet në formular");
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && event) {
        await eventApi.updateEvent(event.id, formData);
        toast.success("Eventi u përditësua me sukses");
        navigate(`/events/${event.id}`);
      } else {
        const newEvent = await eventApi.createEvent(formData);
        toast.success("Eventi u krijua me sukses");
        // Handle both _id (MongoDB) and id fields
        const eventId = (newEvent as any)._id || newEvent.id;
        navigate(`/events/${eventId}`);
      }
    } catch (error: any) {
      console.error("Failed to save event:", error);
      toast.error(error.message || "Dështoi ruajtja e eventit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? "Përditëso Eventin" : "Krijo Event të Ri"}</CardTitle>
        <CardDescription>
          {isEditing ? "Përditëso detajet e eventit" : "Plotëso detajet për të krijuar një event të ri"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informacioni Bazë</h3>

            <div className="space-y-2">
              <Label htmlFor="title">Titulli i Eventit</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Përshkrimi</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              <p className="text-xs text-muted-foreground">
                Përshkruani eventin në detaje. Çfarë mund të presin pjesëmarrësit?
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategoria</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Zgjidh një kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Etiketat</Label>
              <div className="flex items-center">
                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tags"
                  name="tags"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  placeholder="muzikë, live, koncert"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Etiketa të ndara me presje për të ndihmuar njerëzit të gjejnë eventin tuaj
              </p>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Data dhe Ora</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data dhe Ora e Fillimit</Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                </div>
                {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data dhe Ora e Përfundimit</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={errors.endDate ? "border-red-500" : ""}
                  />
                </div>
                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vendndodhja</h3>

            <div className="space-y-2">
              <Label htmlFor="location">Vendndodhja e Eventit</Label>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Adresa, emri i vendit, ose online"
                  className={errors.location ? "border-red-500" : ""}
                />
              </div>
              {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
            </div>
          </div>

          {/* Capacity and Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Kapaciteti dhe Çmimi</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Numri Maksimal i Pjesëmarrësve</Label>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="maxAttendees"
                    name="maxAttendees"
                    type="number"
                    min="1"
                    value={formData.maxAttendees}
                    onChange={handleChange}
                    className={errors.maxAttendees ? "border-red-500" : ""}
                  />
                </div>
                {errors.maxAttendees && <p className="text-sm text-red-500">{errors.maxAttendees}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketPrice">Çmimi i Biletës</Label>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="ticketPrice"
                    name="ticketPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    className={errors.ticketPrice ? "border-red-500" : ""}
                  />
                </div>
                {errors.ticketPrice && <p className="text-sm text-red-500">{errors.ticketPrice}</p>}
                <p className="text-xs text-muted-foreground">Vendoseni 0 për evente falas</p>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Media</h3>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL e Imazhit të Eventit</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={errors.imageUrl ? "border-red-500" : ""}
              />
              {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl}</p>}
              <p className="text-xs text-muted-foreground">Shtoni një URL imazhi për kopertinën e eventit tuaj</p>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Duke përditësuar..." : "Duke krijuar..."}
              </>
            ) : isEditing ? (
              "Përditëso Eventin"
            ) : (
              "Krijo Eventin"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
