# Sistema de Monitoramento Logístico - Desafio RxJS

Projeto de monitoramento em tempo real, focado em consolidar fluxos de telemetria (GPS), pedidos e alertas operacionais.

## 1. Como rodar o projeto
Siga os comandos abaixo no seu terminal (dentro da pasta do projeto):
1. Instale as dependências: `npm install`
2. Execute a aplicação: `npx ts-node src/main.ts`
3. O sistema rodará automaticamente por **30 segundos** antes de encerrar todas as conexões via `destroy$`.

## 2. Descrição dos Streams
* **`gps$`**: Emite a cada 1 segundo as coordenadas (`lat`, `lng`), a velocidade e o `entregadorId`.
* **`pedidos$`**: Fluxo de atualizações de status (coletado, em rota, entregue). Possui 10% de chance de erro simulado.
* **`alertas$`**: Notificações de sistema com diferentes níveis de severidade (baixa, média, alta).
* **`painelEntregador$`**: Stream consolidado que agrupa o estado mais recente de cada entregador.
* **`emergencia$`**: Stream que detecta situações críticas cruzando alertas e velocidade.
* **`statusCount$`**: Placar acumulado de performance (KPIs de entrega).

## 3. Justificativa da Tarefa 3.1: Uso de `merge` com `scan`
Para a consolidação do painel, a escolha técnica foi a combinação dos operadores **`merge`** e **`scan`**.
* **Justificativa**: Como os eventos de GPS e Pedidos ocorrem de forma assíncrona e independente, o `merge` permite que o sistema reaja a qualquer uma das fontes assim que o dado chega. O `scan` atua como um "redutor de estado", permitindo que se mantenha na memória a última localização conhecida enquanto o status do pedido muda, e vice-versa. Isso garante que o objeto final de cada entregador esteja sempre completo e atualizado.

## 4. Implementação da Tarefa 3.2 (Dashboard de Emergência)
Na Tarefa 3.2, implementei uma lógica de "memória de 5 segundos", para garantir que nenhuma infração de velocidade nesse período fosse perdida no momento do incidente. Em vez de consultar apenas o último dado instantâneo, criei um stream auxiliar que utiliza o operador `scan` para manter um "buffer" (memória) de todos os registros de GPS recebidos nos últimos 5 segundos. Ao receber um Alerta de severidade 'alta', o sistema utiliza o `mergeMap` para percorrer essa lista histórica. Se o entregador específico estiver acima de 60 km/h em qualquer um desses registros dentro da janela de 5s, uma emergência é disparada para cada ocorrência detectada.

## 5. Dificuldades Enfrentadas e Soluções

### O Desafio da Sincronização e o uso do `share()`
Uma das maiores dificuldades foi que os dados no Painel Consolidado não batiam com os logs impressos no console. Isso acontecia pois cada subscrição disparava uma nova execução da lógica, gerando duas execuções das streams ao mesmo tempo, o que fazia com que os logs impressos não fossem os mesmos que eram apresentados no painel.
* **Solução**: Apliquei o operador **`share()`** nos streams base, garantindo que todas as partes do sistema consumissem exatamente a mesma versão dos dados, sincronizando os logs com o painel.

### Visualização do Objeto `ultimaLocalizacao` no Painel
Tentei seguir à risca a estrutura sugerida, aninhando as propriedades de latitude, longitude e velocidade dentro do objeto `ultimaLocalizacao`. No entanto, o `console.table` do Node.js, que utilizei para padronizar um "layout" de painel, exibe objetos aninhados apenas como `[Object]`, o que impedia a leitura imediata das coordenadas no dashboard.
* **Solução**: Para garantir que as informações importantes fossem apresentadas em tempo real, optei por apresentar essas 3 informações como colunas individuais no painel. Isso manteve a integridade dos dados e a clareza visual exigida para um monitoramento eficiente.

---