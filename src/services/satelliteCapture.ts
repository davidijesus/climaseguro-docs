/**
 * Serviço para captura automática de imagens de satélite
 * Usa Google Maps Static API ou ArcGIS para obter imagem da área
 */

interface CaptureOptions {
  lat: number;
  lon: number;
  zoom?: number;
  width?: number;
  height?: number;
  radius?: number; // raio em metros para análise
}

/**
 * Captura imagem de satélite de uma área específica
 */
export async function captureSatelliteImage(options: CaptureOptions): Promise<Blob> {
  const {
    lat,
    lon,
    zoom = 18, // Zoom alto para ver residências
    width = 640,
    height = 640,
  } = options;

  // Usando ArcGIS World Imagery (gratuito, sem necessidade de API key)
  // Alternativa: Google Maps Static API (requer key)
  
  // Para ArcGIS, vamos usar o serviço de export
  const arcgisUrl = `https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/export`;
  
  const params = new URLSearchParams({
    bbox: calculateBBox(lat, lon, 0.002).join(','), // ~200m de raio
    size: `${width},${height}`,
    format: 'png',
    f: 'image',
    bboxSR: '4326',
    imageSR: '3857'
  });

  const response = await fetch(`${arcgisUrl}?${params}`);
  
  if (!response.ok) {
    throw new Error(`Falha ao capturar imagem: ${response.statusText}`);
  }

  return await response.blob();
}

/**
 * Calcula bounding box ao redor de um ponto
 */
function calculateBBox(lat: number, lon: number, delta: number): [number, number, number, number] {
  return [
    lon - delta, // minLon (west)
    lat - delta, // minLat (south)
    lon + delta, // maxLon (east)
    lat + delta  // maxLat (north)
  ];
}

/**
 * Converte Blob para Base64 para enviar ao Gemini
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // Remove o prefixo "data:image/png;base64,"
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Captura e analisa automaticamente uma zona
 */
export async function captureAndAnalyzeZone(
  zoneId: number,
  lat: number,
  lon: number
): Promise<{
  imageUrl: string;
  residenceCount: number;
  analysis: string;
  confidence: number;
}> {
  console.log(`🛰️ Capturando imagem de satélite para zona ${zoneId}...`);
  
  // 1. Capturar imagem
  const imageBlob = await captureSatelliteImage({ lat, lon });
  const imageUrl = URL.createObjectURL(imageBlob);
  const base64Image = await blobToBase64(imageBlob);
  
  console.log(`📸 Imagem capturada: ${imageBlob.size} bytes`);
  
  // 2. Enviar para análise do Gemini
  const response = await fetch('http://localhost:8000/api/gemini/analyze-residence', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_base64: base64Image,
      zone_id: zoneId,
      coordinates: { lat, lon }
    })
  });

  if (!response.ok) {
    throw new Error('Falha na análise da imagem');
  }

  const result = await response.json();
  
  console.log(`✅ Análise concluída: ${result.residence_count} residências encontradas`);
  
  return {
    imageUrl,
    residenceCount: result.residence_count || 0,
    analysis: result.description || 'Análise não disponível',
    confidence: result.confidence || 0.5
  };
}
