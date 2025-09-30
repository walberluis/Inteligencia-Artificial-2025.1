# 🧠 Sistemas Especialistas - Guia de Instalação e Execução

Este repositório contém três sistemas especialistas baseados em conhecimento desenvolvidos em React:

**2° Questão:**
1. **Sistema Especialista Genérico** - Ferramenta base para construir aplicações com motor de inferência

**3° Questão:**
1. **Sistema do Gerente** - Análise de Crédito Bancário
2. **Sistema de Diagnóstico Médico** - Triagem de Sintomas Respiratórios  
3. **Mini-Akinator** - Adivinhador de Personagens

## 📋 Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **npm** (vem junto com o Node.js)

### Instalar Node.js

1. Acesse: https://nodejs.org/
2. Baixe a versão LTS (recomendada)
3. Execute o instalador
4. Verifique a instalação abrindo o terminal e digitando:
   ```bash
   node --version
   npm --version
   ```

## 🚀 Passo a Passo para Executar

### 1️⃣ Criar o Projeto React

Abra o terminal no VSCode (ou terminal do sistema) e execute:

```bash
# Crie um novo projeto React
npx create-react-app meu-sistema-especialista

# Entre na pasta do projeto
cd meu-sistema-especialista
```

### 2️⃣ Instalar Dependências

```bash
# Instale os ícones Lucide React
npm install lucide-react
```

### 3️⃣ Configurar o Tailwind CSS

Abra o arquivo `public/index.html` e adicione o CDN do Tailwind dentro da tag `<head>`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Sistemas Especialistas" />
    
    <!-- ADICIONE ESTA LINHA -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    
    <title>Sistema Especialista</title>
  </head>
  <body>
    <noscript>Você precisa habilitar JavaScript para executar esta aplicação.</noscript>
    <div id="root"></div>
  </body>
</html>
```

### 4️⃣ Substituir o Código

1. Abra o arquivo `src/App.js`
2. **DELETE TODO** o conteúdo do arquivo
3. **COLE** o código de um dos sistemas especialistas (.js que você tem)

### 5️⃣ Executar a Aplicação

No terminal, execute:

```bash
npm start
```

A aplicação abrirá automaticamente no navegador em `http://localhost:3000` 


## 📁 Estrutura do Projeto

```
meu-sistema-especialista/
├── node_modules/
├── public/
│   └── index.html          ← Editado (Tailwind CDN adicionado)
├── src/
│   ├── App.js              ← Substituído pelo código do sistema
│   └── index.js
├── package.json
└── README.md
```


## 🔄 Trocar Entre os Sistemas

Para trocar de sistema:

1. Abra `src/App.js`
2. Delete todo o conteúdo
3. Cole o código do novo sistema
4. Salve o arquivo (Ctrl+S)
5. O navegador recarregará automaticamente


## 🎓 Sobre o Projeto

Este projeto foi desenvolvido como ferramenta educacional para demonstrar:

- ✅ Sistemas Especialistas Baseados em Conhecimento
- ✅ Motores de Inferência (Forward e Backward Chaining)
- ✅ Representação de Conhecimento (Regras SE-ENTÃO)
- ✅ Explanação de Raciocínio (Por quê? Como?)
- ✅ Interface de Linguagem Natural
