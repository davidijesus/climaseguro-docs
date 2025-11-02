import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ResidenceAnalysis } from "@/components/ResidenceAnalysis";
import { Camera, Info, Loader2 } from "lucide-react";
import { captureAndAnalyzeZone } from "@/services/satelliteCapture";

interface ZoneDetailModalProps {
  zone: {
    id: number;
    score: number;
    level: string;
    total_imoveis?: number;
    populacao_estimada?: number;
    coordinates: { lat: number; lon: number };
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ZoneDetailModal = ({ zone, open, onOpenChange }: ZoneDetailModalProps) => {
  const [showResidenceAnalysis, setShowResidenceAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    totalResidences: number;
    photos: any[];
    processId: number;
  } | null>(null);
  const [showFinancialInfo, setShowFinancialInfo] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [satelliteImage, setSatelliteImage] = useState<string | null>(null);
  const [autoAnalysis, setAutoAnalysis] = useState<{
    residenceCount: number;
    description: string;
    confidence: number;
  } | null>(null);

  // Análise automática ao abrir o modal
  useEffect(() => {
    if (open && zone && !autoAnalysis && !isAnalyzing) {
      performAutomaticAnalysis();
    }
    
    // Reset ao fechar
    if (!open) {
      setAutoAnalysis(null);
      setSatelliteImage(null);
      setIsAnalyzing(false);
      setAnalysisResult(null);
      setShowResidenceAnalysis(false);
    }
  }, [open, zone]);

  const performAutomaticAnalysis = async () => {
    if (!zone) return;
    
    setIsAnalyzing(true);
    console.log(`🚀 Iniciando análise automática para zona ${zone.id}...`);
    
    try {
      const result = await captureAndAnalyzeZone(
        zone.id,
        zone.coordinates.lat,
        zone.coordinates.lon
      );
      
      setSatelliteImage(result.imageUrl);
      setAutoAnalysis({
        residenceCount: result.residenceCount,
        description: result.analysis,
        confidence: result.confidence
      });
      
      console.log(`✅ Análise automática concluída: ${result.residenceCount} residências`);
    } catch (error) {
      console.error('❌ Erro na análise automática:', error);
      // Não bloqueia a UI, apenas não mostra os resultados
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!zone) return null;

  // ========================================
  // CÁLCULOS FINANCEIROS BASEADOS EM DADOS REAIS
  // ========================================
  
  // Prioriza análise automática, depois análise manual, por último dados mockados
  const residences = autoAnalysis 
    ? autoAnalysis.residenceCount 
    : analysisResult 
      ? analysisResult.totalResidences 
      : (zone.total_imoveis || 0);
  
  const population = Math.round(residences * 3.5);
  
  // 1. CUSTO DE RECONSTRUÇÃO
  // Baseado em: Custo médio de construção popular no Brasil (R$ 1.500/m²)
  // Área média residencial: 80m²
  // Fator de risco: aplica multiplicador baseado no score
  const avgHomeArea = 80; // m²
  const costPerSqMeter = 1500; // R$/m²
  const avgHomeValue = avgHomeArea * costPerSqMeter; // R$ 120.000
  const riskMultiplier = zone.score / 100; // 0 a 1
  const reconstructionCost = residences * avgHomeValue * riskMultiplier;
  
  // 2. CUSTO DE PERDAS HUMANAS E SOCIAIS
  // Baseado em: Estimativa IPEA de custos indiretos por pessoa afetada
  // R$ 15.000 por pessoa (saúde, deslocamento, assistência temporária)
  const costPerPersonAffected = 15000;
  const humanCost = population * costPerPersonAffected * riskMultiplier;
  
  // 3. CUSTO DE INFRAESTRUTURA PÚBLICA
  // Baseado em: 30% do custo de reconstrução residencial
  // (ruas, redes de água/esgoto, energia)
  const infrastructureCost = reconstructionCost * 0.3;
  
  // 4. PERDAS ECONÔMICAS INDIRETAS
  // Baseado em: 20% do total (perda de produtividade, comércio local)
  const indirectLosses = (reconstructionCost + humanCost + infrastructureCost) * 0.2;
  
  // CUSTO TOTAL DO DESASTRE
  const totalDisasterCost = reconstructionCost + humanCost + infrastructureCost + indirectLosses;
  
  // ========================================
  // CUSTOS DE PREVENÇÃO
  // ========================================
  
  // 1. SISTEMA DE DRENAGEM
  // Baseado em: R$ 300/m linear de micro-drenagem
  // Estima 50m por residência para cobertura adequada
  const drainageLengthPerHome = 50; // metros
  const drainageCostPerMeter = 300; // R$/m
  const drainageCost = residences * drainageLengthPerHome * drainageCostPerMeter * (zone.score / 100);
  
  // 2. CONTENÇÃO E ESTABILIZAÇÃO
  // Baseado em: R$ 200/m² para obras de contenção
  // Estima 30m² de área de risco por residência
  const containmentAreaPerHome = 30; // m²
  const containmentCostPerSqMeter = 200; // R$/m²
  const containmentCost = residences * containmentAreaPerHome * containmentCostPerSqMeter * (zone.score / 100);
  
  // 3. REFLORESTAMENTO E PAISAGISMO
  // Baseado em: R$ 50/m² para plantio e manutenção
  // Estima 20m² de área verde por residência
  const greenAreaPerHome = 20; // m²
  const greenCostPerSqMeter = 50; // R$/m²
  const greenCost = residences * greenAreaPerHome * greenCostPerSqMeter * (zone.score / 100);
  
  // 4. SISTEMA DE ALERTA E MONITORAMENTO
  // Custo fixo + variável por população
  const monitoringBaseCost = 50000; // Base
  const monitoringCostPerPerson = 100; // R$/pessoa
  const monitoringCost = monitoringBaseCost + (population * monitoringCostPerPerson * (zone.score / 100));
  
  // CUSTO TOTAL DE PREVENÇÃO
  const totalPreventionCost = drainageCost + containmentCost + greenCost + monitoringCost;
  
  // ========================================
  // MÉTRICAS FINANCEIRAS
  // ========================================
  
  const savings = totalDisasterCost - totalPreventionCost;
  const roi = totalPreventionCost > 0 ? ((savings / totalPreventionCost) * 100) : 0;
  const investmentRatio = totalPreventionCost > 0 ? (totalDisasterCost / totalPreventionCost) : 0;
  
  // Formatador de moeda
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}K`;
    }
    return `R$ ${value.toFixed(0)}`;
  };

  const getRiskColorClass = (score: number) => {
    if (score >= 70) return "border-red-500 bg-red-50";
    if (score >= 50) return "border-orange-500 bg-orange-50";
    if (score >= 30) return "border-yellow-500 bg-yellow-50";
    return "border-green-500 bg-green-50";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Zona {zone.id} - {zone.level}
          </DialogTitle>
          <DialogDescription>
            Análise detalhada de risco e impacto financeiro
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Score de Risco */}
          <div className={`rounded-lg border-2 p-4 ${getRiskColorClass(zone.score)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Score de Risco</p>
                <p className="text-4xl font-bold">{zone.score}/100</p>
              </div>
              <div className="text-6xl">
                {zone.score >= 70 ? "🔴" : zone.score >= 50 ? "🟠" : zone.score >= 30 ? "🟡" : "🟢"}
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Imóveis Afetados</p>
              {isAnalyzing ? (
                <div className="flex items-center gap-2 mt-2">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <p className="text-sm text-gray-600">Analisando...</p>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold">
                    {residences}
                  </p>
                  {autoAnalysis && (
                    <p className="text-xs text-blue-600 mt-1 font-semibold">
                      ✓ {autoAnalysis.residenceCount} residências via satélite (IA)
                    </p>
                  )}
                  {!autoAnalysis && analysisResult && (
                    <p className="text-xs text-green-600 mt-1 font-semibold">
                      ✓ {analysisResult.totalResidences} residências identificadas por IA
                    </p>
                  )}
                  {!autoAnalysis && !analysisResult && (
                    <p className="text-xs text-gray-500 mt-1">Estimativa inicial</p>
                  )}
                </>
              )}
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">População Estimada</p>
              {isAnalyzing ? (
                <div className="flex items-center gap-2 mt-2">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <p className="text-sm text-gray-600">Calculando...</p>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold">
                    {population}
                  </p>
                  {(autoAnalysis || analysisResult) && (
                    <p className="text-xs text-blue-600 mt-1 font-semibold">
                      ✓ Baseado em média de 3.5 pessoas/residência
                    </p>
                  )}
                  {!autoAnalysis && !analysisResult && (
                    <p className="text-xs text-gray-500 mt-1">Estimativa inicial</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Imagem de Satélite com Análise Automática */}
          <div className="rounded-lg border bg-muted overflow-hidden">
            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                <p className="text-sm font-medium text-gray-700">
                  🛰️ Capturando imagem de satélite...
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Analisando área ao redor da zona {zone.id}
                </p>
              </div>
            )}
            
            {!isAnalyzing && satelliteImage && (
              <div>
                <img 
                  src={satelliteImage} 
                  alt="Imagem de satélite da zona"
                  className="w-full h-64 object-cover"
                />
                {autoAnalysis && (
                  <div className="p-4 bg-blue-50 border-t border-blue-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-blue-900">🤖 Análise Automática via IA</h4>
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                        Confiança: {Math.round(autoAnalysis.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-blue-800">
                      {autoAnalysis.description}
                    </p>
                    <button
                      onClick={performAutomaticAnalysis}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-2 underline"
                    >
                      🔄 Analisar novamente
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {!isAnalyzing && !satelliteImage && (
              <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
                <div className="text-6xl mb-2">🛰️</div>
                <p className="text-sm text-muted-foreground">
                  Análise automática não disponível
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Coordenadas: {zone.coordinates.lat.toFixed(4)}, {zone.coordinates.lon.toFixed(4)}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-4"
                  onClick={performAutomaticAnalysis}
                >
                  🔄 Tentar novamente
                </Button>
              </div>
            )}
          </div>

          {/* Comparação Financeira */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">💰 Análise Financeira</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowFinancialInfo(true)}
              >
                <Info className="h-4 w-4 mr-1" />
                Metodologia
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Custo Desastre */}
              <div className="rounded-lg border-2 border-red-500 bg-red-50 p-4">
                <h4 className="font-bold text-red-700 mb-2">💥 Custo do Desastre</h4>
                <p className="text-3xl font-bold text-red-900 mb-2">{formatCurrency(totalDisasterCost)}</p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Reconstrução: {formatCurrency(reconstructionCost)}</li>
                  <li>• Perdas humanas: {formatCurrency(humanCost)}</li>
                  <li>• Infraestrutura: {formatCurrency(infrastructureCost)}</li>
                  <li>• Perdas indiretas: {formatCurrency(indirectLosses)}</li>
                </ul>
              </div>

              {/* Custo Prevenção */}
              <div className="rounded-lg border-2 border-green-500 bg-green-50 p-4">
                <h4 className="font-bold text-green-700 mb-2">✅ Custo de Prevenção</h4>
                <p className="text-3xl font-bold text-green-900 mb-2">{formatCurrency(totalPreventionCost)}</p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Drenagem: {formatCurrency(drainageCost)}</li>
                  <li>• Contenção: {formatCurrency(containmentCost)}</li>
                  <li>• Reflorestamento: {formatCurrency(greenCost)}</li>
                  <li>• Monitoramento: {formatCurrency(monitoringCost)}</li>
                </ul>
              </div>
            </div>

            {/* ROI */}
            <div className="mt-4 rounded-lg bg-blue-100 p-4">
              <p className="text-center text-lg">
                💰 Investir <strong>R$ 1</strong> economiza <strong>R$ {investmentRatio.toFixed(1)}</strong>
              </p>
              <p className="text-center text-sm text-gray-600 mt-1">
                ROI: {roi.toFixed(0)}% | Economia: {formatCurrency(savings)}
              </p>
            </div>
          </div>

          {/* Botão de Ação */}
          <Button className="w-full" size="lg">
            📢 Notificar Prefeitura
          </Button>
        </div>
      </DialogContent>

      {/* Diálogo de Metodologia Financeira */}
      <AlertDialog open={showFinancialInfo} onOpenChange={setShowFinancialInfo}>
        <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">📊 Metodologia de Cálculo Financeiro</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Entenda como são calculados os custos de desastre e prevenção
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Custos de Desastre */}
            <div>
              <h3 className="font-bold text-lg text-red-700 mb-3">💥 Custos do Desastre</h3>
              
              <div className="space-y-4 bg-red-50 p-4 rounded-lg border border-red-200">
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">1. Reconstrução de Imóveis</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Fórmula:</strong> Residências × 80m² × R$ 1.500/m² × (Score de Risco ÷ 100)
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Base:</strong> Custo médio de construção popular no Brasil segundo IBGE/Sinduscon (R$ 1.500/m²).
                    Área média residencial de 80m². O score de risco ajusta a probabilidade de destruição total.
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Nesta zona:</strong> {residences} residências × R$ 120.000 × {(zone.score / 100).toFixed(2)} = {formatCurrency(reconstructionCost)}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-red-900 mb-1">2. Perdas Humanas e Sociais</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Fórmula:</strong> População × R$ 15.000/pessoa × (Score de Risco ÷ 100)
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Base:</strong> Estimativa do IPEA para custos indiretos por pessoa afetada em desastres naturais,
                    incluindo saúde, deslocamento, assistência temporária e perda de renda.
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Nesta zona:</strong> {population} pessoas × R$ 15.000 × {(zone.score / 100).toFixed(2)} = {formatCurrency(humanCost)}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-red-900 mb-1">3. Infraestrutura Pública</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Fórmula:</strong> Custo de Reconstrução × 0.3 (30%)
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Base:</strong> Estudos da Defesa Civil indicam que infraestrutura pública (ruas, redes de água/esgoto,
                    energia) representam cerca de 30% do custo de reconstrução residencial.
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Nesta zona:</strong> {formatCurrency(reconstructionCost)} × 0.3 = {formatCurrency(infrastructureCost)}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-red-900 mb-1">4. Perdas Econômicas Indiretas</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Fórmula:</strong> (Reconstrução + Perdas Humanas + Infraestrutura) × 0.2 (20%)
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Base:</strong> Banco Mundial estima que perdas indiretas (produtividade, comércio, turismo) somam
                    cerca de 20% dos custos diretos em desastres urbanos.
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Nesta zona:</strong> {formatCurrency(reconstructionCost + humanCost + infrastructureCost)} × 0.2 = {formatCurrency(indirectLosses)}
                  </p>
                </div>
              </div>
            </div>

            {/* Custos de Prevenção */}
            <div>
              <h3 className="font-bold text-lg text-green-700 mb-3">✅ Custos de Prevenção</h3>
              
              <div className="space-y-4 bg-green-50 p-4 rounded-lg border border-green-200">
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">1. Sistema de Drenagem</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Fórmula:</strong> Residências × 50m × R$ 300/m × (Score ÷ 100)
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Base:</strong> Custo médio de micro-drenagem urbana (R$ 300/m linear) segundo SANEPAR/SABESP.
                    Estimativa de 50m de drenagem necessária por residência para cobertura adequada.
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Nesta zona:</strong> {residences} × 50m × R$ 300 × {(zone.score / 100).toFixed(2)} = {formatCurrency(drainageCost)}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-green-900 mb-1">2. Contenção e Estabilização</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Fórmula:</strong> Residências × 30m² × R$ 200/m² × (Score ÷ 100)
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Base:</strong> Custo médio de obras de contenção (muros, gabião, solo-cimento) é R$ 200/m².
                    Estimativa de 30m² de área de risco por residência.
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Nesta zona:</strong> {residences} × 30m² × R$ 200 × {(zone.score / 100).toFixed(2)} = {formatCurrency(containmentCost)}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-green-900 mb-1">3. Reflorestamento e Área Verde</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Fórmula:</strong> Residências × 20m² × R$ 50/m² × (Score ÷ 100)
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Base:</strong> Custo de plantio e manutenção de área verde urbana (R$ 50/m²) segundo secretarias
                    de meio ambiente. 20m² de área verde por residência para controle de erosão.
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Nesta zona:</strong> {residences} × 20m² × R$ 50 × {(zone.score / 100).toFixed(2)} = {formatCurrency(greenCost)}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-green-900 mb-1">4. Sistema de Alerta e Monitoramento</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Fórmula:</strong> R$ 50.000 (base) + População × R$ 100/pessoa × (Score ÷ 100)
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Base:</strong> Custo de implantação de sistema de alerta (sensores, sirenes, central) mais
                    R$ 100 por pessoa para cobertura de SMS/app de notificações.
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Nesta zona:</strong> R$ 50.000 + {population} × R$ 100 × {(zone.score / 100).toFixed(2)} = {formatCurrency(monitoringCost)}
                  </p>
                </div>
              </div>
            </div>

            {/* Fontes */}
            <div className="bg-gray-100 p-4 rounded-lg border">
              <h3 className="font-bold text-sm text-gray-800 mb-2">📚 Fontes de Dados</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <strong>IBGE:</strong> Pesquisa Nacional por Amostra de Domicílios (PNAD) - Média de moradores/domicílio</li>
                <li>• <strong>Sinduscon:</strong> Sistema Nacional de Pesquisa de Custos e Índices da Construção Civil</li>
                <li>• <strong>IPEA:</strong> Atlas da Vulnerabilidade Social - Custos de desastres naturais</li>
                <li>• <strong>Banco Mundial:</strong> Natural Disasters Economic Impact Assessment Framework</li>
                <li>• <strong>SANEPAR/SABESP:</strong> Tabelas de custos de obras de saneamento</li>
                <li>• <strong>Defesa Civil:</strong> Relatórios de reconstrução pós-desastre</li>
              </ul>
            </div>

            {/* Observações */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
              <h3 className="font-bold text-sm text-yellow-800 mb-2">⚠️ Observações Importantes</h3>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Os valores são estimativas baseadas em médias nacionais e podem variar por região</li>
                <li>• O score de risco (0-100) ajusta os custos pela probabilidade de ocorrência</li>
                <li>• Análise com IA (quando disponível) melhora a precisão do número de residências</li>
                <li>• Custos não incluem inflação futura ou variações cambiais</li>
                <li>• ROI calculado assume prevenção 100% efetiva na redução de risco</li>
              </ul>
            </div>
          </div>

          <AlertDialogCancel className="mt-4">Fechar</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default ZoneDetailModal;
