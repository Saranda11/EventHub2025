import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, Ticket, QrCode, Download, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { eventApi, EventRegistration } from "@/lib/eventApi";
import { useAuth } from "@/lib/authContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MyEvents = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchRegistrations();
  }, [isAuthenticated, navigate]);

  const fetchRegistrations = async () => {
    try {
      const data = await eventApi.getUserRegistrations();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Failed to load your events");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId: string, eventTitle: string) => {
    setCancellingId(eventId);
    try {
      await eventApi.cancelRegistration(eventId);
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.event.id === eventId
            ? { ...reg, status: "cancelled" as const, cancellationDate: new Date().toISOString() }
            : reg
        )
      );
      toast.success(`Regjistrimi për "${eventTitle}" u anulua me sukses`);
    } catch (error: any) {
      toast.error(error.message || "Anulimi i regjistrimit dështoi");
    } finally {
      setCancellingId(null);
    }
  };

  const downloadTicket = (registration: EventRegistration) => {
    if (!registration.qrCode) return;

    // Create a simple ticket HTML
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bileta - ${registration.event.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .ticket { border: 2px dashed #3b82f6; padding: 20px; max-width: 400px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; }
          .qr-code { text-align: center; margin: 20px 0; }
          .details { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h1>EventHub</h1>
            <h2>${registration.event.title}</h2>
          </div>
          <div class="details">
            <p><strong>Data:</strong> ${new Date(registration.event.startDate).toLocaleDateString("sq-AL")}</p>
            <p><strong>Ora:</strong> ${new Date(registration.event.startDate).toLocaleTimeString("sq-AL", {
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
            <p><strong>Vendndodhja:</strong> ${registration.event.location}</p>
            <p><strong>Kodi i biletës:</strong> ${registration.ticketCode}</p>
          </div>
          <div class="qr-code">
            <img src="${registration.qrCode}" alt="QR Code" style="max-width: 200px;" />
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([ticketHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ticket-${registration.event.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sq-AL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("sq-AL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "registered":
        return <Badge className="bg-green-100 text-green-800">E Regjistruar</Badge>;
      case "attended":
        return <Badge className="bg-blue-100 text-blue-800">E Ndjekur</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">E Anuluar</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const canCancelRegistration = (registration: EventRegistration) => {
    if (registration.status !== "registered") return false;
    if (!registration.event.allowCancellation) return false;

    const eventStart = new Date(registration.event.startDate);
    const cancellationDeadline = new Date(
      eventStart.getTime() - registration.event.cancellationDeadlineHours * 60 * 60 * 1000
    );

    return new Date() < cancellationDeadline;
  };

  const filterRegistrations = (status?: string) => {
    if (!status) return registrations;
    return registrations.filter((reg) => reg.status === status);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Duke ngarkuar eventet tuaja...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto max-w-6xl px-6 md:px-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Eventet e Mia</h1>
            <p className="text-gray-600">Menaxhoni regjistrimet tuaja dhe shikoni biletat dixhitale</p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Të Gjitha ({registrations.length})</TabsTrigger>
              <TabsTrigger value="registered">Aktive ({filterRegistrations("registered").length})</TabsTrigger>
              <TabsTrigger value="attended">Të Ndjekura ({filterRegistrations("attended").length})</TabsTrigger>
              <TabsTrigger value="cancelled">Të Anuluara ({filterRegistrations("cancelled").length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <EventRegistrationList
                registrations={registrations}
                onCancel={handleCancelRegistration}
                onDownload={downloadTicket}
                cancellingId={cancellingId}
                canCancelRegistration={canCancelRegistration}
                formatDate={formatDate}
                formatTime={formatTime}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="registered" className="mt-6">
              <EventRegistrationList
                registrations={filterRegistrations("registered")}
                onCancel={handleCancelRegistration}
                onDownload={downloadTicket}
                cancellingId={cancellingId}
                canCancelRegistration={canCancelRegistration}
                formatDate={formatDate}
                formatTime={formatTime}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="attended" className="mt-6">
              <EventRegistrationList
                registrations={filterRegistrations("attended")}
                onCancel={handleCancelRegistration}
                onDownload={downloadTicket}
                cancellingId={cancellingId}
                canCancelRegistration={canCancelRegistration}
                formatDate={formatDate}
                formatTime={formatTime}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>

            <TabsContent value="cancelled" className="mt-6">
              <EventRegistrationList
                registrations={filterRegistrations("cancelled")}
                onCancel={handleCancelRegistration}
                onDownload={downloadTicket}
                cancellingId={cancellingId}
                canCancelRegistration={canCancelRegistration}
                formatDate={formatDate}
                formatTime={formatTime}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

interface EventRegistrationListProps {
  registrations: EventRegistration[];
  onCancel: (eventId: string, eventTitle: string) => void;
  onDownload: (registration: EventRegistration) => void;
  cancellingId: string | null;
  canCancelRegistration: (registration: EventRegistration) => boolean;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
  getStatusBadge: (status: string) => JSX.Element;
}

const EventRegistrationList = ({
  registrations,
  onCancel,
  onDownload,
  cancellingId,
  canCancelRegistration,
  formatDate,
  formatTime,
  getStatusBadge,
}: EventRegistrationListProps) => {
  const navigate = useNavigate();

  if (registrations.length === 0) {
    return (
      <div className="text-center py-12">
        <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nuk keni evente</h3>
        <p className="text-gray-600 mb-6">Filloni duke eksploruar eventet e disponueshme</p>
        <Button onClick={() => navigate("/events")}>Eksploro Eventet</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {registrations.map((registration) => (
        <Card key={registration.id} className="overflow-hidden">
          <div className="aspect-video w-full bg-gray-100">
            <img
              src={
                registration.event.imageUrl ||
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
              }
              alt={registration.event.title}
              className="w-full h-full object-cover"
            />
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg line-clamp-2">{registration.event.title}</CardTitle>
              {getStatusBadge(registration.status)}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(registration.event.startDate)}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {formatTime(registration.event.startDate)} - {formatTime(registration.event.endDate)}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="truncate">{registration.event.location}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/events/${registration.event.id}`)}
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                Shiko Detajet
              </Button>

              {registration.status === "registered" && registration.qrCode && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <QrCode className="w-4 h-4 mr-2" />
                      Shiko Biletën
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Bileta Dixhitale</DialogTitle>
                    </DialogHeader>
                    <div className="text-center space-y-4">
                      <div className="border-2 border-dashed border-primary p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">{registration.event.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">Kodi: {registration.ticketCode}</p>
                        <img src={registration.qrCode} alt="QR Code" className="mx-auto max-w-48" />
                      </div>
                      <Button onClick={() => onDownload(registration)} className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Shkarko Biletën
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {canCancelRegistration(registration) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(registration.event.id, registration.event.title)}
                  disabled={cancellingId === registration.event.id}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  {cancellingId === registration.event.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                      Duke anuluar...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Anulo
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyEvents;
