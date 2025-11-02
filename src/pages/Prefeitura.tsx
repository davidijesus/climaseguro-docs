import { useState } from "react";
import logoSvg from "@/assets/clima-seguro-logo.svg";
import Map from "@/components/Map";
import PrefeituraZoneModal from "@/components/PrefeituraZoneModal";

// Mock notifications
const notifications = [
  {
    zone_id: 23,
    level: "CRÍTICO",
    coordinates: { lat: -25.4284, lon: -49.2733 },
    total_imoveis: 47,
    populacao_estimada: 152,
    roi_formatado: "1100%",
    notified_at: "2025-11-02T10:30:00Z",
  },
  {
    zone_id: 15,
    level: "ALTO",
    coordinates: { lat: -25.4384, lon: -49.2833 },
    total_imoveis: 32,
    populacao_estimada: 98,
    roi_formatado: "850%",
    notified_at: "2025-11-02T09:15:00Z",
  },
];

// Converter notificações para formato de zonas do mapa
const mapZones = notifications.map(notif => ({
  id: notif.zone_id,
  coordinates: notif.coordinates,
  score: notif.level === "CRÍTICO" ? 85 : 65,
  level: notif.level,
  total_imoveis: notif.total_imoveis,
  populacao_estimada: notif.populacao_estimada,
}));

const Prefeitura = () => {
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleZoneClick = (zone: any) => {
    // Encontrar notificação completa
    const notification = notifications.find(n => n.zone_id === zone.id);
    if (notification) {
      setSelectedZone(notification);
      setModalOpen(true);
    }
  };

  const handleNotificationClick = (notification: any) => {
    setSelectedZone(notification);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={logoSvg} alt="ClimaSeguro" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Prefeitura de Curitiba
              </h1>
              <p className="text-sm text-muted-foreground">
                Gestão de Riscos e Prevenção
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Map */}
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-foreground">
              🗺️ Mapa de Notificações
            </h2>
            <Map 
              center={[-25.4284, -49.2733]} 
              zones={mapZones}
              onZoneClick={handleZoneClick}
            />
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span>Crítico</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                <span>Alto</span>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-foreground">
              🔔 Notificações de Risco
            </h2>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.zone_id}
                  onClick={() => handleNotificationClick(notif)}
                  className="cursor-pointer rounded-lg bg-card p-4 shadow-sm transition-all hover:shadow-lg hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {notif.level === "CRÍTICO" ? "🔴" : "🟠"}
                      </span>
                      <div>
                        <p className="font-bold text-foreground">
                          Zona {notif.zone_id} - {notif.level}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {notif.total_imoveis} imóveis em risco | ROI:{" "}
                          {notif.roi_formatado}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          População estimada: {notif.populacao_estimada} pessoas
                        </p>
                      </div>
                    </div>
                    <button className="text-accent hover:text-accent/80 font-medium">
                      Ver Detalhes →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Detalhes */}
      <PrefeituraZoneModal 
        zone={selectedZone}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default Prefeitura;
