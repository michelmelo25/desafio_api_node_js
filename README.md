# Desafio API Node.js

Este projeto é uma API desenvolvida em Node.js como parte de um desafio de programação. O objetivo é fornecer endpoints para gerenciamento de cursos, utilizando banco de dados relacional e integração com Docker.

## Funcionalidades

- Criar cursos
- Listar todos os cursos
- Buscar curso por ID

## Estrutura do Projeto

- `server.ts`: Arquivo principal do servidor Node.js
- `src/database/`: Configuração do banco de dados e schema
- `src/routes/`: Rotas da API para manipulação dos cursos
- `drizzle/`: Migrações e snapshots do banco de dados
- `docker-compose.yml`: Configuração para rodar o projeto com Docker

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Drizzle ORM
- Docker

## Como executar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Execute as migrações do banco de dados (se necessário).
3. Inicie o servidor:
   ```bash
   npm start
   ```
4. Para rodar com Docker:
   ```bash
   docker-compose up
   ```

## Testando a API

Você pode utilizar o arquivo `requisicoes.http` para testar os endpoints diretamente no VS Code ou usar ferramentas como Postman/Insomnia.

## Endpoints

### POST /courses

Cria um novo curso no banco de dados.

- **Body:**
  - `title` (string, obrigatório, mínimo 5 caracteres): Título do curso
  - `description` (string, opcional): Descrição do curso
- **Respostas:**
  - `201`: Curso criado com sucesso, retorna o `courseId`
  - `400`: Parâmetro obrigatório não informado

### GET /courses

Lista todos os cursos cadastrados, com suporte a busca, ordenação e paginação.

- **Query params:**
  - `search` (string, opcional): Busca por título
  - `orderBy` (string, opcional, default: "title"): Campo para ordenação
  - `page` (number, opcional, default: 1): Página da listagem
  - `limite` (number, opcional, default: 10): Quantidade de cursos por página
- **Respostas:**
  - `200`: Retorna lista de cursos e total de cursos encontrados

### GET /courses/:id

Busca um curso pelo seu ID.

- **Params:**
  - `id` (UUID, obrigatório): ID do curso
- **Respostas:**
  - `200`: Retorna o curso encontrado
  - `404`: Curso não encontrado

### DELETE /courses/:id

Deleta um curso pelo seu ID.

- **Params:**
  - `id` (UUID, obrigatório): ID do curso
- **Respostas:**
  - `200`: Retorna o curso deletado
  - `404`: Curso não encontrado

## Autor

Desenvolvido por Michel Melo

\n## Documentação Swagger\n\nA documentação completa dos endpoints da API pode ser consultada via Swagger, disponível em:\n\n[http://localhost:3333/docs](http://localhost:3333/docs)\n\nAcesse este endereço após iniciar o servidor para visualizar e testar os endpoints diretamente pela interface do Swagger.
