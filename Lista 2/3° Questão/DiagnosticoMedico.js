import React, { useState } from 'react';
import { Play, Database, Activity, MessageSquare, AlertCircle, Heart, Thermometer, Stethoscope } from 'lucide-react';

const MedicalExpertSystem = () => {
  const [rules] = useState([
    { id: 1, conditions: ['febre', 'tosse', 'dor de garganta'], conclusion: 'diagnóstico gripe', active: true },
    { id: 2, conditions: ['febre', 'tosse', 'fadiga'], conclusion: 'diagnóstico gripe', active: true },
    { id: 3, conditions: ['febre alta', 'dor muscular', 'fadiga'], conclusion: 'diagnóstico gripe', active: true },
    { id: 4, conditions: ['coriza', 'espirros', 'dor de garganta leve'], conclusion: 'diagnóstico resfriado', active: true },
    { id: 5, conditions: ['coriza', 'congestão nasal', 'tosse leve'], conclusion: 'diagnóstico resfriado', active: true },
    { id: 6, conditions: ['febre', 'tosse seca', 'perda de olfato'], conclusion: 'diagnóstico COVID-19 possível', active: true },
    { id: 7, conditions: ['febre', 'dificuldade respiratória', 'fadiga'], conclusion: 'diagnóstico COVID-19 possível', active: true },
    { id: 8, conditions: ['perda de paladar', 'perda de olfato', 'febre'], conclusion: 'diagnóstico COVID-19 possível', active: true },
    { id: 9, conditions: ['febre alta', 'tosse com catarro', 'dificuldade respiratória'], conclusion: 'diagnóstico pneumonia', active: true },
    { id: 10, conditions: ['febre alta', 'dor no peito', 'tosse'], conclusion: 'diagnóstico pneumonia', active: true },
    { id: 11, conditions: ['dor de garganta forte', 'febre', 'dificuldade para engolir'], conclusion: 'diagnóstico amigdalite', active: true },
    { id: 12, conditions: ['dor de garganta forte', 'placas na garganta', 'febre'], conclusion: 'diagnóstico amigdalite', active: true },
    { id: 13, conditions: ['tosse persistente', 'catarro', 'chiado no peito'], conclusion: 'diagnóstico bronquite', active: true },
    { id: 14, conditions: ['tosse prolongada', 'falta de ar', 'fadiga'], conclusion: 'diagnóstico bronquite', active: true },
    { id: 15, conditions: ['dor facial', 'congestão nasal', 'pressão na cabeça'], conclusion: 'diagnóstico sinusite', active: true },
    { id: 16, conditions: ['dor de cabeça', 'secreção nasal', 'pressão facial'], conclusion: 'diagnóstico sinusite', active: true },
    { id: 17, conditions: ['febre alta', 'dificuldade respiratória'], conclusion: 'gravidade alta', active: true },
    { id: 18, conditions: ['dor no peito', 'dificuldade respiratória'], conclusion: 'gravidade alta', active: true },
    { id: 19, conditions: ['diagnóstico pneumonia'], conclusion: 'gravidade alta', active: true },
    { id: 20, conditions: ['diagnóstico COVID-19 possível'], conclusion: 'gravidade média', active: true },
    { id: 21, conditions: ['diagnóstico gripe'], conclusion: 'gravidade média', active: true },
    { id: 22, conditions: ['diagnóstico resfriado'], conclusion: 'gravidade baixa', active: true },
    { id: 23, conditions: ['gravidade alta'], conclusion: 'recomendação procurar hospital urgente', active: true },
    { id: 24, conditions: ['gravidade média'], conclusion: 'recomendação consultar médico', active: true },
    { id: 25, conditions: ['gravidade baixa'], conclusion: 'recomendação repouso e hidratação', active: true }
  ]);

  const symptomsList = [
    'febre', 'febre alta', 'tosse', 'tosse seca', 'tosse leve', 'tosse persistente', 'tosse prolongada',
    'tosse com catarro', 'dor de garganta', 'dor de garganta leve', 'dor de garganta forte',
    'dor de cabeça', 'dor muscular', 'dor no peito', 'dor facial', 'coriza', 'espirros',
    'congestão nasal', 'secreção nasal', 'fadiga', 'perda de olfato', 'perda de paladar',
    'dificuldade respiratória', 'falta de ar', 'dificuldade para engolir', 'placas na garganta',
    'chiado no peito', 'catarro', 'pressão na cabeça', 'pressão facial'
  ];
  
  const [symptoms, setSymptoms] = useState([]);
  const [currentTab, setCurrentTab] = useState('input');
  const [inferenceResult, setInferenceResult] = useState(null);
  const [explanationTrace, setExplanationTrace] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', content: 'Olá! Sou um assistente de triagem médica. Vou fazer algumas perguntas sobre seus sintomas. ATENÇÃO: Este sistema é apenas educacional e não substitui consulta médica real.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [conversationStep, setConversationStep] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const forwardChaining = (initialFacts) => {
    let workingFacts = [...initialFacts];
    let trace = [];
    let newFactsAdded = true;
    let iteration = 0;

    trace.push({ type: 'start', message: `Sintomas identificados: ${workingFacts.join(', ')}` });

    while (newFactsAdded && iteration < 50) {
      newFactsAdded = false;
      iteration++;

      for (let rule of rules.filter(r => r.active)) {
        const allConditionsMet = rule.conditions.every(c => workingFacts.includes(c));
        const conclusionNotKnown = !workingFacts.includes(rule.conclusion);

        if (allConditionsMet && conclusionNotKnown) {
          trace.push({ 
            type: 'rule', 
            message: `Regra aplicada: SE ${rule.conditions.join(' E ')} ENTÃO ${rule.conclusion}`,
            rule 
          });
          trace.push({ type: 'infer', message: `✓ ${rule.conclusion}`, rule });
          workingFacts.push(rule.conclusion);
          newFactsAdded = true;
        }
      }
    }

    return { success: true, derivedFacts: workingFacts, trace };
  };

  const analyzeSSymptoms = () => {
    if (symptoms.length === 0) {
      alert('Por favor, selecione pelo menos um sintoma');
      return;
    }

    const result = forwardChaining(symptoms);
    
    const diagnoses = result.derivedFacts.filter(f => f.startsWith('diagnóstico'));
    const severity = result.derivedFacts.find(f => f.startsWith('gravidade'));
    const recommendation = result.derivedFacts.find(f => f.startsWith('recomendação'));
    
    setInferenceResult({ 
      success: true, 
      diagnoses,
      severity,
      recommendation,
      derivedFacts: result.derivedFacts 
    });
    setExplanationTrace(result.trace);
    setCurrentTab('result');
  };

  const toggleSymptom = (symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const conversationQuestions = [
    'Você está com febre?',
    'Você tem tosse? Se sim, é seca ou com catarro?',
    'Você sente dor de garganta?',
    'Você tem coriza ou nariz escorrendo?',
    'Você sente fadiga ou cansaço excessivo?',
    'Você tem dificuldade para respirar?',
    'Você perdeu o olfato ou paladar?'
  ];

  const processAnswer = (answer) => {
    const lower = answer.toLowerCase();
    const newSymptoms = [];
    
    if (lower.includes('febre alta') || lower.includes('muito alta')) {
      newSymptoms.push('febre alta');
    } else if (lower.includes('febre') || lower.includes('sim')) {
      if (conversationStep === 0) newSymptoms.push('febre');
    }
    
    if (lower.includes('tosse seca')) newSymptoms.push('tosse seca');
    else if (lower.includes('catarro')) newSymptoms.push('tosse com catarro');
    else if (lower.includes('tosse')) newSymptoms.push('tosse');
    
    if (lower.includes('dor de garganta forte')) newSymptoms.push('dor de garganta forte');
    else if (lower.includes('dor de garganta')) newSymptoms.push('dor de garganta');
    
    if (lower.includes('coriza')) newSymptoms.push('coriza');
    if (lower.includes('fadiga') || lower.includes('cansaço')) newSymptoms.push('fadiga');
    if (lower.includes('dificuldade') && lower.includes('respirar')) newSymptoms.push('dificuldade respiratória');
    if (lower.includes('olfato')) newSymptoms.push('perda de olfato');
    if (lower.includes('paladar')) newSymptoms.push('perda de paladar');
    
    return newSymptoms;
  };

  const handleChatSubmit = () => {
    if (!userInput.trim()) return;

    const userMessage = { role: 'user', content: userInput };
    setChatMessages([...chatMessages, userMessage]);

    if (conversationStep < conversationQuestions.length) {
      const detectedSymptoms = processAnswer(userInput);
      setSelectedSymptoms([...selectedSymptoms, ...detectedSymptoms]);

      if (conversationStep === conversationQuestions.length - 1) {
        setChatMessages(prev => [...prev, 
          { role: 'system', content: 'Obrigado! Analisando seus sintomas...' }
        ]);
        
        setTimeout(() => {
          const allSymptoms = [...new Set([...selectedSymptoms, ...detectedSymptoms])];
          const result = forwardChaining(allSymptoms);
          
          const diagnoses = result.derivedFacts.filter(f => f.startsWith('diagnóstico'));
          const severity = result.derivedFacts.find(f => f.startsWith('gravidade'));
          const recommendation = result.derivedFacts.find(f => f.startsWith('recomendação'));
          
          let message = 'Análise concluída!\n\n';
          if (diagnoses.length > 0) {
            message += `POSSÍVEL DIAGNÓSTICO: ${diagnoses.map(d => d.replace('diagnóstico ', '')).join(', ')}\n\n`;
          }
          if (severity) {
            message += `GRAVIDADE: ${severity.replace('gravidade ', '').toUpperCase()}\n\n`;
          }
          if (recommendation) {
            message += `RECOMENDAÇÃO: ${recommendation.replace('recomendação ', '')}\n\n`;
          }
          message += 'LEMBRE-SE: Consulte um médico real para diagnóstico definitivo!';
          
          setChatMessages(prev => [...prev, { role: 'system', content: message }]);
          
          setInferenceResult({ success: true, diagnoses, severity, recommendation, derivedFacts: result.derivedFacts });
          setExplanationTrace(result.trace);
          setSymptoms(allSymptoms);
        }, 1000);
      } else {
        const nextQuestion = conversationQuestions[conversationStep + 1];
        setChatMessages(prev => [...prev, { role: 'system', content: nextQuestion }]);
      }
      
      setConversationStep(conversationStep + 1);
    }

    setUserInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (currentTab === 'chat') handleChatSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-white">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Stethoscope className="w-8 h-8" />
              Sistema de Diagnóstico Médico
            </h1>
            <p className="mt-2 text-red-100">Sistema especialista para triagem de sintomas respiratórios</p>
            <div className="mt-3 bg-red-700 p-2 rounded text-sm">
              ⚠️ AVISO: Este sistema é apenas educacional. Não substitui consulta médica profissional!
            </div>
          </div>

          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => setCurrentTab('input')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                currentTab === 'input' 
                  ? 'border-b-2 border-red-600 text-red-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Thermometer className="w-4 h-4" />
              Sintomas
            </button>
            <button
              onClick={() => setCurrentTab('rules')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                currentTab === 'rules' 
                  ? 'border-b-2 border-red-600 text-red-600 bg-white' 
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
                  ? 'border-b-2 border-red-600 text-red-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              Diagnóstico
            </button>
            <button
              onClick={() => setCurrentTab('chat')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                currentTab === 'chat' 
                  ? 'border-b-2 border-red-600 text-red-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Consulta Interativa
            </button>
          </div>

          <div className="p-6">
            {currentTab === 'input' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm text-blue-800">
                    Selecione os sintomas que você está apresentando. O sistema analisará e sugerirá possíveis diagnósticos.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-4">Selecione os Sintomas</h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    {symptomsList.map((symptom, i) => (
                      <button
                        key={i}
                        onClick={() => toggleSymptom(symptom)}
                        className={`p-3 rounded-lg text-left text-sm transition-all ${
                          symptoms.includes(symptom)
                            ? 'bg-red-500 text-white font-medium'
                            : 'bg-white border-2 border-gray-300 hover:border-red-300'
                        }`}
                      >
                        {symptoms.includes(symptom) && '✓ '}
                        {symptom}
                      </button>
                    ))}
                  </div>

                  {symptoms.length > 0 && (
                    <div className="mt-4 p-4 bg-white rounded border">
                      <strong>Sintomas selecionados ({symptoms.length}):</strong>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {symptoms.map((s, i) => (
                          <span key={i} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={analyzeSSymptoms}
                    className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-lg font-medium"
                  >
                    <Play className="w-5 h-5" />
                    Analisar Sintomas
                  </button>
                </div>
              </div>
            )}

            {currentTab === 'rules' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Base de Conhecimento Médico</h3>
                <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {rules.map(rule => (
                    <div key={rule.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                      <div className="text-xs font-medium text-gray-500 mb-1">Regra {rule.id}</div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">SE:</span>
                        <div className="ml-4 mt-1">
                          {rule.conditions.map((c, i) => (
                            <div key={i} className="text-gray-600">• {c}</div>
                          ))}
                        </div>
                        <span className="font-medium text-gray-700 mt-2 block">ENTÃO:</span>
                        <div className="ml-4 text-red-600 font-medium">{rule.conclusion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTab === 'result' && inferenceResult && (
              <div className="space-y-6">
                <div className="bg-red-50 border-4 border-red-500 p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6" />
                    Resultado da Análise
                  </h2>
                  
                  {inferenceResult.diagnoses && inferenceResult.diagnoses.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-bold text-lg mb-2">Possível(is) Diagnóstico(s):</h3>
                      {inferenceResult.diagnoses.map((d, i) => (
                        <div key={i} className="bg-white p-3 rounded mb-2 text-lg">
                          • {d.replace('diagnóstico ', '').toUpperCase()}
                        </div>
                      ))}
                    </div>
                  )}

                  {inferenceResult.severity && (
                    <div className={`p-4 rounded mb-4 ${
                      inferenceResult.severity.includes('alta') ? 'bg-red-200 border-2 border-red-600' :
                      inferenceResult.severity.includes('média') ? 'bg-yellow-200 border-2 border-yellow-600' :
                      'bg-green-200 border-2 border-green-600'
                    }`}>
                      <strong>Gravidade:</strong> {inferenceResult.severity.replace('gravidade ', '').toUpperCase()}
                    </div>
                  )}

                  {inferenceResult.recommendation && (
                    <div className="bg-blue-100 border-2 border-blue-500 p-4 rounded">
                      <strong>Recomendação:</strong> {inferenceResult.recommendation.replace('recomendação ', '')}
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-yellow-100 border-2 border-yellow-500 rounded">
                    <strong>⚠️ IMPORTANTE:</strong> Este é apenas um sistema educacional. Consulte um médico real para diagnóstico e tratamento adequados!
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Sintomas Identificados</h3>
                  <div className="grid md:grid-cols-3 gap-2">
                    {symptoms.map((symptom, i) => (
                      <div key={i} className="bg-white p-2 rounded border text-sm">
                        • {symptom}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Rastreamento do Diagnóstico</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {explanationTrace.map((step, i) => (
                      <div key={i} className={`p-3 rounded text-sm ${
                        step.type === 'infer' ? 'bg-blue-100 border-l-4 border-blue-500' :
                        step.type === 'rule' ? 'bg-yellow-100 border-l-4 border-yellow-500' :
                        step.type === 'start' ? 'bg-green-100 border-l-4 border-green-500' :
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
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>AVISO MÉDICO:</strong> Este assistente é apenas para fins educacionais. Para qualquer problema de saúde, consulte um profissional médico qualificado.
                  </p>
                </div>

                <div className="bg-white border-2 rounded-lg h-96 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md px-4 py-2 rounded-lg whitespace-pre-line ${
                        msg.role === 'user' 
                          ? 'bg-red-600 text-white' 
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
                    className="flex-1 p-3 border-2 rounded-lg focus:outline-none focus:border-red-500"
                  />
                  <button
                    onClick={handleChatSubmit}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
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

export default MedicalExpertSystem;