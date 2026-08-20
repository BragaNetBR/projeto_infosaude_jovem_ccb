/* =====================================================================
   PROJETO INFOSAÚDE JOVEM CCB — ARQUIVO DE DADOS (dados.js)
   =====================================================================

   COMO EDITAR ESTE SITE (TUTORIAL PARA QUEM NÃO SABE PROGRAMAR)

   1. Abra este arquivo (dados.js) com o Bloco de Notas, Notepad++ ou
      qualquer editor de texto simples (evite o Word).
   2. NÃO apague chaves { }, colchetes [ ], vírgulas ou aspas " ".
      Eles fazem parte da "estrutura" do código.
   3. Só altere o texto que está DENTRO das aspas.
      Exemplo: "titulo": "Saúde bucal"  → pode trocar "Saúde bucal"
      por outro texto, mas mantenha as aspas.
   4. Para adicionar um novo item numa lista (pergunta, foto, integrante,
      atividade etc.), copie um bloco inteiro (de { até }, incluindo a
      vírgula depois) e cole logo abaixo, depois altere os textos.
   5. Para remover um item, apague o bloco inteiro (de { até }, incluindo
      a vírgula que vem depois dele).
   6. Salve o arquivo sempre em codificação UTF-8 (o próprio Bloco de
      Notas moderno já salva assim).
   7. Para trocar uma imagem, coloque o arquivo de imagem dentro da pasta
      "img" (ou de uma subpasta dela, como img/temas) e escreva o
      caminho certo no campo "arquivo". Exemplo:
      "arquivo": "img/temas/saude-bucal.jpg"
   8. Se a imagem ainda não existir, não tem problema: o site continua
      funcionando normalmente e mostra um espaço reservado no lugar.
   9. Depois de editar e salvar, abra (ou atualize) o arquivo index.html
      no navegador para ver o resultado.
   10. Para mostrar ou esconder uma seção inteira do site, procure o
       bloco "config" logo abaixo e troque "true" por "false" (ou
       o contrário) na opção correspondente.

   GUIA RÁPIDO POR TAREFA:
   - Adicionar pergunta no FAQ ......... vá até "PERGUNTAS FREQUENTES"
   - Remover pergunta ................... apague o bloco { ... } inteiro
   - Adicionar foto na galeria .......... vá até "GALERIA DE FOTOS"
   - Alterar banner/imagem de destaque .. vá até "IMAGENS E BANNERS"
   - Adicionar integrante da equipe ...... vá até "EQUIPE"
   - Adicionar atividade no mural ........ vá até "MURAL DE ATIVIDADES"
   - Adicionar/editar tema do PSE ........ vá até "TEMÁTICAS DO PSE"
   - Alterar estatísticas da pesquisa .... vá até "DADOS DA PESQUISA"
   - Ocultar uma seção ................... vá até "config" (mais abaixo)
   ===================================================================== */


/* =====================================================================
   CONFIGURAÇÃO GERAL DO SITE
   Troque "true" (mostrar) por "false" (ocultar) para exibir ou não
   cada seção. Não escreva outra coisa além de true ou false.
   ===================================================================== */
const config = {
  mostrarInicio: true,
  mostrarSobre: true,
  mostrarTematicas: true,
  mostrarFAQ: true,
  mostrarMural: false,
  mostrarGaleria: false,
  mostrarDados: false,
  mostrarGlossario: false,
  mostrarContatos: true,
  mostrarEquipe: false,
  mostrarDiario: false,

  // Layout: use apenas "grid" ou "lista"
  layoutTemas: "grid",
  layoutMural: "grid",
  layoutGaleria: "grid",
  layoutEquipe: "grid",

  // Quantas perguntas do FAQ aparecem por vez (o botão "Carregar mais"
  // libera o próximo lote deste mesmo tamanho)
  perguntasPorPagina: 20
};


/* =====================================================================
   TEXTOS GERAIS DO SITE
   ===================================================================== */
const textos = {
  nomeProjeto: "Projeto Infosaúde Jovem CCB",
  slogan: "Cuidar de hoje, transformar o amanhã!",
  nomeEscola: "Escola Estadual Carlos de Castro Brasil",
  cidade: "Corumbá-MS",

  heroDescricao: "Um projeto criado por estudantes do 3º ano do Ensino Médio para levar informação de saúde confiável, acolhedora e transformadora a toda a comunidade escolar, em conexão com o Programa Saúde na Escola (PSE).",

  sobreIntroducao: "O Infosaúde Jovem CCB nasceu da vontade de estudantes da Escola Estadual Carlos de Castro Brasil de aproximar a saúde do dia a dia escolar. O projeto foi desenvolvido dentro das ações do Programa Saúde na Escola (PSE) e do Fortalece PSE, unindo protagonismo juvenil, pesquisa e educação para transformar informação técnica em conteúdo acessível para estudantes, professores, famílias e comunidade.",
  sobreOrigem: "A iniciativa surgiu a partir de estudos em sala de aula sobre as temáticas do PSE, de rodas de conversa com a comunidade escolar e de uma pesquisa aplicada pelos próprios estudantes, que revelou temas urgentes como saúde mental, prevenção e acesso a serviços de saúde.",
  sobrePapelEscola: "A escola atua como espaço de aprendizagem, articulação com a Unidade Básica de Saúde (UBS) de referência e ponto de encontro entre saúde e educação, fortalecendo o papel da escola como promotora de saúde.",
  sobreQuemFez: "Alunos do 3º ano do Ensino Médio da Escola Estadual Carlos de Castro Brasil, com orientação de professores da unidade escolar.",

  faqIntroducao: "Reunimos aqui as dúvidas mais comuns levantadas pelos estudantes durante o desenvolvimento do projeto. Use a busca ou os filtros para encontrar rapidamente o que você precisa saber.",

  dadosIntroducao: "Durante o desenvolvimento do projeto, os estudantes aplicaram uma pesquisa com colegas da escola para entender melhor as principais preocupações de saúde da comunidade estudantil. Os resultados abaixo refletem exclusivamente as respostas obtidas nessa pesquisa.",

  avisoEducativo: "Conteúdo educativo. Em caso de dúvida ou necessidade de atendimento, procure um profissional de saúde ou serviço do SUS.",

  mensagensEstado: {
    faqSemResultado: "Nenhuma pergunta encontrada. Tente outro termo ou selecione outra temática.",
    galeriaVazia: "As fotos desta seção serão adicionadas em breve.",
    muralVazio: "As atividades desta seção serão adicionadas em breve.",
    glossarioSemResultado: "Nenhum termo encontrado. Tente buscar por outra palavra.",
    equipeVazia: "A equipe será apresentada em breve.",
    diarioVazio: "O diário de bordo será publicado em breve."
  }
};


/* =====================================================================
   IMAGENS E BANNERS
   Configure aqui as imagens principais espalhadas pelo site.
   Campos:
     arquivo    -> caminho da imagem dentro da pasta img/
     legenda    -> texto usado como legenda e também como "alt" da imagem
     decorativa -> use true somente se a imagem for puramente decorativa
                   (nesse caso ela não precisa de legenda)
   ===================================================================== */
const imagens = {
  logoEscola: { arquivo: "img/logo-escola.jpg", legenda: "Logotipo da Escola Estadual Carlos de Castro Brasil" },
  logoPSE: { arquivo: "img/logo-pse.png", legenda: "Logotipo do Fortalece PSE — Programa Saúde na Escola" },

  hero: {
    arquivo: "img/inicio/capa-projeto.jpg",
    legenda: "Estudantes da Escola Estadual Carlos de Castro Brasil reunidos durante atividade do Projeto Infosaúde Jovem CCB"
  },

  sobreBanner: {
    arquivo: "img/inicio/sobre-projeto.jpg",
    legenda: "Estudantes participando de roda de conversa sobre saúde na escola"
  },

  turma: {
    arquivo: "img/turma/turma-3-ano.jpg",
    legenda: "Turma do 3º ano do Ensino Médio responsável pelo Projeto Infosaúde Jovem CCB"
  },

  diarioBanner: {
    arquivo: "img/mural/diario-capa.jpg",
    legenda: "Registro fotográfico das etapas do Projeto Infosaúde Jovem CCB"
  }
};


/* =====================================================================
   TEMÁTICAS DO PSE
   O projeto trabalha com as 14 temáticas do Programa Saúde na Escola.
   COPIE UM BLOCO INTEIRO (de { até a chave } que fecha o item, com a
   vírgula) PARA CRIAR UM NOVO TEMA. NÃO é recomendado remover temas,
   pois o projeto foi desenhado para as 14 temáticas oficiais do PSE.

   Campos de cada tema:
     numero   -> número do tema (1 a 14)
     titulo   -> nome da temática
     resumo   -> frase curta exibida no card
     icone    -> nome do ícone (não altere, já está de acordo com o site)
     cor      -> "verde" | "azul" | "amarelo" | "laranja" | "rosa"
     imagem   -> foto ilustrativa do card (opcional)
     modal    -> conteúdo exibido quando o card é aberto
   ===================================================================== */
const tematicas = [
  {
    numero: 1,
    titulo: "Saúde ambiental",
    resumo: "O ambiente em que vivemos influencia diretamente nossa saúde.",
    icone: "leaf",
    cor: "verde",
    imagem: { arquivo: "img/temas/saude-ambiental.jpg", legenda: "Estudantes cuidando de área verde na escola" },
    modal: {
      introducao: "A saúde ambiental estuda a relação entre o ambiente — água, ar, solo, saneamento e resíduos — e a saúde das pessoas.",
      oQueE: "É a área que observa como fatores ambientais (saneamento básico, qualidade da água, destino do lixo, poluição, presença de vetores) podem afetar a saúde individual e coletiva.",
      porQueImporta: "Ambientes mais limpos e organizados reduzem o risco de doenças transmitidas pela água, pelo ar ou por vetores, além de melhorar a qualidade de vida da comunidade escolar.",
      oQueVocePodeFazer: [
        "Participar de mutirões de limpeza e organização de espaços coletivos.",
        "Evitar o descarte incorreto de lixo e materiais recicláveis.",
        "Eliminar possíveis criadouros de mosquitos em casa e na escola.",
        "Economizar água e cuidar de áreas verdes."
      ],
      sinaisDeAtencao: [
        "Água parada ou acúmulo de lixo em terrenos próximos à escola ou residência.",
        "Falta de saneamento básico na região."
      ],
      ondeBuscarAjuda: "Situações de risco ambiental podem ser comunicadas à Unidade Básica de Saúde (UBS) ou à Vigilância Sanitária do município.",
      galeria: [
        { arquivo: "img/temas/ambiental-1.jpg", legenda: "Mutirão de limpeza realizado por estudantes" }
      ],
      fontes: [
        { titulo: "Ministério da Saúde", url: "https://www.gov.br/saude/pt-br", descricao: "Portal oficial do Ministério da Saúde." },
        { titulo: "Biblioteca Virtual em Saúde", url: "https://bvsms.saude.gov.br/", descricao: "Fonte técnica sobre saúde ambiental." }
      ]
    }
  },
  {
    numero: 2,
    titulo: "Promoção da atividade física",
    resumo: "Movimentar o corpo é parte importante do cuidado com a saúde.",
    icone: "run",
    cor: "laranja",
    imagem: { arquivo: "img/temas/atividade-fisica.jpg", legenda: "Estudantes praticando atividade física na quadra da escola" },
    modal: {
      introducao: "A prática regular de atividade física é reconhecida como um hábito importante para a saúde física e mental ao longo da vida.",
      oQueE: "Envolve qualquer movimento corporal que gasta energia, como caminhar, praticar esportes, dançar ou brincar, de forma prazerosa e adequada a cada pessoa.",
      porQueImporta: "A atividade física está associada a benefícios para o corpo e a mente, além de favorecer a socialização e a disposição no dia a dia escolar.",
      oQueVocePodeFazer: [
        "Buscar formas de movimento que você goste, como esportes, dança ou caminhada.",
        "Participar das aulas de Educação Física e das atividades esportivas da escola.",
        "Reduzir períodos muito longos sentado, alternando com pequenas pausas ativas.",
        "Envolver a família em caminhadas ou atividades ao ar livre."
      ],
      sinaisDeAtencao: [
        "Cansaço excessivo mesmo em atividades leves.",
        "Dor persistente durante ou após o exercício."
      ],
      ondeBuscarAjuda: "Antes de iniciar uma nova prática esportiva mais intensa, é recomendável passar por avaliação na UBS ou com profissional de Educação Física.",
      galeria: [
        { arquivo: "img/temas/atividade-1.jpg", legenda: "Torneio esportivo organizado pela escola" }
      ],
      fontes: [
        { titulo: "Organização Pan-Americana da Saúde (OPAS)", url: "https://www.paho.org/pt", descricao: "Orientações sobre atividade física e saúde." }
      ]
    }
  },
  {
    numero: 3,
    titulo: "Alimentação saudável e prevenção da obesidade",
    resumo: "Escolhas alimentares equilibradas fazem parte de uma vida mais saudável.",
    icone: "apple",
    cor: "amarelo",
    imagem: { arquivo: "img/temas/alimentacao.jpg", legenda: "Estudantes participando de oficina sobre alimentação saudável" },
    modal: {
      introducao: "A alimentação adequada e saudável é um direito humano e um dos pilares da promoção da saúde na escola.",
      oQueE: "Trata-se do incentivo ao consumo de alimentos in natura ou minimamente processados, de forma variada, e da redução do consumo de alimentos ultraprocessados.",
      porQueImporta: "Hábitos alimentares equilibrados, construídos desde a juventude, contribuem para a prevenção de diversas doenças ao longo da vida.",
      oQueVocePodeFazer: [
        "Priorizar frutas, verduras e legumes no dia a dia.",
        "Reduzir o consumo de alimentos ultraprocessados e bebidas açucaradas.",
        "Beber água com regularidade ao longo do dia.",
        "Participar das ações de educação alimentar promovidas pela escola."
      ],
      sinaisDeAtencao: [
        "Mudanças bruscas e não intencionais de peso.",
        "Restrição alimentar severa ou preocupação excessiva com o corpo."
      ],
      ondeBuscarAjuda: "Questões relacionadas à alimentação e ao peso devem ser avaliadas por profissionais de saúde, como nutricionistas e equipes da UBS.",
      galeria: [
        { arquivo: "img/temas/alimentacao-1.jpg", legenda: "Oficina de alimentação saudável com estudantes" }
      ],
      fontes: [
        { titulo: "Guia Alimentar para a População Brasileira — Ministério da Saúde", url: "https://www.gov.br/saude/pt-br", descricao: "Documento oficial sobre alimentação saudável." }
      ]
    }
  },
  {
    numero: 4,
    titulo: "Cultura de paz e direitos humanos",
    resumo: "Respeito, diálogo e direitos humanos fortalecem a convivência escolar.",
    icone: "hands",
    cor: "azul",
    imagem: { arquivo: "img/temas/cultura-paz.jpg", legenda: "Roda de conversa sobre respeito e convivência na escola" },
    modal: {
      introducao: "A cultura de paz busca promover relações mais respeitosas, dialogadas e baseadas nos direitos humanos dentro e fora da escola.",
      oQueE: "Envolve ações que estimulam o respeito às diferenças, a resolução pacífica de conflitos e a valorização da dignidade de cada pessoa.",
      porQueImporta: "Ambientes escolares mais acolhedores favorecem a aprendizagem, reduzem conflitos e fortalecem o bem-estar emocional de toda a comunidade.",
      oQueVocePodeFazer: [
        "Praticar a escuta ativa e o respeito às diferenças.",
        "Participar de rodas de conversa e projetos sobre convivência.",
        "Buscar o diálogo antes do conflito.",
        "Denunciar situações de desrespeito a direitos aos responsáveis pela escola."
      ],
      sinaisDeAtencao: [
        "Situações recorrentes de discriminação ou exclusão.",
        "Sinais de isolamento social de colegas."
      ],
      ondeBuscarAjuda: "A coordenação pedagógica e o serviço de orientação da escola podem apoiar situações de conflito ou violação de direitos.",
      galeria: [
        { arquivo: "img/temas/paz-1.jpg", legenda: "Atividade sobre cultura de paz realizada em sala" }
      ],
      fontes: [
        { titulo: "Programa Saúde na Escola — Ministério da Saúde", url: "https://www.gov.br/saude/pt-br/composicao/saps/pse", descricao: "Diretrizes oficiais do PSE." }
      ]
    }
  },
  {
    numero: 5,
    titulo: "Prevenção das violências e dos acidentes",
    resumo: "Ambientes seguros protegem crianças, adolescentes e toda a comunidade.",
    icone: "shield",
    cor: "rosa",
    imagem: { arquivo: "img/temas/prevencao-violencias.jpg", legenda: "Palestra sobre prevenção de acidentes na escola" },
    modal: {
      introducao: "A prevenção das violências e dos acidentes busca proteger crianças e adolescentes de situações que coloquem sua integridade em risco.",
      oQueE: "Envolve orientações sobre segurança no trânsito, prevenção de acidentes domésticos e escolares, e enfrentamento de diferentes formas de violência.",
      porQueImporta: "A prevenção reduz riscos evitáveis e cria uma rede de proteção mais forte entre escola, família e serviços públicos.",
      oQueVocePodeFazer: [
        "Seguir orientações de segurança em atividades escolares e no trânsito.",
        "Conversar com um adulto de confiança sobre situações de risco.",
        "Conhecer os canais de denúncia e proteção disponíveis.",
        "Apoiar colegas que possam estar em situação de vulnerabilidade."
      ],
      sinaisDeAtencao: [
        "Marcas físicas sem explicação convincente.",
        "Mudanças bruscas de comportamento ou medo de determinadas pessoas ou lugares."
      ],
      ondeBuscarAjuda: "Em caso de violência ou risco imediato, procure a direção da escola, o Conselho Tutelar, a UBS ou, em emergências, o serviço de emergência local.",
      galeria: [
        { arquivo: "img/temas/violencias-1.jpg", legenda: "Ação educativa sobre segurança e prevenção" }
      ],
      fontes: [
        { titulo: "Ministério da Saúde", url: "https://www.gov.br/saude/pt-br", descricao: "Informações sobre prevenção de violências e acidentes." }
      ]
    }
  },
  {
    numero: 6,
    titulo: "Prevenção de doenças negligenciadas",
    resumo: "Conhecer e prevenir doenças negligenciadas fortalece a saúde coletiva.",
    icone: "drop",
    cor: "verde",
    imagem: { arquivo: "img/temas/doencas-negligenciadas.jpg", legenda: "Estudantes pesquisando sobre doenças negligenciadas" },
    modal: {
      introducao: "As doenças negligenciadas afetam principalmente populações em situação de vulnerabilidade e muitas vezes recebem menos atenção e investimento.",
      oQueE: "São doenças, em geral de caráter infeccioso e parasitário, associadas a condições de saneamento, moradia e acesso limitado a serviços de saúde.",
      porQueImporta: "A informação e a prevenção comunitária são fundamentais, já que muitas dessas doenças podem ser evitadas com medidas simples de higiene e saneamento.",
      oQueVocePodeFazer: [
        "Manter hábitos de higiene pessoal e do ambiente.",
        "Eliminar criadouros de insetos e vetores.",
        "Participar de campanhas informativas da escola e da UBS.",
        "Buscar atendimento ao notar sinais persistentes de saúde."
      ],
      sinaisDeAtencao: [
        "Febre persistente sem causa aparente.",
        "Lesões de pele que não cicatrizam."
      ],
      ondeBuscarAjuda: "Procure a UBS mais próxima para avaliação e orientação adequada.",
      galeria: [
        { arquivo: "img/temas/negligenciadas-1.jpg", legenda: "Pesquisa estudantil sobre doenças negligenciadas" }
      ],
      fontes: [
        { titulo: "Organização Mundial da Saúde (OMS)", url: "https://www.who.int/pt", descricao: "Informações técnicas sobre doenças negligenciadas." }
      ]
    }
  },
  {
    numero: 7,
    titulo: "Verificação da situação vacinal",
    resumo: "Manter a caderneta de vacinação em dia protege você e a comunidade.",
    icone: "syringe",
    cor: "azul",
    imagem: { arquivo: "img/temas/vacinacao.jpg", legenda: "Ação de verificação da caderneta de vacinação na escola" },
    modal: {
      introducao: "A verificação da situação vacinal é uma das ações do PSE realizadas em parceria entre escolas e unidades de saúde.",
      oQueE: "Consiste em conferir se a caderneta de vacinação dos estudantes está atualizada conforme o calendário nacional de vacinação.",
      porQueImporta: "A vacinação é uma das formas mais eficazes de prevenir diversas doenças, protegendo tanto quem é vacinado quanto a comunidade ao redor.",
      oQueVocePodeFazer: [
        "Levar a caderneta de vacinação para conferência na escola ou na UBS.",
        "Atualizar vacinas em atraso na Unidade Básica de Saúde.",
        "Tirar dúvidas com a equipe de saúde sobre o calendário vacinal.",
        "Incentivar familiares a manterem a vacinação em dia."
      ],
      sinaisDeAtencao: [
        "Caderneta de vacinação extraviada ou desatualizada."
      ],
      ondeBuscarAjuda: "A UBS de referência realiza a atualização vacinal gratuitamente pelo SUS.",
      galeria: [
        { arquivo: "img/temas/vacinacao-1.jpg", legenda: "Conferência de cadernetas de vacinação na escola" }
      ],
      fontes: [
        { titulo: "Programa Nacional de Imunizações — Ministério da Saúde", url: "https://www.gov.br/saude/pt-br", descricao: "Calendário oficial de vacinação." }
      ]
    }
  },
  {
    numero: 8,
    titulo: "Saúde sexual e reprodutiva",
    resumo: "Informação e diálogo são fundamentais para escolhas seguras e conscientes.",
    icone: "ribbon",
    cor: "rosa",
    imagem: { arquivo: "img/temas/saude-sexual.jpg", legenda: "Roda de conversa sobre saúde sexual e reprodutiva" },
    modal: {
      introducao: "A saúde sexual e reprodutiva envolve informação, prevenção e acesso a serviços de saúde relacionados a essa dimensão da vida.",
      oQueE: "Abrange temas como prevenção de infecções sexualmente transmissíveis (IST), métodos contraceptivos e planejamento reprodutivo, sempre com base em informação e diálogo.",
      porQueImporta: "O acesso à informação de qualidade contribui para decisões mais seguras e conscientes, além de prevenir agravos à saúde.",
      oQueVocePodeFazer: [
        "Buscar informações em fontes confiáveis e com profissionais de saúde.",
        "Utilizar preservativo nas relações sexuais como forma de prevenção de IST.",
        "Procurar a UBS para orientação sobre métodos contraceptivos.",
        "Conversar abertamente com adultos de confiança ou profissionais de saúde."
      ],
      sinaisDeAtencao: [
        "Sintomas persistentes na região genital.",
        "Dúvidas sobre exposição a infecções sexualmente transmissíveis."
      ],
      ondeBuscarAjuda: "A UBS oferece atendimento sigiloso e gratuito em saúde sexual e reprodutiva pelo SUS.",
      galeria: [
        { arquivo: "img/temas/saude-sexual-1.jpg", legenda: "Atividade educativa sobre saúde sexual e reprodutiva" }
      ],
      fontes: [
        { titulo: "Ministério da Saúde", url: "https://www.gov.br/saude/pt-br", descricao: "Informações oficiais sobre saúde sexual e reprodutiva." }
      ]
    }
  },
  {
    numero: 9,
    titulo: "Prevenção ao uso de álcool, tabaco e outras drogas",
    resumo: "Informação e apoio ajudam a prevenir o uso precoce de substâncias.",
    icone: "noDrugs",
    cor: "laranja",
    imagem: { arquivo: "img/temas/prevencao-drogas.jpg", legenda: "Palestra sobre prevenção ao uso de álcool e outras drogas" },
    modal: {
      introducao: "A prevenção ao uso de álcool, tabaco e outras drogas busca oferecer informação clara para que crianças e adolescentes façam escolhas mais conscientes.",
      oQueE: "Envolve ações educativas sobre os riscos do uso dessas substâncias e o fortalecimento de fatores de proteção, como diálogo familiar e escolar.",
      porQueImporta: "Quanto mais cedo ocorre o contato com essas substâncias, maiores podem ser os riscos à saúde física e mental ao longo da vida.",
      oQueVocePodeFazer: [
        "Buscar informação de qualidade sobre os riscos do uso dessas substâncias.",
        "Conversar com adultos de confiança sobre pressões e dúvidas.",
        "Participar de atividades de prevenção promovidas pela escola.",
        "Procurar apoio caso você ou alguém próximo esteja enfrentando dificuldades."
      ],
      sinaisDeAtencao: [
        "Mudanças bruscas de comportamento, humor ou desempenho escolar.",
        "Isolamento social repentino."
      ],
      ondeBuscarAjuda: "A UBS e o Centro de Atenção Psicossocial (CAPS) do município oferecem acolhimento e orientação sobre esse tema.",
      galeria: [
        { arquivo: "img/temas/drogas-1.jpg", legenda: "Ação de prevenção realizada na escola" }
      ],
      fontes: [
        { titulo: "Ministério da Saúde", url: "https://www.gov.br/saude/pt-br", descricao: "Informações oficiais sobre prevenção ao uso de substâncias." }
      ]
    }
  },
  {
    numero: 10,
    titulo: "Saúde bucal",
    resumo: "Cuidar dos dentes e da boca é parte essencial da saúde geral.",
    icone: "tooth",
    cor: "amarelo",
    imagem: { arquivo: "img/temas/saude-bucal.jpg", legenda: "Estudantes participando de atividade sobre saúde bucal" },
    modal: {
      introducao: "A saúde bucal é parte importante da saúde geral e está diretamente relacionada a hábitos de higiene e alimentação.",
      oQueE: "Envolve cuidados diários com dentes e gengivas, além do acompanhamento periódico com profissionais de odontologia.",
      porQueImporta: "Bons hábitos de higiene bucal ajudam a prevenir cáries, doenças gengivais e outros problemas que podem afetar a qualidade de vida.",
      oQueVocePodeFazer: [
        "Escovar os dentes após as principais refeições.",
        "Usar fio dental diariamente.",
        "Reduzir o consumo de alimentos e bebidas açucaradas.",
        "Realizar consultas odontológicas periódicas."
      ],
      sinaisDeAtencao: [
        "Sangramento frequente na gengiva.",
        "Dor de dente persistente."
      ],
      ondeBuscarAjuda: "A UBS conta com equipes de saúde bucal para atendimento gratuito pelo SUS.",
      galeria: [
        { arquivo: "img/temas/bucal-1.jpg", legenda: "Oficina de escovação realizada na escola" }
      ],
      fontes: [
        { titulo: "Ministério da Saúde — Saúde Bucal", url: "https://www.gov.br/saude/pt-br", descricao: "Informações oficiais sobre saúde bucal." }
      ]
    }
  },
  {
    numero: 11,
    titulo: "Saúde auditiva",
    resumo: "Cuidar da audição contribui para a comunicação e a aprendizagem.",
    icone: "ear",
    cor: "azul",
    imagem: { arquivo: "img/temas/saude-auditiva.jpg", legenda: "Ação educativa sobre saúde auditiva na escola" },
    modal: {
      introducao: "A saúde auditiva envolve cuidados para preservar a audição e identificar precocemente possíveis alterações.",
      oQueE: "Trata da prevenção de perdas auditivas e da orientação sobre exposição segura a sons e ruídos.",
      porQueImporta: "A audição tem papel fundamental na comunicação, na aprendizagem e nas relações sociais.",
      oQueVocePodeFazer: [
        "Evitar exposição prolongada a sons muito altos.",
        "Usar fones de ouvido em volume moderado.",
        "Procurar avaliação auditiva quando notar dificuldades para ouvir.",
        "Participar das ações de triagem auditiva oferecidas pela escola."
      ],
      sinaisDeAtencao: [
        "Dificuldade para entender conversas, especialmente em ambientes barulhentos.",
        "Necessidade frequente de aumentar o volume de aparelhos."
      ],
      ondeBuscarAjuda: "A UBS pode orientar e encaminhar para avaliação especializada quando necessário.",
      galeria: [
        { arquivo: "img/temas/auditiva-1.jpg", legenda: "Triagem auditiva realizada na escola" }
      ],
      fontes: [
        { titulo: "Ministério da Saúde", url: "https://www.gov.br/saude/pt-br", descricao: "Informações sobre saúde auditiva." }
      ]
    }
  },
  {
    numero: 12,
    titulo: "Saúde ocular",
    resumo: "Enxergar bem influencia diretamente o aprendizado e o dia a dia.",
    icone: "eye",
    cor: "verde",
    imagem: { arquivo: "img/temas/saude-ocular.jpg", legenda: "Ação de triagem visual realizada na escola" },
    modal: {
      introducao: "A saúde ocular é fundamental para o desenvolvimento escolar e para a qualidade de vida de estudantes e profissionais.",
      oQueE: "Envolve cuidados com a visão e a identificação precoce de alterações que possam prejudicar o aprendizado.",
      porQueImporta: "Problemas de visão não identificados podem impactar diretamente o desempenho escolar e a segurança no dia a dia.",
      oQueVocePodeFazer: [
        "Fazer pausas visuais durante o uso prolongado de telas.",
        "Procurar avaliação oftalmológica quando notar dificuldades para enxergar.",
        "Participar das ações de triagem visual oferecidas pela escola.",
        "Usar óculos ou lentes indicados por profissional, quando necessário."
      ],
      sinaisDeAtencao: [
        "Dor de cabeça frequente relacionada à leitura ou uso de telas.",
        "Dificuldade para enxergar o quadro ou materiais escolares."
      ],
      ondeBuscarAjuda: "A UBS pode orientar e encaminhar para avaliação oftalmológica especializada quando necessário.",
      galeria: [
        { arquivo: "img/temas/ocular-1.jpg", legenda: "Triagem visual realizada com os estudantes" }
      ],
      fontes: [
        { titulo: "Ministério da Saúde", url: "https://www.gov.br/saude/pt-br", descricao: "Informações sobre saúde ocular." }
      ]
    }
  },
  {
    numero: 13,
    titulo: "Prevenção à Covid-19",
    resumo: "Medidas simples continuam importantes na prevenção de doenças respiratórias.",
    icone: "virus",
    cor: "rosa",
    imagem: { arquivo: "img/temas/covid-19.jpg", legenda: "Ação educativa sobre prevenção à Covid-19" },
    modal: {
      introducao: "A prevenção à Covid-19 segue como uma das temáticas do PSE, reforçando cuidados que também ajudam a prevenir outras doenças respiratórias.",
      oQueE: "Envolve orientações sobre vacinação, higiene das mãos, etiqueta respiratória e cuidados em caso de sintomas.",
      porQueImporta: "Manter hábitos de prevenção contribui para reduzir a circulação de vírus respiratórios na escola e na comunidade.",
      oQueVocePodeFazer: [
        "Manter o esquema vacinal contra Covid-19 atualizado conforme orientação da UBS.",
        "Higienizar as mãos com frequência.",
        "Cobrir boca e nariz ao tossir ou espirrar.",
        "Evitar frequentar ambientes coletivos ao apresentar sintomas respiratórios."
      ],
      sinaisDeAtencao: [
        "Febre associada a sintomas respiratórios.",
        "Dificuldade para respirar."
      ],
      ondeBuscarAjuda: "Em caso de sintomas, procure a UBS; em situações de emergência, procure atendimento de urgência imediatamente.",
      galeria: [
        { arquivo: "img/temas/covid-1.jpg", legenda: "Campanha escolar de prevenção a doenças respiratórias" }
      ],
      fontes: [
        { titulo: "Organização Mundial da Saúde (OMS)", url: "https://www.who.int/pt", descricao: "Orientações sobre prevenção da Covid-19." }
      ]
    }
  },
  {
    numero: 14,
    titulo: "Promoção da saúde mental",
    resumo: "Falar sobre saúde mental é essencial para o bem-estar de todos.",
    icone: "brain",
    cor: "laranja",
    imagem: { arquivo: "img/temas/saude-mental.jpg", legenda: "Roda de conversa sobre saúde mental com os estudantes" },
    modal: {
      introducao: "A promoção da saúde mental foi um dos temas mais destacados pelos próprios estudantes durante a pesquisa do projeto.",
      oQueE: "Envolve o cuidado com as emoções, o estresse, a ansiedade e as relações interpessoais, além da construção de ambientes escolares acolhedores.",
      porQueImporta: "A saúde mental influencia diretamente o aprendizado, as relações sociais e a qualidade de vida de estudantes e profissionais da escola.",
      oQueVocePodeFazer: [
        "Falar sobre seus sentimentos com pessoas de confiança.",
        "Praticar hábitos que favoreçam o bem-estar, como sono adequado e momentos de lazer.",
        "Procurar apoio quando sentir que está difícil lidar com as emoções sozinho.",
        "Acolher colegas que possam estar passando por dificuldades."
      ],
      sinaisDeAtencao: [
        "Tristeza persistente ou perda de interesse em atividades antes prazerosas.",
        "Isolamento social prolongado.",
        "Mudanças importantes no sono ou no apetite."
      ],
      ondeBuscarAjuda: "Procure a UBS, o serviço de psicologia escolar (quando disponível) ou o CVV (188) para apoio emocional. Em situações de risco imediato, procure atendimento de urgência.",
      galeria: [
        { arquivo: "img/temas/mental-1.jpg", legenda: "Roda de conversa sobre saúde mental realizada na escola" }
      ],
      fontes: [
        { titulo: "Centro de Valorização da Vida (CVV)", url: "https://www.cvv.org.br/", descricao: "Apoio emocional gratuito, sigiloso e disponível 24 horas." },
        { titulo: "Ministério da Saúde", url: "https://www.gov.br/saude/pt-br", descricao: "Informações oficiais sobre saúde mental." }
      ]
    }
  }
];


/* =====================================================================
   PERGUNTAS FREQUENTES (FAQ)
   COPIE UM BLOCO INTEIRO { ... }, COM A VÍRGULA, PARA ADICIONAR UMA
   NOVA PERGUNTA. PARA REMOVER, APAGUE O BLOCO INTEIRO.
   Campos: id (número único), pergunta, resposta, tema
   ===================================================================== */
const perguntas = [
  { id: 1, pergunta: "O que é o PSE?", resposta: "O Programa Saúde na Escola (PSE) é uma iniciativa do governo federal que une as áreas da Saúde e da Educação para promover saúde e educação integral de crianças, adolescentes e jovens da rede pública de ensino.", tema: "Geral" },
  { id: 2, pergunta: "O que é o Fortalece PSE?", resposta: "É uma estratégia que reforça a execução do PSE nas escolas e territórios, ampliando o incentivo financeiro e o apoio para ações de educação e promoção da saúde nas unidades escolares.", tema: "Geral" },
  { id: 3, pergunta: "O que é o Projeto Infosaúde Jovem CCB?", resposta: "É um projeto criado por estudantes do 3º ano do Ensino Médio da Escola Estadual Carlos de Castro Brasil para levar informação de saúde confiável à comunidade escolar, em conexão com o PSE e o Fortalece PSE.", tema: "Geral" },
  { id: 4, pergunta: "Quem participou da criação do projeto?", resposta: "Estudantes do 3º ano do Ensino Médio, com orientação de professores da escola, desenvolveram a pesquisa, o conteúdo e a identidade visual do projeto.", tema: "Geral" },
  { id: 5, pergunta: "Quais são as 14 temáticas do PSE trabalhadas no projeto?", resposta: "Saúde ambiental; promoção da atividade física; alimentação saudável e prevenção da obesidade; cultura de paz e direitos humanos; prevenção das violências e dos acidentes; prevenção de doenças negligenciadas; verificação da situação vacinal; saúde sexual e reprodutiva; prevenção ao uso de álcool, tabaco e outras drogas; saúde bucal; saúde auditiva; saúde ocular; prevenção à Covid-19; e promoção da saúde mental.", tema: "Geral" },
  { id: 6, pergunta: "O que é a UBS?", resposta: "A Unidade Básica de Saúde (UBS) é uma das principais portas de entrada do SUS, oferecendo atendimento próximo da residência das pessoas, com foco em prevenção, promoção e cuidado continuado da saúde.", tema: "Contatos e serviços" },
  { id: 7, pergunta: "O que é o SUS?", resposta: "O Sistema Único de Saúde (SUS) é o sistema público de saúde do Brasil, que garante acesso universal e gratuito a serviços de saúde para toda a população.", tema: "Contatos e serviços" },
  { id: 8, pergunta: "Como funciona o CVV?", resposta: "O Centro de Valorização da Vida (CVV) oferece apoio emocional e prevenção do suicídio, de forma voluntária, gratuita e sigilosa, pelo telefone 188, disponível 24 horas por dia.", tema: "Saúde mental" },
  { id: 9, pergunta: "Por que a saúde mental foi tão citada na pesquisa do projeto?", resposta: "Na pesquisa realizada pelos estudantes, a ansiedade e o estresse foram apontados como os principais problemas de saúde entre os participantes, o que motivou o projeto a dar destaque especial a esse tema.", tema: "Saúde mental" },
  { id: 10, pergunta: "O site do projeto substitui um atendimento médico?", resposta: "Não. O conteúdo do site é educativo e informativo. Para qualquer avaliação individual, é fundamental procurar um profissional de saúde ou a UBS.", tema: "Geral" },
  { id: 11, pergunta: "Quais vacinas fazem parte do calendário escolar?", resposta: "O calendário nacional de vacinação é definido pelo Ministério da Saúde e pode ser consultado e atualizado gratuitamente na UBS de referência.", tema: "Vacinação" },
  { id: 12, pergunta: "Por que é importante verificar a caderneta de vacinação?", resposta: "Manter a caderneta atualizada garante que a pessoa esteja protegida contra diversas doenças e ajuda a manter a proteção coletiva da comunidade.", tema: "Vacinação" },
  { id: 13, pergunta: "O que fazer em caso de bullying na escola?", resposta: "É importante comunicar a situação a um adulto de confiança, professor ou à direção da escola, que pode orientar e encaminhar o caso adequadamente.", tema: "Cultura de paz e direitos humanos" },
  { id: 14, pergunta: "Como cuidar da saúde bucal no dia a dia?", resposta: "Escovar os dentes após as refeições, usar fio dental diariamente e reduzir o consumo de açúcar são hábitos simples que ajudam a prevenir problemas bucais.", tema: "Saúde bucal" },
  { id: 15, pergunta: "Quando devo procurar avaliação da visão?", resposta: "Sempre que notar dificuldade para enxergar de perto ou de longe, dor de cabeça relacionada à leitura ou dificuldade para ver o quadro na escola.", tema: "Saúde ocular" },
  { id: 16, pergunta: "Quando devo procurar avaliação da audição?", resposta: "Ao perceber dificuldade para entender conversas, necessidade de aumentar muito o volume de sons ou zumbido persistente nos ouvidos.", tema: "Saúde auditiva" },
  { id: 17, pergunta: "O uso de fones de ouvido em volume alto faz mal?", resposta: "A exposição frequente a sons muito altos pode representar risco à audição ao longo do tempo, por isso recomenda-se usar volume moderado.", tema: "Saúde auditiva" },
  { id: 18, pergunta: "O que é uma alimentação saudável?", resposta: "É aquela baseada principalmente em alimentos in natura ou minimamente processados, variada, colorida e com baixo consumo de ultraprocessados.", tema: "Alimentação saudável e prevenção da obesidade" },
  { id: 19, pergunta: "A prática de atividade física precisa ser intensa para fazer bem?", resposta: "Não necessariamente. Atividades físicas leves e moderadas, realizadas com regularidade, já trazem benefícios importantes para a saúde.", tema: "Promoção da atividade física" },
  { id: 20, pergunta: "O que fazer se eu suspeitar que um colega está em situação de risco?", resposta: "Procure informar um adulto de confiança, como professor, orientador ou a direção da escola, para que a situação seja acompanhada com cuidado.", tema: "Prevenção das violências e dos acidentes" },
  { id: 21, pergunta: "O projeto trata sobre prevenção de IST?", resposta: "Sim. Dentro da temática de saúde sexual e reprodutiva, o projeto reforça a importância da informação, do uso de preservativo e do acompanhamento na UBS.", tema: "Saúde sexual e reprodutiva" },
  { id: 22, pergunta: "Onde posso tirar dúvidas sobre métodos contraceptivos?", resposta: "A UBS oferece orientação gratuita e sigilosa sobre métodos contraceptivos e planejamento reprodutivo.", tema: "Saúde sexual e reprodutiva" },
  { id: 23, pergunta: "A Covid-19 ainda é um tema relevante?", resposta: "Sim. A prevenção à Covid-19 continua sendo uma das temáticas do PSE, reforçando cuidados como vacinação e higiene, que também ajudam a prevenir outras doenças respiratórias.", tema: "Prevenção à Covid-19" },
  { id: 24, pergunta: "O que fazer se eu tiver sintomas respiratórios?", resposta: "Evite frequentar ambientes coletivos, adote cuidados de higiene e procure a UBS para avaliação caso os sintomas persistam ou piorem.", tema: "Prevenção à Covid-19" },
  { id: 25, pergunta: "O que são doenças negligenciadas?", resposta: "São doenças, geralmente infecciosas ou parasitárias, associadas a condições de saneamento e vulnerabilidade social, que muitas vezes recebem menos atenção e investimento.", tema: "Prevenção de doenças negligenciadas" },
  { id: 26, pergunta: "Como o projeto ajuda a prevenir o uso de drogas?", resposta: "Por meio de informação clara sobre riscos, fortalecimento do diálogo e indicação de canais de apoio, como a UBS e o CAPS.", tema: "Prevenção ao uso de álcool, tabaco e outras drogas" },
  { id: 27, pergunta: "Qual é a diferença entre UBS e hospital?", resposta: "A UBS é a porta de entrada preferencial do SUS, voltada à atenção primária e à prevenção, enquanto hospitais atendem casos que exigem maior complexidade ou internação.", tema: "Contatos e serviços" },
  { id: 28, pergunta: "Em caso de emergência, para quem devo ligar?", resposta: "Em emergências de saúde, ligue para o SAMU (192). Em emergências que envolvam incêndio, resgate ou acidentes, ligue para o Corpo de Bombeiros (193).", tema: "Contatos e serviços" },
  { id: 29, pergunta: "Como os dados da pesquisa do projeto foram coletados?", resposta: "Os dados foram coletados pelos próprios estudantes, por meio de um questionário aplicado a colegas da escola, e refletem exclusivamente as respostas desse grupo participante.", tema: "Geral" },
  { id: 30, pergunta: "Posso usar as informações do site para me automedicar?", resposta: "Não. O conteúdo é educativo e não substitui avaliação, diagnóstico ou prescrição de um profissional de saúde.", tema: "Geral" },
  { id: 31, pergunta: "A escola participa de ações com a UBS?", resposta: "Sim. Dentro do PSE, a escola desenvolve ações conjuntas com a UBS de referência, como verificação vacinal e ações educativas.", tema: "Geral" },
  { id: 32, pergunta: "Como posso contribuir com o projeto?", resposta: "Você pode participar das atividades promovidas pela escola, compartilhar informações confiáveis com colegas e cuidar da própria saúde com base em orientações de profissionais qualificados.", tema: "Geral" }
];


/* =====================================================================
   MURAL DE ATIVIDADES
   COPIE UM BLOCO INTEIRO PARA ADICIONAR UMA NOVA ATIVIDADE.
   ===================================================================== */



/* =====================================================================
   GALERIA GERAL DE FOTOS
   COPIE UM BLOCO INTEIRO PARA ADICIONAR UMA NOVA FOTO.
   ===================================================================== */



/* =====================================================================
   DADOS DA PESQUISA (SEÇÃO "DADOS")
   Estes números vêm da pesquisa aplicada pelos próprios estudantes do
   Projeto Infosaúde Jovem CCB e representam apenas o grupo participante,
   não a totalidade da população estudantil.
   ===================================================================== */


/* =====================================================================
   GLOSSÁRIO DE SAÚDE
   COPIE UM BLOCO INTEIRO PARA ADICIONAR UM NOVO TERMO.
   ===================================================================== */
const glossario = [
  { termo: "UBS", definicao: "Unidade Básica de Saúde. É uma das principais portas de entrada do SUS, responsável pela atenção primária e pelo acompanhamento contínuo da saúde da população de um território.", tema: "Contatos e serviços" },
  { termo: "SUS", definicao: "Sistema Único de Saúde. Sistema público brasileiro que garante acesso universal e gratuito a ações e serviços de saúde.", tema: "Contatos e serviços" },
  { termo: "PSE", definicao: "Programa Saúde na Escola. Iniciativa conjunta dos Ministérios da Saúde e da Educação para promover saúde e educação integral nas escolas públicas.", tema: "Geral" },
  { termo: "Fortalece PSE", definicao: "Estratégia que amplia o apoio e o incentivo à execução das ações do PSE nas escolas e territórios.", tema: "Geral" },
  { termo: "IST", definicao: "Infecção Sexualmente Transmissível. Infecções que podem ser transmitidas principalmente por contato sexual, muitas das quais podem ser prevenidas com uso de preservativo.", tema: "Saúde sexual e reprodutiva" },
  { termo: "HIV", definicao: "Vírus da Imunodeficiência Humana. Vírus que pode ser transmitido principalmente por via sexual, sanguínea ou de mãe para filho, e que exige acompanhamento médico especializado.", tema: "Saúde sexual e reprodutiva" },
  { termo: "Vacinação", definicao: "Processo de administração de vacinas para proteger o organismo contra determinadas doenças, contribuindo também para a proteção coletiva.", tema: "Verificação da situação vacinal" },
  { termo: "Saúde mental", definicao: "Estado de bem-estar em que a pessoa consegue lidar com as exigências do dia a dia, suas emoções e suas relações sociais de forma equilibrada.", tema: "Promoção da saúde mental" },
  { termo: "Saúde bucal", definicao: "Conjunto de cuidados relacionados à saúde dos dentes, gengivas e demais estruturas da boca.", tema: "Saúde bucal" },
  { termo: "Promoção da saúde", definicao: "Conjunto de estratégias e ações voltadas a melhorar a qualidade de vida e a saúde da população, atuando sobre seus determinantes sociais.", tema: "Geral" },
  { termo: "Prevenção", definicao: "Conjunto de ações destinadas a evitar o surgimento ou o agravamento de doenças e agravos à saúde.", tema: "Geral" },
  { termo: "Atenção Primária à Saúde", definicao: "Nível de atenção à saúde voltado ao cuidado contínuo e integral das pessoas, geralmente oferecido pelas UBS, sendo a principal porta de entrada do SUS.", tema: "Contatos e serviços" },
  { termo: "CVV", definicao: "Centro de Valorização da Vida. Serviço voluntário de apoio emocional e prevenção do suicídio, disponível gratuitamente pelo telefone 188.", tema: "Promoção da saúde mental" },
  { termo: "CAPS", definicao: "Centro de Atenção Psicossocial. Serviço do SUS voltado ao cuidado de pessoas em sofrimento psíquico ou em situações relacionadas ao uso de álcool e outras drogas.", tema: "Promoção da saúde mental" },
  { termo: "Saneamento básico", definicao: "Conjunto de serviços relacionados ao abastecimento de água, esgotamento sanitário, limpeza urbana e manejo de resíduos, fundamentais para a saúde ambiental.", tema: "Saúde ambiental" },
  { termo: "Imunização", definicao: "Processo pelo qual uma pessoa se torna protegida contra uma doença, geralmente por meio da vacinação.", tema: "Verificação da situação vacinal" },
  { termo: "Doenças negligenciadas", definicao: "Doenças, em geral infecciosas ou parasitárias, associadas a condições de vulnerabilidade social e que historicamente recebem menor atenção e investimento.", tema: "Prevenção de doenças negligenciadas" }
];


/* =====================================================================
   CONTATOS ÚTEIS
   ===================================================================== */
const contatos = {
  ubs: {
    titulo: "UBS — Unidade Básica de Saúde",
    descricao: "A UBS é uma das principais portas de entrada para cuidados de saúde no SUS, oferecendo atendimento próximo da residência das pessoas, com foco em prevenção, promoção e acompanhamento contínuo.",
    dica: "Procure a UBS de referência do seu bairro para orientações, vacinação, acompanhamento e encaminhamentos."
  },
  sus: {
    titulo: "SUS — Sistema Único de Saúde",
    descricao: "O SUS garante acesso universal e gratuito a serviços de saúde em todo o Brasil, incluindo atenção primária, especializada, urgência e emergência.",
    link: { titulo: "Portal oficial do SUS", url: "https://www.gov.br/saude/pt-br" }
  },
  cvv: {
    titulo: "CVV — Centro de Valorização da Vida",
    numero: "188",
    descricao: "Apoio emocional gratuito, sigiloso e disponível 24 horas por dia, todos os dias da semana, por telefone, chat e e-mail.",
    link: { titulo: "Site do CVV", url: "https://www.cvv.org.br/" }
  },
  emergencias: [
    { titulo: "SAMU", numero: "192", descricao: "Serviço de Atendimento Móvel de Urgência, para emergências de saúde." },
    { titulo: "Corpo de Bombeiros", numero: "193", descricao: "Atendimento a emergências que envolvam incêndio, resgate e acidentes." }
  ]
};


/* =====================================================================
   EQUIPE
   COPIE UM BLOCO INTEIRO PARA ADICIONAR UM NOVO INTEGRANTE.
   O campo "foto" é opcional — se não existir, o site mostra um espaço
   reservado no lugar da imagem.
   ===================================================================== */


/* =====================================================================
   DIÁRIO DE BORDO
   COPIE UM BLOCO INTEIRO PARA ADICIONAR UMA NOVA ETAPA.
   ===================================================================== */


/* =====================================================================
   FONTES E REFERÊNCIAS OFICIAIS
   ===================================================================== */
const referencias = [
  { titulo: "Ministério da Saúde", url: "https://www.gov.br/saude/pt-br", descricao: "Portal oficial do Ministério da Saúde do Brasil." },
  { titulo: "Programa Saúde na Escola (PSE)", url: "https://www.gov.br/saude/pt-br/composicao/saps/pse", descricao: "Página oficial do Programa Saúde na Escola." },
  { titulo: "Biblioteca Virtual em Saúde (BVS)", url: "https://bvsms.saude.gov.br/", descricao: "Biblioteca com documentos técnicos e científicos em saúde." },
  { titulo: "Organização Pan-Americana da Saúde (OPAS)", url: "https://www.paho.org/pt", descricao: "Organismo internacional de saúde pública nas Américas." },
  { titulo: "Organização Mundial da Saúde (OMS)", url: "https://www.who.int/pt", descricao: "Organismo internacional responsável por questões de saúde pública global." },
  { titulo: "Centro de Valorização da Vida (CVV)", url: "https://www.cvv.org.br/", descricao: "Apoio emocional voluntário, gratuito e sigiloso." }
];
