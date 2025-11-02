/**
 * Serviço para análise de residências usando Gemini Vision
 * Integra com o backend FastAPI existente
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export interface PhotoAnalysisResult {
  photoId: number;
  filePath: string;
  description: string;
  residenceCount?: number;
  confidence?: number;
}

export interface ProcessCreationResult {
  processId: number;
}

/**
 * Cria um novo processo de prevenção para uma zona
 */
export async function createPreventionProcess(zoneId: number, context?: any): Promise<ProcessCreationResult> {
  const formData = new FormData();
  formData.append('zone_id', zoneId.toString());
  if (context) {
    formData.append('context', JSON.stringify(context));
  }

  const response = await fetch(`${BACKEND_URL}/processos/prevencao`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Erro ao criar processo de prevenção');
  }

  return await response.json();
}

/**
 * Faz upload de fotos e obtém análise do Gemini
 */
export async function uploadAndAnalyzePhotos(
  processId: number, 
  files: File[]
): Promise<{ photos: PhotoAnalysisResult[] }> {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch(`${BACKEND_URL}/processos/prevencao/${processId}/fotos`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Erro ao fazer upload das fotos');
  }

  const data = await response.json();
  
  // Processar resposta para extrair contagem de residências
  return {
    photos: data.photos.map((photo: any) => {
      const count = extractResidenceCount(photo.description);
      return {
        photoId: photo.id,
        filePath: photo.filePath,
        description: photo.description,
        residenceCount: count,
        confidence: count > 0 ? 0.85 : 0.5
      };
    })
  };
}

/**
 * Extrai contagem de residências da descrição do Gemini
 * RETORNA NÚMERO OBJETIVO OU 0
 */
function extractResidenceCount(description: string): number {
  if (!description) return 0;
  
  // Padrões para detectar contagem de residências
  const patterns = [
    /(\d+)\s*residência/i,
    /(\d+)\s*casa/i,
    /(\d+)\s*moradia/i,
    /(\d+)\s*imóve/i,
    /(\d+)\s*unidade/i,
    /aproximadamente\s*(\d+)/i,
    /cerca de\s*(\d+)/i,
    /em torno de\s*(\d+)/i,
    /total.*?(\d+)/i,
    /identificad.*?(\d+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      const count = parseInt(match[1], 10);
      console.log(`✅ Extraído: ${count} residências da descrição: "${description.substring(0, 100)}..."`);
      return count;
    }
  }
  
  // Se não encontrou nada, tenta pegar o primeiro número >= 1
  const anyNumber = description.match(/\b([1-9]\d*)\b/);
  if (anyNumber) {
    const count = parseInt(anyNumber[1], 10);
    console.log(`⚠️ Número genérico extraído: ${count} de "${description.substring(0, 100)}..."`);
    return count;
  }
  
  console.log(`❌ Nenhum número encontrado em: "${description.substring(0, 100)}..."`);
  return 0;
}

/**
 * Analisa múltiplas fotos e agrega resultados
 */
export async function analyzeZoneResidences(
  zoneId: number,
  photos: File[]
): Promise<{
  processId: number;
  totalResidences: number;
  photos: PhotoAnalysisResult[];
  confidence: number;
}> {
  // 1. Criar processo
  const { processId } = await createPreventionProcess(zoneId, {
    analysisType: 'residence_count',
    timestamp: new Date().toISOString()
  });

  // 2. Upload e análise
  const { photos: analyzedPhotos } = await uploadAndAnalyzePhotos(processId, photos);

  // 3. Agregar resultados
  const totalResidences = analyzedPhotos.reduce((sum, photo) => {
    return sum + (photo.residenceCount || 0);
  }, 0);

  console.log(`📊 ANÁLISE FINAL: ${totalResidences} residências no total`);
  console.log('Detalhamento por foto:', analyzedPhotos.map(p => `Foto ${p.photoId}: ${p.residenceCount} residências`));

  const avgConfidence = analyzedPhotos.reduce((sum, photo) => {
    return sum + (photo.confidence || 0);
  }, 0) / (analyzedPhotos.length || 1);

  return {
    processId,
    totalResidences,
    photos: analyzedPhotos,
    confidence: avgConfidence
  };
}
