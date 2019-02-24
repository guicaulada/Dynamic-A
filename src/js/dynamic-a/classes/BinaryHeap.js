
/**
 * Implementa uma heap
 */
class BinaryHeap {
  /**
   * Cria uma instancia de uma heap
   * @memberof BinaryHeap
   * @param {*} scoreFunction Calculo de pontuacao e posicionamento
   */
  constructor(scoreFunction) {
    this.content = [];
    this.scoreFunction = scoreFunction;
  }

  /**
   * Adiciona um novo elemento ao final
   * @memberof BinaryHeap
   * @param {*} element Elemento
   */
  push(element) {
    // Adiciona um novo elemento ao final da lista
    this.content.push(element);
    // Reposiciona-o de acordo
    this.sinkDown(this.content.length - 1);
  }

  /**
   * Retorna e remove o primeiro elemento
   * @memberof BinaryHeap
   * @return {*} Primeiro element
   */
  pop() {
    // Guarda o primeiro elemento para que possamos retorna-lo
    let result = this.content[0];
    // Adquire o elemento no final da lista
    let end = this.content.pop();
    // Se existem elementos na lista coloque o elemento no inicio
    // Reajuste sua posicao
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  }

  /**
   * Remove um elemento
   * @memberof BinaryHeap
   * @param {*} node Elemento a ser removido
   */
  remove(node) {
    let i = this.content.indexOf(node);
    // Quando encontrado colocamos o ultimo elmento em sua posicao
    // Reajustamos sua posicao
    let end = this.content.pop();
    if (i !== this.content.length - 1) {
      this.content[i] = end;
      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  }

  /**
   * Retorna o tamanho da heap
   * @memberof BinaryHeap
   * @return {Number} O tamanho da lista
   */
  size() {
    return this.content.length;
  }

  /**
   * Recalcula a posicao de um elemento
   * @memberof BinaryHeap
   * @param {*} node
   */
  rescoreElement(node) {
    this.sinkDown(this.content.indexOf(node));
  }

  /**
   * Diminui o indice de um elemento ate que sua posicao seja encontrada
   * @memberof BinaryHeap
   * @param {*} n Indice do elemento
   */
  sinkDown(n) {
    // Adquire o elemento que tem que ser afundado.
    let element = this.content[n];
    // Quando sua posicao for 0 nao pode diminuir mais.
    while (n > 0) {
      // Calcula o indice do parente e o adquire.
      let parentN = ((n + 1) >> 1) - 1;
      let parent = this.content[parentN];
      // Troca os elementos de posicao se o calculo de pontuacao do parente for maior.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Atualiza o indice para a nova posicao
        n = parentN;
      } else {
        break; // Encontrou um parente que possui calculo menor, nao precisa afundar mais
      }
    }
  }

  /**
   * Aumenta o indice de um elemento ate que sua posicao seja encontrada
   * @memberof BinaryHeap
   * @param {*} n Indice do elemento
   */
  bubbleUp(n) {
    // Calcula a pontuacao do elemento
    let length = this.content.length;
    let element = this.content[n];
    let elemScore = this.scoreFunction(element);
    while (true) {
      // Calcula o indice de seus elementos filhos
      let child2N = (n + 1) << 1;
      let child1N = child2N - 1;
      // Guarda a nova posicao do elemento se houver
      let swap = null;
      let child1Score;
      // Se o primeiro filho existir
      if (child1N < length) {
        // Calcule sua pontuacao
        let child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);
        // Se a pontuacao for menor do que a do elemento alvo guardamos o indice
        if (child1Score < elemScore) {
          swap = child1N;
        }
      }
      // O mesmo para o outro filho
      if (child2N < length) {
        let child2 = this.content[child2N];
        let child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }
      // Se o elemento precisar trocar de posicao, troque e continue
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      } else {
        break; // Se nao precisar, entao fim
      }
    }
  }
}
