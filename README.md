# Projeto Infosaúde Jovem CCB

Site educativo de saúde criado por estudantes do 3º ano do Ensino Médio da
**Escola Estadual Carlos de Castro Brasil (Corumbá-MS)**, em conexão com o
**Programa Saúde na Escola (PSE)** e o **Fortalece PSE**.

> "Cuidar de hoje, transformar o amanhã!"

Este manual foi escrito em linguagem simples, para que **qualquer pessoa**,
mesmo sem conhecimento de programação, consiga editar e publicar o site.

---

## 1. O que é este projeto

É um site (portal) educativo, feito apenas com HTML, CSS e JavaScript, sem
necessidade de instalar programas, servidores ou bancos de dados. Ele
apresenta o Projeto Infosaúde Jovem CCB, explica as 14 temáticas do PSE,
traz perguntas frequentes, mural de atividades, galeria de fotos, resultados
de uma pesquisa feita pelos estudantes, glossário de saúde, contatos úteis,
a equipe do projeto e o diário de bordo.

Todo o conteúdo do site pode ser editado diretamente nos arquivos, sem
precisar programar.

---

## 2. Estrutura das pastas

```
Projeto-Infosaude-Jovem-CCB/
│
├── index.html          → estrutura do site (não precisa mexer)
├── style.css            → cores e visual do site
├── dados.js             → TODO o conteúdo do site (textos, fotos, perguntas)
├── README.md            → este manual
│
└── img/
    ├── logo-escola.png
    ├── logo-pse.png
    ├── inicio/           → imagem de destaque e banners
    ├── turma/             → foto da turma
    ├── temas/             → fotos das 14 temáticas do PSE
    ├── mural/             → fotos das atividades do mural e diário
    ├── galeria/           → fotos da galeria geral
    └── equipe/            → fotos dos integrantes da equipe
```

Se uma imagem ainda não existir dentro da pasta `img`, o site continua
funcionando normalmente — no lugar da foto aparece um aviso "Foto em breve".

---

## 3. Como abrir o site

1. Baixe ou copie a pasta `Projeto-Infosaude-Jovem-CCB` inteira para o seu
   computador.
2. Entre na pasta e dê dois cliques no arquivo `index.html`.
3. O site abrirá automaticamente no seu navegador (Chrome, Firefox, Edge ou
   Safari).

Não é necessário internet, servidor ou instalação de programas para testar
o site localmente.

---

## 4. Como editar textos

1. Abra o arquivo `dados.js` com o Bloco de Notas (Windows), TextEdit em
   modo texto simples (Mac) ou um editor como o Notepad++.
2. Procure o bloco `const textos = { ... }` no topo do arquivo.
3. Altere apenas o texto que está entre aspas `" "`.
4. Salve o arquivo (utilize a opção "Salvar como" e escolha a codificação
   **UTF-8**, se disponível).
5. Abra o `index.html` novamente no navegador para ver a mudança.

---

## 5. Como adicionar perguntas

1. Abra `dados.js` e procure o bloco `const perguntas = [ ... ]`.
2. Copie um bloco completo de pergunta, por exemplo:

```js
{ id: 33, pergunta: "Sua nova pergunta aqui?", resposta: "A resposta completa aqui.", tema: "Geral" },
```

3. Cole o bloco copiado dentro dos colchetes `[ ]`, antes do último `]`.
4. Troque o número do `id` para um número que ainda não exista na lista.
5. Escreva sua pergunta, resposta e o tema relacionado.
6. Salve o arquivo.

Para **remover** uma pergunta, apague o bloco inteiro dela (de `{` até `}`,
incluindo a vírgula depois).

---

## 6. Como adicionar fotos

1. Coloque o arquivo de imagem (formato `.jpg`, `.jpeg`, `.png` ou `.webp`)
   dentro da pasta `img` (ou de uma subpasta, como `img/galeria`).
2. Abra `dados.js` e vá até a lista correspondente (por exemplo,
   `const galeria = [ ... ]`).
3. Copie um bloco existente e ajuste o caminho do arquivo e a legenda:

```js
{ arquivo: "img/galeria/foto-13.jpg", legenda: "Descrição da foto", categoria: "Categoria" },
```

4. A legenda escrita também é usada automaticamete como texto alternativo
   (acessibilidade) da imagem.
5. Se a imagem for puramente decorativa (sem informação importante), use
   `decorativa: true` no lugar da legenda obrigatória.

---

## 7. Como alterar o banner (imagem de destaque)

1. Coloque a nova imagem dentro da pasta `img/inicio`.
2. Abra `dados.js` e procure o bloco `const imagens = { ... }`.
3. Altere o campo `arquivo` do item `hero` (imagem principal da página
   inicial) ou `sobreBanner` (imagem da seção "Sobre"):

```js
hero: {
  arquivo: "img/inicio/nova-capa.jpg",
  legenda: "Descrição da nova imagem"
}
```

4. Salve o arquivo e atualize a página no navegador.

---

## 8. Como adicionar atividades (mural e diário de bordo)

Para o **mural**, procure `const mural = [ ... ]` em `dados.js` e copie um
bloco como este:

```js
{
  titulo: "Nome da atividade",
  descricao: "Descrição da atividade realizada.",
  data: "2024-10-05",
  categoria: "Oficina",
  imagem: { arquivo: "img/mural/nova-atividade.jpg", legenda: "Descrição da foto" }
}
```

Para o **diário de bordo**, procure `const diario = [ ... ]` e siga o mesmo
princípio, usando os campos `data`, `titulo`, `descricao` e `imagem`.

---

## 9. Como adicionar integrantes da equipe

1. Coloque a foto da pessoa dentro de `img/equipe` (opcional).
2. Abra `dados.js` e procure `const equipe = [ ... ]`.
3. Copie um bloco e edite os dados:

```js
{
  nome: "Nome do integrante",
  funcao: "Função no projeto",
  descricao: "Breve descrição do que a pessoa fez no projeto.",
  foto: { arquivo: "img/equipe/novo-integrante.jpg", legenda: "Foto do integrante" }
}
```

Se a pessoa não tiver foto disponível, basta remover o campo `foto` — o
site mostrará um espaço reservado no lugar, sem quebrar o layout.

---

## 10. Como alterar as cores

1. Abra o arquivo `style.css`.
2. Logo no início, existe um bloco chamado `:root { ... }` com comentários
   explicando cada cor.
3. Troque apenas o valor depois dos dois pontos, por exemplo:

```css
--cor-principal: #168A5A;
```

Você pode trocar `#168A5A` por outra cor no formato hexadecimal
(`#RRGGBB`). Não apague o nome da variável (a parte que começa com `--`).

---

## 11. Como mostrar/ocultar seções

1. Abra `dados.js` e procure o bloco `const config = { ... }` no topo do
   arquivo.
2. Troque `true` (mostrar) por `false` (ocultar) na seção desejada:

```js
mostrarGaleria: false,
```

3. Salve o arquivo. A seção desaparecerá do site e também do menu de
   navegação automaticamente.

---

## 12. Como alterar o layout

Ainda dentro do bloco `config`, é possível trocar o layout de algumas
seções entre `"grid"` (grade) ou `"lista"` (lista vertical):

```js
layoutTemas: "grid",
layoutMural: "grid",
layoutGaleria: "grid",
layoutEquipe: "grid",
```

Use somente as palavras `"grid"` ou `"lista"` — outros valores podem
quebrar o layout da seção.

---

## 13. Como testar

Depois de qualquer alteração:

1. Salve todos os arquivos editados.
2. Abra o arquivo `index.html` no navegador (ou pressione F5 para atualizar
   a página, caso ele já esteja aberto).
3. Confira se o conteúdo aparece corretamente, em telas de computador e de
   celular (você pode redimensionar a janela do navegador para simular).

---

## 14. Como publicar gratuitamente

Você não precisa saber programar nem usar o terminal para publicar este
site. Veja três formas gratuitas e simples:

### GitHub Pages

1. Crie uma conta gratuita em [github.com](https://github.com).
2. Clique em "New repository" (Novo repositório) e dê um nome, por
   exemplo `infosaude-jovem-ccb`.
3. Na página do repositório, clique em "Add file" → "Upload files" e envie
   todos os arquivos e pastas do projeto (`index.html`, `style.css`,
   `dados.js`, a pasta `img` etc.).
4. Vá até "Settings" (Configurações) → "Pages".
5. Em "Branch", escolha `main` e a pasta `/root`, depois clique em "Save".
6. Aguarde alguns minutos. O GitHub mostrará um endereço parecido com
   `https://seu-usuario.github.io/infosaude-jovem-ccb/` — esse é o link do
   site publicado.

### Netlify

1. Crie uma conta gratuita em [netlify.com](https://www.netlify.com).
2. Na página inicial do painel, procure a opção de arrastar arquivos
   ("Deploy manually" / "Drag and drop your site folder here").
3. Arraste a pasta inteira do projeto para essa área.
4. Aguarde a publicação: o Netlify gerará automaticamente um endereço do
   tipo `https://nome-aleatorio.netlify.app`.
5. Se quiser, é possível personalizar esse endereço nas configurações do
   site, na opção de alterar o nome do domínio.

### Cloudflare Pages

1. Crie uma conta gratuita em [pages.cloudflare.com](https://pages.cloudflare.com).
2. Escolha a opção de criar um novo projeto por upload direto de arquivos
   (sem precisar de repositório Git).
3. Envie a pasta do projeto quando solicitado.
4. Finalize a publicação e aguarde o endereço gerado automaticamente pela
   Cloudflare.

Nenhuma dessas opções exige conhecimento de linha de comando (terminal) ou
de Git.

---

## 15. Problemas comuns

**As fotos não aparecem.**
Verifique se o arquivo de imagem está realmente dentro da pasta `img` (ou
subpasta correta) e se o nome escrito em `dados.js`, no campo `arquivo`,
é exatamente igual ao nome do arquivo (incluindo maiúsculas/minúsculas e
extensão, como `.jpg` ou `.png`).

**Editei o arquivo e o site não mudou.**
Verifique se o arquivo foi salvo corretamente e atualize a página no
navegador (F5). Se o navegador mostrar uma versão antiga, tente atualizar
com Ctrl+F5 (ou Cmd+Shift+R no Mac).

**Apareceu uma tela em branco.**
Normalmente isso indica que alguma vírgula, chave `{ }` ou aspas `" "`
foi apagada acidentalmente no `dados.js`. Revise o último trecho editado e
compare com um bloco parecido que ainda está funcionando.

**O menu não fecha no celular.**
Toque em algum link do menu, aperte a tecla Esc (em teclados físicos) ou
toque fora do menu para fechá-lo.

---

## 16. Acessibilidade

Este site foi desenvolvido com atenção a boas práticas de acessibilidade:

- Estrutura em HTML semântico, com títulos organizados em hierarquia.
- Textos alternativos (`alt`) em todas as imagens informativas.
- Navegação completa pelo teclado, incluindo menu e modais.
- Indicador visual de foco (`focus-visible`) em todos os elementos
  interativos.
- Modais acessíveis, com fechamento pela tecla Esc e retorno do foco ao
  elemento que abriu a janela.
- Suporte à preferência do usuário por movimento reduzido
  (`prefers-reduced-motion`).
- Contraste de cores pensado para boa legibilidade.

Ao adicionar novos conteúdos, procure sempre preencher a legenda das
imagens (`legenda`) — ela é usada automaticamente como texto alternativo.

---

## 17. Aviso sobre conteúdo de saúde

Todo o conteúdo relacionado à saúde apresentado neste site tem caráter
**educativo e informativo**. Ele não substitui consulta, diagnóstico ou
tratamento realizado por profissionais de saúde.

Os dados apresentados na seção "Dados da pesquisa" referem-se
exclusivamente aos resultados obtidos entre os estudantes que participaram
da pesquisa aplicada pelo Projeto Infosaúde Jovem CCB, não representando a
totalidade da população estudantil.

Em caso de dúvida sobre saúde, ou necessidade de atendimento, procure uma
Unidade Básica de Saúde (UBS), outro serviço do SUS ou um profissional de
saúde qualificado. Em situações de emergência, ligue para o SAMU (192) ou
para o Corpo de Bombeiros (193). Para apoio emocional, o Centro de
Valorização da Vida (CVV) está disponível gratuitamente pelo telefone 188,
24 horas por dia.
