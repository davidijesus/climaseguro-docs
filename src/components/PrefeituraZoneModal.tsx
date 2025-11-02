import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Zone {
  zone_id: number;
  level: string;
  coordinates: { lat: number; lon: number };
  total_imoveis: number;
  populacao_estimada: number;
  roi_formatado: string;
  notified_at: string;
}

interface PrefeituraZoneModalProps {
  zone: Zone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrefeituraZoneModal = ({ zone, open, onOpenChange }: PrefeituraZoneModalProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!zone) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`Arquivo "${file.name}" carregado com sucesso!`);
    }
  };

  const handleGenerateDocs = () => {
    setIsGenerating(true);
    // Simula geração de documentos
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Documentos gerados com sucesso!", {
        description: "Ofício, relatório técnico e plano de ação foram criados.",
      });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Zona {zone.zone_id} - {zone.level}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Zona */}
          <Card className="p-4 bg-muted/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Imóveis em Risco</p>
                <p className="text-2xl font-bold">{zone.total_imoveis}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">População Estimada</p>
                <p className="text-2xl font-bold">{zone.populacao_estimada}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ROI Estimado</p>
                <p className="text-2xl font-bold text-green-600">{zone.roi_formatado}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Notificado em</p>
                <p className="text-sm font-medium">
                  {new Date(zone.notified_at).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </Card>

          {/* Upload de Arquivo */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">📎 Upload de Documentos</h3>
            <Card className="p-4">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Envie estudos técnicos, laudos ou outros documentos relacionados à zona de risco
                </p>
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="cursor-pointer"
                />
                {uploadedFile && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <span>✓</span>
                    <span>Arquivo carregado: {uploadedFile.name}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Geração de Documentos */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">📄 Gerar Documentos Oficiais</h3>
            <Card className="p-4">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Gere automaticamente os documentos necessários para ação preventiva:
                </p>
                <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                  <li>Ofício de notificação aos moradores</li>
                  <li>Relatório técnico de risco</li>
                  <li>Plano de ação emergencial</li>
                </ul>
                <Button
                  onClick={handleGenerateDocs}
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin mr-2">⚙️</span>
                      Gerando Documentos...
                    </>
                  ) : (
                    <>
                      📝 Gerar Documentos Oficiais
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Ações Recomendadas */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">🚨 Ações Recomendadas</h3>
            <Card className="p-4 bg-orange-50 border-orange-200">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">1.</span>
                  <span>Realizar vistoria técnica no local</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">2.</span>
                  <span>Notificar moradores das áreas de risco</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">3.</span>
                  <span>Mobilizar equipes de Defesa Civil</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">4.</span>
                  <span>Preparar abrigos temporários se necessário</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrefeituraZoneModal;
