import logoSvg from "@/assets/clima-seguro-logo.svg";

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

const Prefeitura = () => {
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
          {/* Map Placeholder */}
          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-foreground">
              Mapa de Notificações
            </h2>
            <div className="flex min-h-[500px] items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-6xl">🗺️</div>
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  Mapa de Curitiba
                </h3>
                <p className="text-muted-foreground">
                  Visualização das zonas de risco notificadas
                </p>
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
                  className="cursor-pointer rounded-lg bg-card p-4 shadow-sm transition-shadow hover:shadow-lg"
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
                    <button className="text-accent hover:text-accent/80">
                      Ver Detalhes →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Prefeitura;
