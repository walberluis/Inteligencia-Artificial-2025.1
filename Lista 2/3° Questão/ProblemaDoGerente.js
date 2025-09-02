import React, { useState } from 'react';
import { Play, Database, Brain, MessageSquare, DollarSign, User, TrendingUp, AlertTriangle } from 'lucide-react';

const ManagerExpertSystem = () => {
  const [rules] = useState([
    { id: 1, conditions: ['renda alta', 'histórico bom'], conclusion: 'risco baixo', active: true },
    { id: 2, conditions: ['renda alta', 'histórico ruim'], conclusion: 'risco médio', active: true },
    { id: 3, conditions: ['renda média', 'histórico bom'], conclusion: 'risco médio', active: true },
    { id: 4, conditions: ['renda média', 'histórico ruim'], conclusion: 'risco alto', active: true },
    { id: 5, conditions: ['renda baixa', 'histórico bom'], conclusion: 'risco médio', active: true },
    { id: 6, conditions: ['renda baixa', 'histórico ruim'], conclusion: 'risco alto', active: true },
    { id: 7, conditions: ['risco baixo', 'garantias existem'], conclusion: 'decisão aprovar', active: true },
    { id: 8, conditions: ['risco baixo', 'garantias não existem'], conclusion: 'decisão aprovar', active: true },
    { id: 9, conditions: ['risco médio', 'garantias existem'], conclusion: 'decisão aprovar', active: true },
    { id: 10, conditions: ['risco médio', 'garantias não existem'], conclusion: 'decisão negar', active: true },
    { id: 11, conditions: ['risco alto', 'garantias existem'], conclusion: 'decisão análise especial', active: true },
    { id: 12, conditions: ['risco alto', 'garantias não existem'], conclusion: 'decisão negar', active: true },
    { id: 13, conditions: ['emprego estável'], conclusion: 'histórico bom', active: true },
    { id: 14, conditions: ['sem dívidas'], conclusion: 'histórico bom', active: true },
    { id: 15, conditions: ['dívidas pendentes'], conclusion: 'histórico ruim', active: true },
    { id: 16, conditions: ['salário maior que 5000'], conclusion: 'renda alta', active: true },
    { id: 17, conditions: ['salário entre 2000 e 5000'], conclusion: 'renda média', active: true },
    { id: 18, conditions: ['salário menor que 2000'], conclusion: 'renda baixa', active: true },
    { id: 19, conditions: ['propriedade imóvel'], conclusion: 'garantias existem', active: true },
    { id: 20, conditions: ['veículo próprio'], conclusion: 'garantias existem', active: true }
  ]);
  
  const [facts, setFacts] = useState([]);
  const [clientData, setClientData] = useState({
    nome: '',
    salario: '',
    emprego: '',
    dividas: '',
    imovel: '',
    veiculo: ''
  });
  
  const [currentTab, setCurrentTab] = useState('input');
  const [inferenceResult, setInferenceResult] = useState(null);
  const [explanationTrace, setExplanationTrace] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', content: 'Olá! Sou o assistente de análise de crédito. Vou fazer algumas perguntas sobre o cliente.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [conversationStep, setConversationStep] = useState(0);

  const backwardChaining = (goal, currentFacts, trace = []) => {
    if (currentFacts.includes(goal)) {
      trace.push({ type: 'success', message: `✓ "${goal}" já é conhecido` });
      return { success: true, trace };
    }

    for (let rule of rules.filter(r => r.active)) {
      if (rule.conclusion === goal) {
        trace.push({ 
          type: 'rule', 
          message: `Analisando: SE ${rule.conditions.join(' E ')} ENTÃO ${rule.conclusion}`,
          rule 
        });

        let allConditionsMet = true;
        let newFacts = [...currentFacts];

        for (let condition of rule.conditions) {
          if (!newFacts.includes(condition)) {
            const result = backwardChaining(condition, newFacts, trace);
            
            if (result.success) {
              newFacts.push(condition);
            } else {
              allConditionsMet = false;
              break;
            }
          }
        }

        if (allConditionsMet) {
          trace.push({ type: 'infer', message: `✓ Conclusão: ${goal}`, rule });
          newFacts.push(goal);
          return { success: true, trace, derivedFacts: newFacts };
        }
      }
    }

    return { success: false, trace };
  };

  const analyzeClient = () => {
    const newFacts = [];
    
    if (clientData.salario) {
      const sal = parseFloat(clientData.salario);
      if (sal > 5000) newFacts.push('salário maior que 5000');
      else if (sal >= 2000) newFacts.push('salário entre 2000 e 5000');
      else newFacts.push('salário menor que 2000');
    }
    
    if (clientData.emprego === 'estavel') newFacts.push('emprego estável');
    if (clientData.dividas === 'nao') newFacts.push('sem dívidas');
    if (clientData.dividas === 'sim') newFacts.push('dívidas pendentes');
    if (clientData.imovel === 'sim') newFacts.push('propriedade imóvel');
    if (clientData.veiculo === 'sim') newFacts.push('veículo próprio');
    
    setFacts(newFacts);
    
    const result = backwardChaining('decisão aprovar', newFacts, []);
    const result2 = backwardChaining('decisão negar', newFacts, []);
    const result3 = backwardChaining('decisão análise especial', newFacts, []);
    
    let decision = null;
    let allTraces = [];
    
    if (result.success) {
      decision = { type: 'aprovar', message: 'CRÉDITO APROVADO', color: 'green' };
      allTraces = result.trace;
    } else if (result2.success) {
      decision = { type: 'negar', message: 'CRÉDITO NEGADO', color: 'red' };
      allTraces = result2.trace;
    } else if (result3.success) {
      decision = { type: 'especial', message: 'ANÁLISE ESPECIAL NECESSÁRIA', color: 'yellow' };
      allTraces = result3.trace;
    } else {
      decision = { type: 'indefinido', message: 'DADOS INSUFICIENTES', color: 'gray' };
      allTraces = [...result.trace, ...result2.trace, ...result3.trace];
    }
    
    setInferenceResult({ success: true, decision, derivedFacts: newFacts });
    setExplanationTrace(allTraces);
    setCurrentTab('result');
  };

  const conversationQuestions = [
    { field: 'nome', question: 'Qual o nome do cliente?' },
    { field: 'salario', question: 'Qual o salário mensal do cliente (em reais)?' },
    { field: 'emprego', question: 'O emprego é estável? (responda: estavel ou instavel)' },
    { field: 'dividas', question: 'O cliente possui dívidas pendentes? (responda: sim ou nao)' },
    { field: 'imovel', question: 'O cliente possui imóvel próprio? (responda: sim ou nao)' },
    { field: 'veiculo', question: 'O cliente possui veículo próprio? (responda: sim ou nao)' }
  ];

  const handleChatSubmit = () => {
    if (!userInput.trim()) return;

    const userMessage = { role: 'user', content: userInput };
    setChatMessages([...chatMessages, userMessage]);

    if (conversationStep < conversationQuestions.length) {
      const currentQuestion = conversationQuestions[conversationStep];
      const newClientData = { ...clientData, [currentQuestion.field]: userInput.toLowerCase().trim() };
      setClientData(newClientData);

      if (conversationStep === conversationQuestions.length - 1) {
        setChatMessages(prev => [...prev, 
          { role: 'system', content: 'Obrigado! Agora vou analisar o perfil do cliente...' }
        ]);
        
        setTimeout(() => {
          const tempFacts = [];
          const sal = parseFloat(newClientData.salario);
          if (sal > 5000) tempFacts.push('salário maior que 5000');
          else if (sal >= 2000) tempFacts.push('salário entre 2000 e 5000');
          else tempFacts.push('salário menor que 2000');
          
          if (newClientData.emprego === 'estavel') tempFacts.push('emprego estável');
          if (newClientData.dividas === 'nao') tempFacts.push('sem dívidas');
          if (newClientData.dividas === 'sim') tempFacts.push('dívidas pendentes');
          if (newClientData.imovel === 'sim') tempFacts.push('propriedade imóvel');
          if (newClientData.veiculo === 'sim') tempFacts.push('veículo próprio');
          
          setFacts(tempFacts);
          
          const result = backwardChaining('decisão aprovar', tempFacts, []);
          const result2 = backwardChaining('decisão negar', tempFacts, []);
          const result3 = backwardChaining('decisão análise especial', tempFacts, []);
          
          let decision = null;
          if (result.success) decision = { type: 'aprovar', message: 'CRÉDITO APROVADO ✓', color: 'green' };
          else if (result2.success) decision = { type: 'negar', message: 'CRÉDITO NEGADO ✗', color: 'red' };
          else if (result3.success) decision = { type: 'especial', message: 'ANÁLISE ESPECIAL NECESSÁRIA ⚠', color: 'yellow' };
          
          setChatMessages(prev => [...prev, 
            { role: 'system', content: `Análise concluída!\n\nDECISÃO: ${decision.message}\n\nVocê pode perguntar "por que?" para ver a justificativa.` }
          ]);
          
          setInferenceResult({ success: true, decision, derivedFacts: tempFacts });
          setExplanationTrace(result.success ? result.trace : (result2.success ? result2.trace : result3.trace));
        }, 1000);
      } else {
        const nextQuestion = conversationQuestions[conversationStep + 1];
        setChatMessages(prev => [...prev, { role: 'system', content: nextQuestion.question }]);
      }
      
      setConversationStep(conversationStep + 1);
    } else {
      if (userInput.toLowerCase().includes('por que') || userInput.toLowerCase().includes('porque')) {
        const explanation = explanationTrace
          .filter(t => t.type === 'infer')
          .map(t => `• ${t.message}`)
          .join('\n');
        
        setChatMessages(prev => [...prev, 
          { role: 'system', content: explanation || 'Análise baseada nas regras do sistema.' }
        ]);
      } else {
        setChatMessages(prev => [...prev, 
          { role: 'system', content: 'Análise já concluída. Digite "reiniciar" para nova análise ou "por que?" para ver justificativa.' }
        ]);
      }
    }

    setUserInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (currentTab === 'chat') handleChatSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <DollarSign className="w-8 h-8" />
              Sistema de Análise de Crédito - Problema do Gerente
            </h1>
            <p className="mt-2 text-green-100">Sistema especialista para aprovação de empréstimos bancários</p>
          </div>

          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => setCurrentTab('input')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                currentTab === 'input' 
                  ? 'border-b-2 border-green-600 text-green-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <User className="w-4 h-4" />
              Dados do Cliente
            </button>
            <button
              onClick={() => setCurrentTab('rules')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                currentTab === 'rules' 
                  ? 'border-b-2 border-green-600 text-green-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Database className="w-4 h-4" />
              Base de Regras
            </button>
            <button
              onClick={() => setCurrentTab('result')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                currentTab === 'result' 
                  ? 'border-b-2 border-green-600 text-green-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Resultado
            </button>
            <button
              onClick={() => setCurrentTab('chat')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                currentTab === 'chat' 
                  ? 'border-b-2 border-green-600 text-green-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Consulta Interativa
            </button>
          </div>

          <div className="p-6">
            {currentTab === 'input' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Problema do Gerente:</strong> Sistema para decidir se um empréstimo deve ser aprovado com base em renda, histórico de crédito e garantias.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome do Cliente</label>
                    <input
                      type="text"
                      value={clientData.nome}
                      onChange={(e) => setClientData({...clientData, nome: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="Ex: João Silva"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Salário Mensal (R$)</label>
                    <input
                      type="number"
                      value={clientData.salario}
                      onChange={(e) => setClientData({...clientData, salario: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="Ex: 3500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Situação do Emprego</label>
                    <select
                      value={clientData.emprego}
                      onChange={(e) => setClientData({...clientData, emprego: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="">Selecione...</option>
                      <option value="estavel">Estável</option>
                      <option value="instavel">Instável</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Possui Dívidas Pendentes?</label>
                    <select
                      value={clientData.dividas}
                      onChange={(e) => setClientData({...clientData, dividas: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="">Selecione...</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Possui Imóvel Próprio?</label>
                    <select
                      value={clientData.imovel}
                      onChange={(e) => setClientData({...clientData, imovel: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="">Selecione...</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Possui Veículo Próprio?</label>
                    <select
                      value={clientData.veiculo}
                      onChange={(e) => setClientData({...clientData, veiculo: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="">Selecione...</option>
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>

                  <button
                    onClick={analyzeClient}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-lg font-medium"
                  >
                    <Play className="w-5 h-5" />
                    Analisar Solicitação de Crédito
                  </button>
                </div>
              </div>
            )}

            {currentTab === 'rules' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Base de Conhecimento - Regras de Negócio</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {rules.map(rule => (
                    <div key={rule.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                      <div className="text-xs font-medium text-gray-500 mb-1">Regra {rule.id}</div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">SE:</span>
                        <div className="ml-4 mt-1">
                          {rule.conditions.map((c, i) => (
                            <div key={i} className="text-gray-600">• {c}</div>
                          ))}
                        </div>
                        <span className="font-medium text-gray-700 mt-2 block">ENTÃO:</span>
                        <div className="ml-4 text-green-600 font-medium">{rule.conclusion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTab === 'result' && inferenceResult && (
              <div className="space-y-6">
                <div className={`p-8 rounded-lg text-center ${
                  inferenceResult.decision.color === 'green' ? 'bg-green-50 border-4 border-green-500' :
                  inferenceResult.decision.color === 'red' ? 'bg-red-50 border-4 border-red-500' :
                  inferenceResult.decision.color === 'yellow' ? 'bg-yellow-50 border-4 border-yellow-500' :
                  'bg-gray-50 border-4 border-gray-500'
                }`}>
                  <h2 className="text-3xl font-bold mb-4">
                    {inferenceResult.decision.message}
                  </h2>
                  {clientData.nome && (
                    <p className="text-lg text-gray-700">Cliente: <strong>{clientData.nome}</strong></p>
                  )}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Fatos Identificados</h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {inferenceResult.derivedFacts.map((fact, i) => (
                      <div key={i} className="bg-white p-2 rounded border text-sm">
                        • {fact}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Rastreamento da Decisão (Por quê? Como?)</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {explanationTrace.map((step, i) => (
                      <div key={i} className={`p-3 rounded text-sm ${
                        step.type === 'success' ? 'bg-green-100 border-l-4 border-green-500' :
                        step.type === 'infer' ? 'bg-blue-100 border-l-4 border-blue-500' :
                        step.type === 'rule' ? 'bg-yellow-100 border-l-4 border-yellow-500' :
                        'bg-white border-l-4 border-gray-300'
                      }`}>
                        {step.message}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'chat' && (
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm text-blue-800">
                    O assistente fará perguntas sobre o cliente. Responda cada pergunta para obter a análise de crédito.
                  </p>
                </div>

                <div className="bg-white border-2 rounded-lg h-96 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md px-4 py-2 rounded-lg whitespace-pre-line ${
                        msg.role === 'user' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua resposta..."
                    className="flex-1 p-3 border-2 rounded-lg focus:outline-none focus:border-green-500"
                  />
                  <button
                    onClick={handleChatSubmit}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerExpertSystem;