# 📸 Análise de Residências com IA

## Funcionalidade

Quando você clicar em um ponto de risco no mapa, o modal agora permite:

1. **Tirar fotos** dos arredores da zona de risco (câmera do dispositivo)
2. **Fazer upload** de fotos existentes
3. **Análise automática** com Gemini Vision para contar residências
4. **Atualização automática** dos dados de imóveis e população

## Como Usar

### 1. Frontend

1. Clique em qualquer zona de risco no mapa
2. No modal que abrir, clique em **"Analisar Residências com IA"**
3. Tire fotos ou faça upload de imagens dos arredores
4. Clique em **"Analisar Fotos"**
5. Aguarde a análise do Gemini (10-30 segundos)
6. Veja os resultados: número de residências identificadas automaticamente!

### 2. Backend

#### Configuração (Desenvolvimento)

Se você NÃO tiver a API Key do Gemini, o sistema funcionará em **modo offline** com dados simulados:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Configuração (Produção com Gemini Real)

1. Obtenha sua API Key em: https://makersuite.google.com/app/apikey

2. Configure a variável de ambiente:

```bash
export GEMINI_API_KEY="sua-chave-aqui"
```

3. Instale as dependências:

```bash
cd backend
pip install -r requirements.txt
```

4. Inicie o servidor:

```bash
uvicorn main:app --reload --port 8000
```

### 3. Testando

**Modo Offline (sem Gemini):**
- O sistema retorna descrições simuladas
- Contagem estimada: 3-5 residências por foto
- Útil para desenvolvimento e testes

**Modo Online (com Gemini):**
- Análise real das imagens
- Contagem precisa de residências
- Descrição detalhada das construções e riscos

## Fluxo Técnico

```
1. Frontend: Usuário clica na zona
   ↓
2. Frontend: Captura/upload de fotos
   ↓
3. Frontend: POST /processos/prevencao (cria processo)
   ↓
4. Frontend: POST /processos/prevencao/{id}/fotos (upload)
   ↓
5. Backend: Salva fotos em storage/
   ↓
6. Backend: Chama Gemini Vision API
   ↓
7. Backend: Extrai contagem de residências
   ↓
8. Backend: Retorna análise
   ↓
9. Frontend: Atualiza dados da zona
   ↓
10. Frontend: Exibe resultado no modal
```

## Arquivos Criados/Modificados

### Frontend
- `src/services/residenceAnalysis.ts` - Service para comunicação com backend
- `src/components/ResidenceAnalysis.tsx` - Componente de captura/análise
- `src/components/ZoneDetailModal.tsx` - Modal atualizado com análise
- `.env.example` - Configuração de variáveis de ambiente

### Backend
- `backend/services/gemini.py` - Integração real com Gemini Vision
- `backend/requirements.txt` - Adicionado google-generativeai

## API Endpoints Utilizados

### `POST /processos/prevencao`
Cria um novo processo de análise para uma zona.

**Payload:**
```
zone_id: int
context: json (opcional)
```

**Response:**
```json
{
  "processId": 123
}
```

### `POST /processos/prevencao/{process_id}/fotos`
Upload de fotos e análise com Gemini.

**Payload:**
```
files: File[] (multipart/form-data)
```

**Response:**
```json
{
  "photos": [
    {
      "id": 456,
      "filePath": "storage/123/photo1.jpg",
      "description": "5 residências identificadas. Construções de alvenaria em estado regular..."
    }
  ]
}
```

## Prompt do Gemini

O sistema usa um prompt otimizado para contagem de residências:

```
Analise esta imagem e identifique:

1. NÚMERO TOTAL de residências/moradias visíveis (seja preciso na contagem)
2. Tipo de construções (casas, prédios, barracos, etc.)
3. Estado aparente das construções (bom, regular, precário)
4. Indícios de risco (proximidade de encostas, rios, áreas instáveis)
5. Estimativa de densidade populacional

Forneça uma resposta técnica e objetiva, começando SEMPRE com o número exato 
de residências identificadas.
Formato: "X residências identificadas. [descrição detalhada]"
```

## Extração da Contagem

O frontend usa regex para extrair o número de residências:

```typescript
/(\d+)\s*(?:residência|residências|casa|casas|moradia|moradias)/i
```

## Próximas Melhorias

- [ ] Visualização das fotos analisadas no modal
- [ ] Exportação do relatório em PDF
- [ ] Histórico de análises por zona
- [ ] Mapa de calor com densidade de residências
- [ ] Integração com Street View para fotos automáticas
- [ ] Análise de múltiplos ângulos automaticamente
