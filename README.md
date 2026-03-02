# 🚀 Autoflex Dashboard

**Sistema de controle de produção com dashboard moderno, desenvolvido com React, Vite e TailwindCSS.**

O projeto permite gerenciar produção, produtos, matérias-primas, histórico e relatórios através de uma interface responsiva, estilizada e com navegação dinâmica. Feito como etapa de avaliação para vaga de desenvolvedor fullstack da Projedata Informática.

## 🛠 Tecnologias Utilizadas

- **React**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **React Router DOM**
- **Lucide React** (ícones)

## 📦 Como Executar o Projeto

1. **Clone o repositório**

```
git clone https://github.com/arielvasconcelosgoncalves/autoflex-test.git

```

3. **Acesse a pasta do projeto do backend**

```
cd autoflex-backend

```

3. **Instale as dependências do backend**

```
npm install

```

4. **crie um banco de dados PostgreSQL com o nome autoflex**

5. **Adicione ao arquivo .env essa variável de ambiente:**

```
DATABASE_URL="postgresql://postgres:(SUA_SENHA)@localhost:5432/autoflex"

```

6. **Suba as migrations do prisma:**

```
npx prisma migrate dev

```

7. **Rode o backend:**

```
npm run rev

```

**O backend estará disponível em: http://localhost:5432**

8. **Acesse a pasta do projeto do frontend**

```
cd ..
cd autoflex-frontend

```

9. **Instale as dependências do frontend**

```
npm install

```

13. **Rode o backend:** npm run rev

**O backend estará disponível em: http://localhost:5137**

# 📊 Funcionalidades por Tela

## 🏭 Production

### Tela principal do sistema.

Permite:

- Registrar produção
- Visualizar status atual
- Controlar fluxo produtivo

## 📦 Products

### Gerenciamento de produtos.

Permite:

- Cadastrar novos produtos
- Editar informações
- Visualizar lista completa

## 🧱 Raw Materials

### Controle de matérias-primas.

Funções:

- Cadastro de materiais
- Controle de estoque
- Atualização de quantidades

## 📜 History

### Histórico de movimentações.

Exibe:

- Registros de produção
- Alterações realizadas
- Dados anteriores

## 📊 Reports

### Relatórios do sistema.

Permite:

- Visualização de dados consolidados
- Análise de produção
- Base para tomada de decisão

## 🎨 Interface

### Navbar horizontal moderna

- Destaque automático da rota ativa
- Efeitos hover animados
- Layout responsivo
- Design em tons de azul e branco
- Ícones integrados com Lucide

🧠 Estrutura do Projeto

```shell
src/
  ├── components/
  ├── pages/
  ├── Layout.tsx
  ├── App.tsx
  ├── main.tsx
  └── index.css
```

👨‍💻 Autor
Desenvolvido por Ariel Vasconcelos
