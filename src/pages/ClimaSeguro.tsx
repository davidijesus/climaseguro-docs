import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logoSvg from "@/assets/clima-seguro-logo.svg";

// Mock data - substituir pelos dados reais depois
const cities = [
  { code: "4106902", name: "Curitiba", state: "PR", coordinates: { lat: -25.4284, lon: -49.2733 } },
  { code: "3550308", name: "São Paulo", state: "SP", coordinates: { lat: -23.5505, lon: -46.6333 } },
  { code: "3304557", name: "Rio de Janeiro", state: "RJ", coordinates: { lat: -22.9068, lon: -43.1729 } },
];

const ClimaSeguro = () => {
  const [selectedCity, setSelectedCity] = useState<string>("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={logoSvg} alt="ClimaSeguro" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-foreground">ClimaSeguro</h1>
              <p className="text-sm text-muted-foreground">Análise de Risco</p>
            </div>
          </div>

          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Selecione uma cidade" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.code} value={city.code}>
                  {city.name} - {city.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {!selectedCity ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-6xl">🌍</div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                Selecione uma cidade
              </h2>
              <p className="text-muted-foreground">
                Escolha uma cidade no dropdown acima para visualizar as zonas de risco
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <StatCard
                icon="🔴"
                label="Crítico"
                value="3"
                color="bg-red-100 text-red-700 border-red-300"
              />
              <StatCard
                icon="🟠"
                label="Alto"
                value="7"
                color="bg-orange-100 text-orange-700 border-orange-300"
              />
              <StatCard
                icon="🟡"
                label="Moderado"
                value="12"
                color="bg-yellow-100 text-yellow-700 border-yellow-300"
              />
              <StatCard
                icon="🟢"
                label="Baixo"
                value="8"
                color="bg-green-100 text-green-700 border-green-300"
              />
            </div>

            {/* Map Placeholder */}
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <div className="flex min-h-[600px] items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 text-6xl">🗺️</div>
                  <h3 className="mb-2 text-xl font-bold text-foreground">
                    Mapa em desenvolvimento
                  </h3>
                  <p className="text-muted-foreground">
                    Integração com Leaflet e OpenStreetMap será adicionada
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) => {
  return (
    <div className={`rounded-lg border p-4 ${color}`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default ClimaSeguro;
