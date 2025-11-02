import React from "react";

interface MapProps {
  center: [number, number];
  zones: Array<{
    id: number;
    coordinates: { lat: number; lon: number };
    score: number;
    level: string;
    total_imoveis?: number;
    populacao_estimada?: number;
  }>;
  onZoneClick?: (zone: any) => void;
}

// Componente de placeholder para o mapa
const Map = ({ center, zones, onZoneClick }: MapProps) => {
  const getRiskColor = (score: number) => {
    if (score >= 70) return "bg-red-500";
    if (score >= 50) return "bg-orange-500";
    if (score >= 30) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div 
      className="relative rounded-lg border bg-gradient-to-br from-blue-50 to-green-50 shadow-lg overflow-hidden"
      style={{ width: "100%", height: "600px" }}
    >
      {/* Header do mapa */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
        <h4 className="font-bold text-sm text-gray-800">Mapa Interativo</h4>
        <p className="text-xs text-gray-600">
          {center[0].toFixed(4)}, {center[1].toFixed(4)}
        </p>
      </div>

      {/* Simular zonas de risco como pontos no mapa */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full bg-gradient-to-b from-blue-200/30 to-green-200/30">
          
          {/* Simulação das zonas como markers */}
          {zones.map((zone, index) => (
            <div
              key={zone.id}
              className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110`}
              style={{
                left: `${50 + (index % 3 - 1) * 15}%`,
                top: `${40 + Math.floor(index / 3) * 20}%`,
              }}
              onClick={() => onZoneClick?.(zone)}
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRiskColor(zone.score)} text-white font-bold shadow-lg border-2 border-white text-sm`}>
                {zone.id}
              </div>
              
              {/* Tooltip ao hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                Zona {zone.id} - {zone.level}
                <br />
                Score: {zone.score}/100
              </div>
            </div>
          ))}

          {/* Indicador de mapa interativo */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
            <div className="text-xs text-gray-600">
              🗺️ Mapa Simplificado
            </div>
          </div>
        </div>
      </div>

      {/* Overlay informativo */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md max-w-xs">
        <p className="text-xs text-gray-700 mb-2">
          <strong>Clique nas zonas</strong> para ver detalhes
        </p>
        <div className="flex gap-2 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Crítico
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Alto
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            Moderado
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Baixo
          </span>
        </div>
      </div>
    </div>
  );
};

export default Map;