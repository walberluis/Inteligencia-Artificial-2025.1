import React, { useState } from 'react';
import { Play, Plus, Trash2, X, HelpCircle, Lightbulb, Database, Brain, MessageSquare } from 'lucide-react';

const ExpertSystem = () => {
  const [rules, setRules] = useState([
    { id: 1, conditions: ['animal tem pelos', 'animal amamenta'], conclusion: 'animal é mamífero', active: true },
    { id: 2, conditions: ['animal tem penas', 'animal bota ovos'], conclusion: 'animal é ave', active: true },
    { id: 3, conditions: ['animal é mamífero', 'animal come carne'], conclusion: 'animal é carnívoro', active: true }
  ]);
  
  const [facts, setFacts] = useState(['animal tem pelos', 'animal amamenta', 'animal come carne']);
  const [goals, setGoals] = useState(['animal é carnívoro']);
  const [currentTab, setCurrentTab] = useState('editor');
  const [inferenceMode, setInferenceMode] = useState('backward');
  const [newCondition, setNewCondition] = useState('');
  const [newConclusion, setNewConclusion] = useState('');
  const [inferenceResult, setInferenceResult] = useState(null);
  const [explanationTrace, setExplanationTrace] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [newFactInput, setNewFactInput] = useState('');
  const [newGoalInput, setNewGoalInput] = useState('');

  const addRule = () => {
    if (newCondition && newConclusion) {
      const conditions = newCondition.split(',').map(c => c.trim()).filter(c => c);
      const newRule = {
        id: Date.now(),
        conditions,
        conclusion: newConclusion.trim(),
        active: true
      };
      setRules([...rules, newRule]);
      setNewCondition('');
      setNewConclusion('');
    }
  };

  const deleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const toggleRule = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const addFact = (fact) => {
    if (fact && !facts.includes(fact)) {
      setFacts([...facts, fact.trim()]);
    }
  };

  const removeFact = (fact) => {
    setFacts(facts.filter(f => f !== fact));
  };

  const backwardChaining = (goal, currentFacts, trace = []) => {
    if (currentFacts.includes(goal)) {
      trace.push({ type: 'success', message: `Objetivo "${goal}" encontrado nos fatos` });
      return { success: true, trace };
    }

    for (let rule of rules.filter(r => r.active)) {
      if (rule.conclusion === goal) {
        trace.push({ 
          type: 'rule', 
          message: `Tentando regra: SE ${rule.conditions.join(' E ')} ENTÃO ${rule.conclusion}`,
          rule 
        });

        let allConditionsMet = true;
        let newFacts = [...currentFacts];

        for (let condition of rule.conditions) {
          if (!newFacts.includes(condition)) {
            trace.push({ type: 'subgoal', message: `Tentando provar subobjetivo: "${condition}"` });
            const result = backwardChaining(condition, newFacts, trace);
            
            if (result.success) {
              newFacts.push(condition);
            } else {
              allConditionsMet = false;
              trace.push({ type: 'fail', message: `Falha ao provar: "${condition}"` });
              break;
            }
          } else {
            trace.push({ type: 'found', message: `Condição "${condition}" já conhecida` });
          }
        }

        if (allConditionsMet) {
          trace.push({ type: 'infer', message: `Inferido: "${goal}"`, rule });
          newFacts.push(goal);
          return { success: true, trace, derivedFacts: newFacts };
        }
      }
    }

    trace.push({ type: 'fail', message: `Não foi possível provar: "${goal}"` });
    return { success: false, trace };
  };

  const forwardChaining = (initialFacts) => {
    let workingFacts = [...initialFacts];
    let trace = [];
    let newFactsAdded = true;
    let iteration = 0;

    trace.push({ type: 'start', message: `Fatos iniciais: ${workingFacts.join(', ')}` });

    while (newFactsAdded && iteration < 100) {
      newFactsAdded = false;
      iteration++;

      trace.push({ type: 'iteration', message: `--- Iteração ${iteration} ---` });

      for (let rule of rules.filter(r => r.active)) {
        const allConditionsMet = rule.conditions.every(c => workingFacts.includes(c));
        const conclusionNotKnown = !workingFacts.includes(rule.conclusion);

        if (allConditionsMet && conclusionNotKnown) {
          trace.push({ 
            type: 'rule', 
            message: `Regra disparada: SE ${rule.conditions.join(' E ')} ENTÃO ${rule.conclusion}`,
            rule 
          });
          trace.push({ type: 'infer', message: `Novo fato inferido: "${rule.conclusion}"`, rule });
          workingFacts.push(rule.conclusion);
          newFactsAdded = true;
        }
      }

      if (!newFactsAdded) {
        trace.push({ type: 'complete', message: 'Nenhum novo fato inferido. Processo concluído.' });
      }
    }

    trace.push({ type: 'result', message: `Fatos finais: ${workingFacts.join(', ')}` });
    return { success: true, derivedFacts: workingFacts, trace };
  };

  const runInference = () => {
    setExplanationTrace([]);
    
    if (inferenceMode === 'backward') {
      if (goals.length === 0) {
        setInferenceResult({ success: false, message: 'Nenhum objetivo definido' });
        return;
      }
      
      const goal = goals[0];
      const result = backwardChaining(goal, facts, []);
      setInferenceResult(result);
      setExplanationTrace(result.trace);
    } else {
      const result = forwardChaining(facts);
      setInferenceResult(result);
      setExplanationTrace(result.trace);
    }
  };

  const processNaturalLanguage = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('animal tem') || lowerInput.includes('animal é') || 
        lowerInput.includes('animal come') || lowerInput.includes('animal bota')) {
      const fact = input.trim();
      addFact(fact);
      return `Fato adicionado: "${fact}"`;
    }
    
    if (lowerInput.includes('o que') || lowerInput.includes('qual') || lowerInput.includes('consultar')) {
      runInference();
      return 'Executando inferência com os fatos atuais...';
    }
    
    if (lowerInput.includes('por que') || lowerInput.includes('porque') || lowerInput.includes('por quê')) {
      if (explanationTrace.length > 0) {
        const ruleExplanations = explanationTrace
          .filter(t => t.type === 'infer')
          .map(t => `Porque: ${t.rule.conditions.join(' E ')}`);
        return ruleExplanations.length > 0 
          ? ruleExplanations.join('\n') 
          : 'Não há explicação disponível.';
      }
      return 'Execute uma inferência primeiro.';
    }
    
    if (lowerInput.includes('como')) {
      if (explanationTrace.length > 0) {
        return 'Veja o rastreamento na aba "Motor de Inferência" para detalhes do processo.';
      }
      return 'Execute uma inferência primeiro.';
    }
    
    return 'Não entendi. Você pode dizer coisas como: "animal tem pelos", "o que é o animal?", "por que?", "como?"';
  };

  const handleChatSubmit = () => {
    if (!userInput.trim()) return;

    const userMessage = { role: 'user', content: userInput };
    const response = processNaturalLanguage(userInput);
    const systemMessage = { role: 'system', content: response };

    setChatMessages([...chatMessages, userMessage, systemMessage]);
    setUserInput('');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Brain className="w-8 h-8" />
              Sistema Especialista - Base de Conhecimento
            </h1>
            <p className="mt-2 text-blue-100">Sistema de inferência com encadeamento para frente e para trás</p>
          </div>

          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => setCurrentTab('editor')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                currentTab === 'editor' 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Database className="w-4 h-4" />
              Editor de Base
            </button>
            <button
              onClick={() => setCurrentTab('inference')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                currentTab === 'inference' 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Brain className="w-4 h-4" />
              Motor de Inferência
            </button>
            <button
              onClick={() => setCurrentTab('chat')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                currentTab === 'chat' 
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Interface Natural
            </button>
          </div>

          <div className="p-6">
            {currentTab === 'editor' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Regras (SE...ENTÃO...)
                    </h3>
                    
                    <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                      {rules.map(rule => (
                        <div key={rule.id} className={`p-3 rounded border-l-4 ${
                          rule.active ? 'bg-white border-green-500' : 'bg-gray-200 border-gray-400'
                        }`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-700">SE:</div>
                              <div className="ml-4 text-sm">
                                {rule.conditions.map((c, i) => (
                                  <div key={i}>• {c}</div>
                                ))}
                              </div>
                              <div className="text-sm font-medium text-gray-700 mt-2">ENTÃO:</div>
                              <div className="ml-4 text-sm text-blue-600 font-medium">{rule.conclusion}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => toggleRule(rule.id)}
                                className={`p-1 rounded ${
                                  rule.active ? 'bg-green-100 text-green-600' : 'bg-gray-300 text-gray-600'
                                }`}
                              >
                                {rule.active ? '✓' : '✗'}
                              </button>
                              <button
                                onClick={() => deleteRule(rule.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Condições (separadas por vírgula)"
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Conclusão"
                        value={newConclusion}
                        onChange={(e) => setNewConclusion(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, addRule)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={addRule}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Regra
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5 text-blue-500" />
                        Fatos Conhecidos
                      </h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto mb-3">
                        {facts.map((fact, i) => (
                          <div key={i} className="flex justify-between items-center bg-white p-2 rounded border">
                            <span className="text-sm">{fact}</span>
                            <button
                              onClick={() => removeFact(fact)}
                              className="text-red-600 hover:bg-red-50 p-1 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Adicionar fato (pressione Enter)"
                        value={newFactInput}
                        onChange={(e) => setNewFactInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newFactInput) {
                            addFact(newFactInput);
                            setNewFactInput('');
                          }
                        }}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-purple-500" />
                        Objetivos
                      </h3>
                      <div className="space-y-2 mb-3">
                        {goals.map((goal, i) => (
                          <div key={i} className="flex justify-between items-center bg-white p-2 rounded border">
                            <span className="text-sm font-medium text-purple-600">{goal}</span>
                            <button
                              onClick={() => setGoals(goals.filter((_, idx) => idx !== i))}
                              className="text-red-600 hover:bg-red-50 p-1 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Adicionar objetivo (pressione Enter)"
                        value={newGoalInput}
                        onChange={(e) => setNewGoalInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newGoalInput) {
                            setGoals([...goals, newGoalInput]);
                            setNewGoalInput('');
                          }
                        }}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'inference' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Configuração de Inferência</h3>
                  
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => setInferenceMode('backward')}
                      className={`flex-1 py-3 rounded-lg font-medium ${
                        inferenceMode === 'backward'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border-2 border-gray-300'
                      }`}
                    >
                      Encadeamento para Trás
                    </button>
                    <button
                      onClick={() => setInferenceMode('forward')}
                      className={`flex-1 py-3 rounded-lg font-medium ${
                        inferenceMode === 'forward'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border-2 border-gray-300'
                      }`}
                    >
                      Encadeamento para Frente
                    </button>
                  </div>

                  <button
                    onClick={runInference}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-lg font-medium"
                  >
                    <Play className="w-5 h-5" />
                    Executar Inferência
                  </button>
                </div>

                {inferenceResult && (
                  <div className="space-y-4">
                    <div className={`p-6 rounded-lg ${
                      inferenceResult.success ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
                    }`}>
                      <h3 className="text-xl font-bold mb-2">
                        {inferenceResult.success ? '✓ Sucesso' : '✗ Falha'}
                      </h3>
                      {inferenceResult.message && <p>{inferenceResult.message}</p>}
                      {inferenceResult.derivedFacts && (
                        <div className="mt-3">
                          <p className="font-medium">Fatos derivados:</p>
                          <div className="ml-4 mt-2">
                            {inferenceResult.derivedFacts.map((f, i) => (
                              <div key={i} className="text-sm">• {f}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-4">Rastreamento de Inferência (Explanação - Por quê? Como?)</h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {explanationTrace.map((step, i) => (
                          <div key={i} className={`p-3 rounded text-sm ${
                            step.type === 'success' ? 'bg-green-100 border-l-4 border-green-500' :
                            step.type === 'fail' ? 'bg-red-100 border-l-4 border-red-500' :
                            step.type === 'infer' ? 'bg-blue-100 border-l-4 border-blue-500' :
                            step.type === 'rule' ? 'bg-yellow-100 border-l-4 border-yellow-500' :
                            step.type === 'iteration' ? 'bg-purple-100 border-l-4 border-purple-500 font-bold' :
                            'bg-white border-l-4 border-gray-300'
                          }`}>
                            {step.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentTab === 'chat' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Diálogo em Linguagem Natural</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Experimente comandos como: "animal tem pelos", "animal amamenta", "o que é o animal?", "por que?", "como?"
                  </p>
                </div>

                <div className="bg-white border-2 rounded-lg h-96 overflow-y-auto p-4 space-y-3">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-gray-400 mt-20">
                      Inicie a conversa digitando um fato ou pergunta...
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white' 
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
                    onKeyPress={(e) => handleKeyPress(e, handleChatSubmit)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 p-3 border-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleChatSubmit}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
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

export default ExpertSystem;