import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { analyzeZoneResidences, PhotoAnalysisResult } from '@/services/residenceAnalysis';

interface ResidenceAnalysisProps {
  zoneId: number;
  onComplete: (result: {
    totalResidences: number;
    photos: PhotoAnalysisResult[];
    processId: number;
  }) => void;
  onCancel: () => void;
}

export const ResidenceAnalysis: React.FC<ResidenceAnalysisProps> = ({
  zoneId,
  onComplete,
  onCancel
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...fileArray]);

    // Gerar previews
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) {
      setError('Selecione pelo menos uma foto');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeZoneResidences(zoneId, selectedFiles);
      onComplete(result);
    } catch (err) {
      setError('Erro ao analisar fotos. Tente novamente.');
      console.error('Erro na análise:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Análise de Residências</h3>
        <p className="text-sm text-gray-600 mb-4">
          Tire fotos dos arredores da zona de risco para identificar o número de residências automaticamente.
        </p>
      </div>

      {/* Botões de captura/upload */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => cameraInputRef.current?.click()}
          disabled={isAnalyzing}
        >
          <Camera className="mr-2 h-4 w-4" />
          Tirar Foto
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>

      {/* Inputs escondidos */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Grid de previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded border"
              />
              <button
                onClick={() => handleRemoveFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                disabled={isAnalyzing}
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Contador de fotos */}
      {selectedFiles.length > 0 && (
        <div className="text-sm text-gray-600">
          {selectedFiles.length} foto{selectedFiles.length !== 1 ? 's' : ''} selecionada{selectedFiles.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex gap-2 pt-4">
        <Button
          onClick={handleAnalyze}
          disabled={selectedFiles.length === 0 || isAnalyzing}
          className="flex-1"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analisando com Gemini...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Analisar Fotos
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isAnalyzing}
        >
          Cancelar
        </Button>
      </div>

      {/* Info sobre Gemini */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <strong>ℹ️ Como funciona:</strong> As fotos serão enviadas para o modelo multimodal Gemini,
        que identificará automaticamente o número de residências visíveis nos arredores da zona de risco.
      </div>
    </div>
  );
};
