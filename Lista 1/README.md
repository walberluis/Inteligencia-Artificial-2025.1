# Classificação de Doenças em Folhas com Processamento de Imagem e Random Forest

## Descrição da Atividade
Este projeto implementa um sistema completo de classificação de doenças em folhas utilizando técnicas avançadas de processamento de imagem e aprendizado de máquina. O sistema é capaz de identificar três categorias de folhas: saudáveis, com ferrugem e com oídio (powdery mildew).

## Funcionalidades Principais
**1. Pré-processamento de Imagens**
  - White Balance com Gray World: Ajusta o balanço de cores da imagem
  - CLAHE no Canal L: Aplica equalização de histograma adaptativa no canal de luminância
  - Segmentação de Folha: Cria máscaras para isolar a folha do fundo usando espaço de cores HSV

**2. Extração de Características**
  - LBP (Local Binary Patterns): Extra features texturais em múltiplas escalas
  - GLCM (Gray-Level Co-occurrence Matrix): Calcula propriedades de textura como contraste, energia, homogeneidade e correlação
  - Estatísticas de Cor: Médias e desvios padrão nos espaços HSV e LAB
  - Energia de Filtros Gabor: Detecta padrões de textura orientados
  - Features Específicas para Oídio: Identifica áreas granulares brancas características da doença

**3. Classificação**
  - Random Forest: Classificador ensemble com 800 árvores
  - Validação: Divisão estratificada 80/20 para treino/teste
  - Métricas: Acurácia, matriz de confusão e relatório de classificação completo

