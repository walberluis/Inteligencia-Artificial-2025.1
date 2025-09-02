import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import matplotlib.pyplot as plt
import seaborn as sns

from teste_completo import features, labels


class PRISM:
    def __init__(self):
        self.rules = []
        self.feature_names = []

    def fit(self, X, y, feature_names, min_coverage=5):
        self.feature_names = feature_names
        self.rules = []
        remaining_indices = set(range(len(X)))

        # Para cada classe única
        for class_label in np.unique(y):
            class_indices = set(np.where(y == class_label)[0])
            class_remaining = class_indices.intersection(remaining_indices)

            while class_remaining:
                best_rule = None
                best_coverage = 0

                # Para cada feature
                for feature_idx in range(X.shape[1]):
                    feature_values = X[:, feature_idx]
                    unique_vals = np.unique(feature_values)

                    # Para cada valor único da feature
                    for val in unique_vals:
                        # Criar condição
                        condition_indices = set(np.where(feature_values == val)[0])
                        rule_coverage = len(condition_indices.intersection(class_remaining))

                        # Verificar se é a melhor regra
                        if rule_coverage > best_coverage and rule_coverage >= min_coverage:
                            best_coverage = rule_coverage
                            best_rule = {
                                'feature': feature_idx,
                                'value': val,
                                'coverage': rule_coverage,
                                'class': class_label
                            }

                if best_rule:
                    # Adicionar a regra
                    self.rules.append(best_rule)

                    # Remover instâncias cobertas
                    feature_values = X[:, best_rule['feature']]
                    covered_indices = set(np.where(feature_values == best_rule['value'])[0])
                    remaining_indices -= covered_indices
                    class_remaining -= covered_indices
                else:
                    # Se não encontrou regra boa, para para esta classe
                    break

        return self.rules

    def predict(self, X):
        predictions = []
        for i in range(len(X)):
            pred = None
            for rule in self.rules:
                if X[i, rule['feature']] == rule['value']:
                    pred = rule['class']
                    break
            predictions.append(pred if pred is not None else 'Unknown')
        return predictions

    def print_rules(self):
        print("Regras Geradas pelo PRISM:")
        print("=" * 60)
        for i, rule in enumerate(self.rules, 1):
            feature_name = self.feature_names[rule['feature']]
            print(f"Regra {i}: SE {feature_name} = {rule['value']:.4f} ENTÃO Classe = {rule['class']}")
            print(f"   - Cobertura: {rule['coverage']} instâncias")
            print()


# Função para preparar os dados
def prepare_data_for_prism(features, labels):
    # Criar nomes de features mais descritivos
    feature_names = []

    # Nomes para features LBP
    for r in [1, 3, 5]:
        for i in range(8 * r + 2):
            feature_names.append(f'LBP_r{r}_bin{i}')

    # Nomes para features GLCM
    glcm_props = ['contrast', 'energy', 'homogeneity', 'correlation']
    for prop in glcm_props:
        feature_names.append(f'GLCM_{prop}_mean')
        feature_names.append(f'GLCM_{prop}_std')
    feature_names.extend(['GLCM_entropy_mean', 'GLCM_entropy_std'])

    # Nomes para features de cor
    color_spaces = ['HSV', 'LAB']
    for space in color_spaces:
        for channel in ['H', 'S', 'V'] if space == 'HSV' else ['L', 'A', 'B']:
            feature_names.append(f'{space}_{channel}_mean')
            feature_names.append(f'{space}_{channel}_std')

    # Outras features
    feature_names.append('Gabor_energy')
    feature_names.extend(['Powdery_area', 'Powdery_count', 'Powdery_avg_area', 'Powdery_avg_circ'])

    return np.array(features), feature_names


# Função para avaliar o modelo
def evaluate_model(y_true, y_pred):
    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_true, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_true, y_pred, average='weighted', zero_division=0)

    print("Métricas de Desempenho:")
    print("=" * 30)
    print(f"Acurácia: {accuracy:.4f}")
    print(f"Precisão: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1-Score: {f1:.4f}")

    return accuracy, precision, recall, f1


# Função para visualizar a matriz de confusão
def plot_confusion_matrix(y_true, y_pred):
    from sklearn.metrics import confusion_matrix
    import seaborn as sns

    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=np.unique(y_true),
                yticklabels=np.unique(y_true))
    plt.title('Matriz de Confusão - Algoritmo PRISM')
    plt.ylabel('Classe Real')
    plt.xlabel('Classe Predita')
    plt.show()


# Função para visualizar a cobertura das regras
def plot_rule_coverage(rules):
    rule_coverage = [rule['coverage'] for rule in rules]
    rule_classes = [rule['class'] for rule in rules]
    rule_indices = range(1, len(rules) + 1)

    plt.figure(figsize=(12, 6))
    colors = ['green' if c == 'healthy' else 'orange' if c == 'rust' else 'purple' for c in rule_classes]
    bars = plt.bar(rule_indices, rule_coverage, color=colors, alpha=0.7)

    plt.xlabel('Índice da Regra')
    plt.ylabel('Número de Instâncias Cobertas')
    plt.title('Cobertura das Regras por Classe')

    # Adicionar legenda
    from matplotlib.patches import Patch
    legend_elements = [
        Patch(facecolor='green', label='healthy'),
        Patch(facecolor='orange', label='rust'),
        Patch(facecolor='purple', label='powdery')
    ]
    plt.legend(handles=legend_elements)

    # Adicionar valores nas barras
    for i, v in enumerate(rule_coverage):
        plt.text(i + 1, v + 0.5, str(v), ha='center', va='bottom')

    plt.xticks(rule_indices)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.show()


# Execução principal
if __name__ == "__main__":
    # Supondo que 'features' e 'labels' já estão carregados do código anterior
    # Se não estiverem, precisaríamos carregar os dados novamente

    print("Executando Algoritmo PRISM para Geração de Regras")
    print("=" * 60)

    # Preparar dados para o PRISM
    X, feature_names = prepare_data_for_prism(features, labels)
    y = np.array(labels)

    print(f"Dataset: {X.shape[0]} amostras, {X.shape[1]} features")
    print(f"Classes: {np.unique(y)}")
    print()

    # Executar algoritmo PRISM
    prism = PRISM()
    rules = prism.fit(X, y, feature_names, min_coverage=3)

    # Imprimir regras
    prism.print_rules()

    # Fazer previsões
    y_pred = prism.predict(X)

    # Avaliar o modelo
    accuracy, precision, recall, f1 = evaluate_model(y, y_pred)

    # Matriz de confusão
    print("\nMatriz de Confusão:")
    conf_matrix = pd.crosstab(pd.Series(y, name='Real'),
                              pd.Series(y_pred, name='Predito'),
                              rownames=['Real'], colnames=['Predito'])
    print(conf_matrix)

    # Visualizações
    print("\n📈 Gerando Visualizações...")
    plot_confusion_matrix(y, y_pred)
    plot_rule_coverage(rules)

    # Análise das regras mais importantes
    print("\n🔍 Análise das Regras Mais Significativas:")
    print("=" * 50)

    # Ordenar regras por cobertura
    sorted_rules = sorted(rules, key=lambda x: x['coverage'], reverse=True)

    for i, rule in enumerate(sorted_rules[:5], 1):
        feature_name = feature_names[rule['feature']]
        print(f"Top {i}: {feature_name} = {rule['value']:.4f}")
        print(f"   → Classe: {rule['class']}, Cobertura: {rule['coverage']} instâncias")
        print()

    # Estatísticas gerais
    print("Estatísticas do Conjunto de Regras:")
    print("=" * 40)
    print(f"Total de regras geradas: {len(rules)}")

    coverage_by_class = {}
    for rule in rules:
        if rule['class'] not in coverage_by_class:
            coverage_by_class[rule['class']] = 0
        coverage_by_class[rule['class']] += rule['coverage']

    for cls, cov in coverage_by_class.items():
        class_count = np.sum(y == cls)
        print(f"Cobertura para {cls}: {cov}/{class_count} ({cov / class_count * 100:.1f}%)")

    # Calcular instâncias não cobertas
    covered_indices = set()
    for rule in rules:
        feature_values = X[:, rule['feature']]
        covered_indices.update(np.where(feature_values == rule['value'])[0])

    uncovered = len(y) - len(covered_indices)
    print(f"Instâncias não cobertas: {uncovered}/{len(y)} ({uncovered / len(y) * 100:.1f}%)")
