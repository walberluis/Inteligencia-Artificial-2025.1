import React, { useState } from 'react';
import { Play, Database, Brain, MessageSquare, Star, Sparkles, HelpCircle, RefreshCw } from 'lucide-react';

const MiniAkinator = () => {
  const [rules] = useState([
    { id: 1, conditions: ['é animal', 'tem 4 patas', 'late'], conclusion: 'personagem cachorro', active: true },
    { id: 2, conditions: ['é animal', 'tem 4 patas', 'mia'], conclusion: 'personagem gato', active: true },
    { id: 3, conditions: ['é animal', 'voa', 'canta'], conclusion: 'personagem pássaro', active: true },
    { id: 4, conditions: ['é personagem', 'é rato', 'usa luvas brancas'], conclusion: 'personagem Mickey Mouse', active: true },
    { id: 5, conditions: ['é personagem', 'é pato', 'usa roupa de marinheiro'], conclusion: 'personagem Pato Donald', active: true },
    { id: 6, conditions: ['é personagem', 'é princesa', 'tem cabelo muito longo'], conclusion: 'personagem Rapunzel', active: true },
    { id: 7, conditions: ['é personagem', 'é princesa', 'perdeu sapato'], conclusion: 'personagem Cinderela', active: true },
    { id: 8, conditions: ['é personagem', 'tem poderes de gelo', 'canta Let It Go'], conclusion: 'personagem Elsa', active: true },
    { id: 9, conditions: ['é super-herói', 'voa', 'usa capa vermelha'], conclusion: 'personagem Superman', active: true },
    { id: 10, conditions: ['é super-herói', 'tem teia', 'escala paredes'], conclusion: 'personagem Homem-Aranha', active: true },
    { id: 11, conditions: ['é super-herói', 'é rico', 'usa armadura preta'], conclusion: 'personagem Batman', active: true },
    { id: 12, conditions: ['é super-herói', 'é mulher', 'usa laço da verdade'], conclusion: 'personagem Mulher-Maravilha', active: true },
    { id: 13, conditions: ['é super-herói', 'é verde', 'fica forte quando irritado'], conclusion: 'personagem Hulk', active: true },
    { id: 14, conditions: ['é personagem de jogo', 'é encanador', 'usa boné vermelho'], conclusion: 'personagem Mario', active: true },
    { id: 15, conditions: ['é personagem de jogo', 'é encanador', 'usa boné verde'], conclusion: 'personagem Luigi', active: true },
    { id: 16, conditions: ['é personagem de jogo', 'é ouriço', 'corre muito rápido'], conclusion: 'personagem Sonic', active: true },
    { id: 17, conditions: ['é personagem de jogo', 'captura monstrinhos', 'usa boné'], conclusion: 'personagem Ash Ketchum', active: true },
    { id: 18, conditions: ['é personagem de jogo', 'é amarelo', 'fala pika pika'], conclusion: 'personagem Pikachu', active: true },
    { id: 19, conditions: ['é personagem', 'tem cicatriz', 'é bruxo'], conclusion: 'personagem Harry Potter', active: true },
    { id: 20, conditions: ['é personagem', 'é ogro', 'é verde'], conclusion: 'personagem Shrek', active: true },
    { id: 21, conditions: ['é personagem', 'é boneco de neve', 'gosta de verão'], conclusion: 'personagem Olaf', active: true },
    { id: 22, conditions: ['é personagem', 'é peixe', 'tem memória curta'], conclusion: 'personagem Dory', active: true },
    { id: 23, conditions: ['é personagem', 'é cowboy', 'tem chapéu'], conclusion: 'personagem Woody', active: true },
    { id: 24, conditions: ['late'], conclusion: 'é animal', active: true },
    { id: 25, conditions: ['mia'], conclusion: 'é animal', active: true },
    { id: 26, conditions: ['usa luvas brancas'], conclusion: 'é personagem', active: true },
    { id: 27, conditions: ['é princesa'], conclusion: 'é personagem', active: true },
    { id: 28, conditions: ['voa', 'usa capa'], conclusion: 'é super-herói', active: true },
    { id: 29, conditions: ['tem poderes'], conclusion: 'é super-herói', active: true },
    { id: 30, conditions: ['usa boné vermelho', 'é encanador'], conclusion: 'é personagem de jogo', active: true }
  ]);

  const questions = [
    { id: 1, text: 'É um animal real?', fact: 'é animal' },
    { id: 2, text: 'É um personagem fictício?', fact: 'é personagem' },
    { id: 3, text: 'É um super-herói?', fact: 'é super-herói' },
    { id: 4, text: 'É de um videogame?', fact: 'é personagem de jogo' },
    { id: 5, text: 'É uma princesa?', fact: 'é princesa' },
    { id: 6, text: 'Tem 4 patas?', fact: 'tem 4 patas' },
    { id: 7, text: 'Late?', fact: 'late' },
    { id: 8, text: 'Mia?', fact: 'mia' },
    { id: 9, text: 'Voa?', fact: 'voa' },
    { id: 10, text: 'Canta?', fact: 'canta' },
    { id: 11, text: 'É um rato?', fact: 'é rato' },
    { id: 12, text: 'É um pato?', fact: 'é pato' },
    { id: 13, text: 'Usa luvas brancas?', fact: 'usa luvas brancas' },
    { id: 14, text: 'Usa roupa de marinheiro?', fact: 'usa roupa de marinheiro' },
    { id: 15, text: 'Tem cabelo muito longo?', fact: 'tem cabelo muito longo' },
    { id: 16, text: 'Perdeu um sapato?', fact: 'perdeu sapato' },
    { id: 17, text: 'Tem poderes de gelo?', fact: 'tem poderes de gelo' },
    { id: 18, text: 'Canta "Let It Go"?', fact: 'canta Let It Go' },
    { id: 19, text: 'Usa capa vermelha?', fact: 'usa capa vermelha' },
    { id: 20, text: 'Tem teia?', fact: 'tem teia' },
    { id: 21, text: 'Escala paredes?', fact: 'escala paredes' },
    { id: 22, text: 'É rico?', fact: 'é rico' },
    { id: 23, text: 'Usa armadura preta?', fact: 'usa armadura preta' },
    { id: 24, text: 'É mulher?', fact: 'é mulher' },
    { id: 25, text: 'Usa laço da verdade?', fact: 'usa laço da verdade' },
    { id: 26, text: 'É verde?', fact: 'é verde' },
    { id: 27, text: 'Fica forte quando irritado?', fact: 'fica forte quando irritado' },
    { id: 28, text: 'É encanador?', fact: 'é encanador' },
    { id: 29, text: 'Usa boné vermelho?', fact: 'usa boné vermelho' },
    { id: 30, text: 'Usa boné verde?', fact: 'usa boné verde' },
    { id: 31, text: 'É um ouriço?', fact: 'é ouriço' },
    { id: 32, text: 'Corre muito rápido?', fact: 'corre muito rápido' },
    { id: 33, text: 'Captura monstrinhos?', fact: 'captura monstrinhos' },
    { id: 34, text: 'É amarelo?', fact: 'é amarelo' },
    { id: 35, text: 'Fala "pika pika"?', fact: 'fala pika pika' },
    { id: 36, text: 'Tem uma cicatriz?', fact: 'tem cicatriz' },
    { id: 37, text: 'É bruxo?', fact: 'é bruxo' },
    { id: 38, text: 'É um ogro?', fact: 'é ogro' },
    { id: 39, text: 'É um boneco de neve?', fact: 'é boneco de neve' },
    { id: 40, text: 'Gosta de verão?', fact: 'gosta de verão' },
    { id: 41, text: 'É um peixe?', fact: 'é peixe' },
    { id: 42, text: 'Tem memória curta?', fact: 'tem memória curta' },
    { id: 43, text: 'É cowboy?', fact: 'é cowboy' },
    { id: 44, text: 'Tem chapéu?', fact: 'tem chapéu' },
    { id: 45, text: 'Usa boné?', fact: 'usa boné' }
  ];
  
  const [facts, setFacts] = useState([]);
  const [currentTab, setCurrentTab] = useState('game');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [gameState, setGameState] = useState('playing');
  const [guessedCharacter, setGuessedCharacter] = useState(null);
  const [explanationTrace, setExplanationTrace] = useState([]);

  const backwardChaining = (goal, currentFacts, trace = [], visited = new Set()) => {
    if (visited.has(goal)) {
      return { success: false, trace };
    }
    visited.add(goal);

    if (currentFacts.includes(goal)) {
      trace.push({ type: 'success', message: `✓ "${goal}" já é conhecido` });
      return { success: true, trace };
    }

    for (let rule of rules.filter(r => r.active)) {
      if (rule.conclusion === goal) {
        trace.push({ 
          type: 'rule', 
          message: `Testando: SE ${rule.conditions.join(' E ')} ENTÃO ${rule.conclusion}`,
          rule 
        });

        let allConditionsMet = true;
        let newFacts = [...currentFacts];

        for (let condition of rule.conditions) {
          if (!newFacts.includes(condition)) {
            const result = backwardChaining(condition, newFacts, trace, new Set(visited));
            
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

  const forwardChaining = (initialFacts) => {
    let workingFacts = [...initialFacts];
    let trace = [];
    let newFactsAdded = true;
    let iteration = 0;

    while (newFactsAdded && iteration < 20) {
      newFactsAdded = false;
      iteration++;

      for (let rule of rules.filter(r => r.active)) {
        const allConditionsMet = rule.conditions.every(c => workingFacts.includes(c));
        const conclusionNotKnown = !workingFacts.includes(rule.conclusion);

        if (allConditionsMet && conclusionNotKnown) {
          trace.push({ 
            type: 'infer', 
            message: `Regra: SE ${rule.conditions.join(' E ')} ENTÃO ${rule.conclusion}`,
            rule 
          });
          workingFacts.push(rule.conclusion);
          newFactsAdded = true;
        }
      }
    }

    return { derivedFacts: workingFacts, trace };
  };

  const getNextQuestion = () => {
    const availableQuestions = questions.filter(q => !askedQuestions.includes(q.id));
    
    if (availableQuestions.length === 0) return null;
    
    for (let question of availableQuestions) {
      if (!facts.includes(question.fact)) {
        return question;
      }
    }
    
    return availableQuestions[0];
  };

  const handleAnswer = (answer) => {
    const question = questions[currentQuestion];
    
    if (answer === 'sim') {
      setFacts([...facts, question.fact]);
    }
    
    setAskedQuestions([...askedQuestions, question.id]);
    
    const newFacts = answer === 'sim' ? [...facts, question.fact] : facts;
    const result = forwardChaining(newFacts);
    
    const characterGuess = result.derivedFacts.find(f => f.startsWith('personagem'));
    
    if (characterGuess) {
      setGuessedCharacter(characterGuess.replace('personagem ', ''));
      setExplanationTrace(result.trace);
      setGameState('guessing');
      return;
    }
    
    const nextQ = getNextQuestion();
    if (nextQ) {
      setCurrentQuestion(questions.indexOf(nextQ));
    } else {
      setGameState('giveup');
    }
  };

  const handleGuessResponse = (correct) => {
    if (correct) {
      setGameState('won');
    } else {
      const nextQ = getNextQuestion();
      if (nextQ) {
        setCurrentQuestion(questions.indexOf(nextQ));
        setGameState('playing');
        setGuessedCharacter(null);
      } else {
        setGameState('giveup');
      }
    }
  };

  const resetGame = () => {
    setFacts([]);
    setAskedQuestions([]);
    setCurrentQuestion(0);
    setGameState('playing');
    setGuessedCharacter(null);
    setExplanationTrace([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              Mini-Akinator - Adivinhador de Personagens
            </h1>
            <p className="mt-2 text-purple-100">Pense em um personagem e eu tentarei adivinhar!</p>
          </div>

          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => setCurrentTab('game')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                currentTab === 'game' 
                  ? 'border-b-2 border-purple-600 text-purple-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Star className="w-4 h-4" />
              Jogar
            </button>
            <button
              onClick={() => setCurrentTab('rules')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                currentTab === 'rules' 
                  ? 'border-b-2 border-purple-600 text-purple-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Database className="w-4 h-4" />
              Base de Conhecimento
            </button>
            <button
              onClick={() => setCurrentTab('explanation')}
              className={`px-6 py-3 font-medium flex items-center gap-2 ${
                currentTab === 'explanation' 
                  ? 'border-b-2 border-purple-600 text-purple-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Brain className="w-4 h-4" />
              Como Funciona?
            </button>
          </div>

          <div className="p-6">
            {currentTab === 'game' && (
              <div className="max-w-2xl mx-auto">
                {gameState === 'playing' && (
                  <div className="space-y-6">
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                      <p className="text-purple-800">
                        <strong>Como jogar:</strong> Pense em um personagem (pode ser de filme, série, jogo, etc.) e responda às perguntas. Vou tentar adivinhar!
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-8 rounded-lg text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        Pergunta {askedQuestions.length + 1}
                      </div>
                      <h2 className="text-2xl font-bold mb-8">
                        {questions[currentQuestion].text}
                      </h2>
                      
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => handleAnswer('sim')}
                          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-bold transition-all"
                        >
                          ✓ SIM
                        </button>
                        <button
                          onClick={() => handleAnswer('nao')}
                          className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold transition-all"
                        >
                          ✗ NÃO
                        </button>
                      </div>
                    </div>

                    {facts.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold mb-2">Informações coletadas:</h3>
                        <div className="flex flex-wrap gap-2">
                          {facts.map((fact, i) => (
                            <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                              {fact}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {gameState === 'guessing' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-8 rounded-lg text-center border-4 border-yellow-500">
                      <div className="text-6xl mb-4">🎯</div>
                      <h2 className="text-3xl font-bold mb-4">
                        Eu acho que é...
                      </h2>
                      <div className="text-4xl font-bold text-purple-600 mb-6">
                        {guessedCharacter}!
                      </div>
                      
                      <p className="text-lg mb-6">Acertei?</p>
                      
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => handleGuessResponse(true)}
                          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-bold"
                        >
                          ✓ SIM, ACERTOU!
                        </button>
                        <button
                          onClick={() => handleGuessResponse(false)}
                          className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold"
                        >
                          ✗ NÃO, ERROU
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold mb-2">Raciocínio (Por quê?):</h3>
                      <div className="space-y-1">
                        {explanationTrace.map((step, i) => (
                          <div key={i} className="text-sm bg-white p-2 rounded border-l-2 border-purple-500">
                            {step.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {gameState === 'won' && (
                  <div className="text-center space-y-6">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-8 rounded-lg border-4 border-green-500">
                      <div className="text-6xl mb-4">🎉</div>
                      <h2 className="text-4xl font-bold mb-4 text-green-600">
                        CONSEGUI!
                      </h2>
                      <p className="text-xl">Adivinhei seu personagem: <strong>{guessedCharacter}</strong></p>
                    </div>
                    
                    <button
                      onClick={resetGame}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-xl font-bold flex items-center gap-2 mx-auto"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Jogar Novamente
                    </button>
                  </div>
                )}

                {gameState === 'giveup' && (
                  <div className="text-center space-y-6">
                    <div className="bg-gradient-to-r from-gray-100 to-slate-100 p-8 rounded-lg border-4 border-gray-500">
                      <div className="text-6xl mb-4">🤔</div>
                      <h2 className="text-3xl font-bold mb-4">
                        Desisto!
                      </h2>
                      <p className="text-xl">Não consegui adivinhar seu personagem com as informações disponíveis.</p>
                      <p className="text-gray-600 mt-4">Talvez ele não esteja na minha base de conhecimento ainda!</p>
                    </div>
                    
                    <button
                      onClick={resetGame}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-xl font-bold flex items-center gap-2 mx-auto"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Tentar Outro Personagem
                    </button>
                  </div>
                )}
              </div>
            )}

            {currentTab === 'rules' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Base de Conhecimento - Personagens</h3>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    O sistema conhece {rules.filter(r => r.conclusion.startsWith('personagem')).length} personagens diferentes!
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {rules.map(rule => (
                    <div key={rule.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <div className="text-xs font-medium text-gray-500 mb-1">Regra {rule.id}</div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">SE:</span>
                        <div className="ml-4 mt-1">
                          {rule.conditions.map((c, i) => (
                            <div key={i} className="text-gray-600">• {c}</div>
                          ))}
                        </div>
                        <span className="font-medium text-gray-700 mt-2 block">ENTÃO:</span>
                        <div className="ml-4 text-purple-600 font-medium">{rule.conclusion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTab === 'explanation' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <h3 className="text-2xl font-bold mb-4">Como o Mini-Akinator Funciona?</h3>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Encadeamento para Frente (Forward Chaining)
                  </h4>
                  <p className="text-gray-700 mb-3">
                    O sistema usa <strong>encadeamento para frente</strong> para fazer inferências:
                  </p>
                  <ol className="list-decimal ml-6 space-y-2 text-gray-700">
                    <li>A cada resposta SIM, um novo fato é adicionado à base de conhecimento</li>
                    <li>O motor de inferência analisa todas as regras para ver quais podem ser aplicadas</li>
                    <li>Quando todas as condições de uma regra são satisfeitas, sua conclusão é inferida</li>
                    <li>O processo continua até identificar um personagem ou esgotar as perguntas</li>
                  </ol>
                </div>

                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-3">Exemplo de Raciocínio</h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded border-l-4 border-green-500">
                      <strong>Fato:</strong> é personagem
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-green-500">
                      <strong>Fato:</strong> tem poderes de gelo
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-green-500">
                      <strong>Fato:</strong> canta Let It Go
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                      <strong>Regra aplicada:</strong> SE é personagem E tem poderes de gelo E canta Let It Go ENTÃO personagem Elsa
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                      <strong>Conclusão:</strong> O personagem é Elsa! 🎉
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-3">Características do Sistema</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Usa sistema especialista baseado em regras</li>
                    <li>✓ Implementa encadeamento para frente</li>
                    <li>✓ Fornece explicação do raciocínio (Por quê?)</li>
                    <li>✓ Permite visualizar a base de conhecimento</li>
                    <li>✓ Faz perguntas inteligentes baseadas em fatos coletados</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniAkinator;