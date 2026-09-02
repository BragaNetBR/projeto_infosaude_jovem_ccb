/* =====================================================================
HOLOMED — THREE.JS + GEMINI API (Projeto Infosaúde Jovem CCB)
v2 — modelo procedural aprimorado + animações automáticas por estado
Debug: acrescente ?holomed-debug=1 na URL, ou
       localStorage.setItem("holomedDebug","1")
===================================================================== */
(function () {
  "use strict";

  var GEMINI_KEY = "AIzaSyAW7TS02a-qEPjsePTuVpLtHc2hPlTmnP0";
  var GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" + GEMINI_KEY;

  var SYSTEM_PROMPT = "Você é HoloMed, assistente virtual educativo do Projeto Infosaúde Jovem CCB (Escola Estadual Carlos de Castro Brasil, Corumbá-MS). Público: adolescentes 12-18 anos.\n\n" +
    "REGRAS OBRIGATÓRIAS:\n" +
    "- Responda em 2-4 frases curtas, linguagem simples e acolhedora.\n" +
    "- Use tom amigável, sem julgar.\n" +
    "- NUNCA dê diagnóstico médico.\n" +
    "- Temas prioritários: saúde mental (ansiedade, estresse), prevenção de drogas/álcool/vape, saúde sexual (ISTs, contracepção, consentimento), bullying, alimentação, atividade física.\n" +
    "- SEMPRE termine com aviso educativo: 'Conteúdo educativo 💚 Para avaliação individual, procure a UBS ou profissional de saúde.'\n" +
    "- Em crise/suicídio: 'Ligue 188 (CVV) — 24h, gratuito e sigiloso.'\n" +
    "- Em violência: 'Disque 100 (Direitos Humanos) ou Conselho Tutelar.'\n" +
    "- Em emergência médica: 'SAMU 192.'\n\n" +
    "Contexto do projeto: 14 temáticas do PSE, totem de perguntas anônimas, parceria com UBS. Você responde dúvidas que estudantes mandaram anonimamente.";

  var reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var DEBUG = (function () {
    try {
      return /[?&]holomed-debug\b/i.test(location.search) ||
        window.localStorage.getItem("holomedDebug") === "1";
    } catch (e) { return false; }
  })();

  /* PRNG determinístico (mulberry32) — ruído procedural reproduzível */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var rng = mulberry32(20771);

  var DICAS = [
    "Beber água e dormir 8–9 horas por noite já melhora o humor e a concentração. 💧",
    "Se estiver passando por um momento difícil, o CVV liga 188 — 24h, gratuito e sigiloso. 💚",
    "Movimentar o corpo 30 minutos por dia (até uma caminhada) já conta como exercício. 🏃",
    "Ninguém precisa aguentar bullying sozinho — conte para um adulto de confiança. 🤝",
    "Perguntar sobre saúde não é vergonha: dúvida esclarecida é proteção. ✨"
  ];
  var dicaIdx = 0;

  /* ---------- DOM ---------- */
  var botao = document.createElement("button");
  botao.id = "holomed-botao"; botao.type = "button";
  botao.setAttribute("aria-label", "Abrir assistente HoloMed");
  botao.setAttribute("aria-expanded", "false");
  botao.innerHTML = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M24 40C10 30 4 22 4 14a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 8-6 16-20 26Z"/></svg>';

  var painel = document.createElement("section");
  painel.id = "holomed-painel"; painel.hidden = true;
  painel.setAttribute("aria-label", "Assistente HoloMed");
  painel.innerHTML =
    '<header id="holomed-topo"><strong>HoloMed</strong><span>Assistente de IA · Infosaúde Jovem CCB</span></header>' +
    '<div id="holomed-palco"></div>' +
    '<div id="holomed-expressoes" role="group" aria-label="Animações do HoloMed"></div>' +
    '<div id="holomed-chat" aria-live="polite"></div>' +
    '<form id="holomed-form"><input id="holomed-input" type="search" placeholder="Pergunte sobre saúde…" autocomplete="off" aria-label="Pergunta"><button type="submit">Enviar</button></form>';

  document.body.appendChild(botao); document.body.appendChild(painel);

  var palco = painel.querySelector("#holomed-palco");
  var chat = painel.querySelector("#holomed-chat");
  var form = painel.querySelector("#holomed-form");
  var input = painel.querySelector("#holomed-input");
  var barra = painel.querySelector("#holomed-expressoes");

  /* ---------- Diretor de animação (estado dirigido por eventos) ---------- */
  var simT = 0;                        // tempo de simulação (pausa quando o painel fecha)
  var anim = { atual: "Idle", fim: 0, fila: [] };
  var atento = false;                  // usuário digitando → robô "escuta"

  function tocar(nome, ms) {
    anim.fila.length = 0;
    anim.atual = nome;
    anim.fim = simT + (ms == null ? 2600 : ms);
  }
  function sequencia(passos) {         // [["Joy",1700],["Talk",60000], ...]
    anim.fila = passos.slice();
    avancar();
  }
  function avancar() {
    var p = anim.fila.shift();
    if (p) { anim.atual = p[0]; anim.fim = simT + p[1]; }
    else { anim.atual = "Idle"; anim.fim = 0; }
  }

  /* Botões de expressão: ocultos por padrão (só debug) */
  if (DEBUG) {
    ["Idle", "Wave", "Talk", "Empathy", "Thinking", "Joy", "Surprise"].forEach(function (n) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = n;
      b.addEventListener("click", function () { tocar(n, 4000); });
      barra.appendChild(b);
    });
    barra.hidden = false;
  } else {
    barra.hidden = true;
    barra.style.display = "none";
  }

  /* ---------- Painel ---------- */
  function abrir() {
    painel.hidden = false;
    botao.setAttribute("aria-expanded", "true");
    redimensionar();
    sequencia([["Wave", 2100]]);
    if (!chat.children.length) mensagem("bot", "Oi! Sou o HoloMed 💚 Pergunte sobre saúde mental, drogas, ISTs, bullying…");
    input.focus();
  }
  function fechar() {
    painel.hidden = true;
    botao.setAttribute("aria-expanded", "false");
    botao.focus();
  }
  botao.addEventListener("click", function () { painel.hidden ? abrir() : fechar(); });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && !painel.hidden) fechar(); });

  input.addEventListener("focus", function () { atento = true; });
  input.addEventListener("blur", function () { atento = false; });

  /* ---------- Chat ---------- */
  function mensagem(quem, texto) {
    var div = document.createElement("div");
    div.className = "holomed-msg " + quem;
    div.textContent = texto;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return div;
  }

  var digitandoAtual = null;
  function digitar(el, texto) {          // efeito máquina + fala sincronizada
    if (digitandoAtual) {
      digitandoAtual.parar = true;
      digitandoAtual.el.textContent = digitandoAtual.completo;
    }
    var est = { parar: false, el: el, completo: texto };
    digitandoAtual = est;
    var i = 0;
    (function passo() {
      if (est.parar) return;
      i = Math.min(texto.length, i + 1 + Math.floor(Math.random() * 2));
      el.textContent = texto.slice(0, i);
      chat.scrollTop = chat.scrollHeight;
      if (i < texto.length) setTimeout(passo, 24);
      else finalizarFala();
    })();
  }
  function finalizarFala() {
    if (anim.atual === "Talk") tocar("Idle", 0);
  }

  function buscarLocal(texto) {
    if (typeof perguntas === "undefined") return null;
    var palavras = texto.toLowerCase().split(/[^\wà-ú]+/).filter(function (p) { return p.length > 3; });
    var melhor = null, pontos = 0;
    perguntas.forEach(function (p) {
      var alvo = (p.pergunta + " " + p.resposta + " " + p.tema).toLowerCase();
      var q = 0;
      palavras.forEach(function (w) { if (alvo.indexOf(w) !== -1) q++; });
      if (q > pontos) { pontos = q; melhor = p; }
    });
    return pontos >= 2 ? melhor : null;
  }

  async function perguntarGemini(pergunta) {
    try {
      var corpo = {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: pergunta }] }]
      };
      var r = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
      });
      if (!r.ok) throw new Error("HTTP " + r.status);
      var d = await r.json();
      return (d.candidates && d.candidates[0] && d.candidates[0].content.parts[0].text) || null;
    } catch (e) {
      console.warn("Gemini falhou:", e);
      return null;
    }
  }

  /* Heurística de sentimento (aproximação) → escolhe a reação automática */
  function sentimento(txt) {
    var t = " " + txt.toLowerCase() + " ";
    if (/(188|cvv|crise|suic[íi]dio|viol[êe]ncia|disque 100|abuso|emerg[êe]ncia|samu|192|perigo|risco|triste|sozinh)/.test(t)) return "Empathy";
    if (/(uau|uow|wow|incr[íi]vel|impressionante|cuidado|aten[çc][ãa]o|nunca fa[çc]a|!!|❗|⚠)/.test(t)) return "Surprise";
    if (/(parab[ée]ns|orgulho|voc[êe] consegue|consegue|melhor|legal|adorei|[óo]tim[oa]|excelente|maravilhoso|vale a pena|💚|✨)/.test(t)) return "Joy";
    return "Talk";
  }

  function responder(el, texto) {
    var reacao = sentimento(texto);
    if (reduzido) {                       // sem animação de digitação
      el.textContent = texto;
      tocar(reacao === "Talk" ? "Talk" : reacao, 2500);
      return;
    }
    if (reacao !== "Talk") sequencia([[reacao, 1700], ["Talk", 600000]]);
    else tocar("Talk", 600000);           // "Talk" termina quando o texto acaba
    digitar(el, texto);
  }

  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    var texto = input.value.trim();
    if (!texto) return;
    mensagem("usuario", texto);
    input.value = "";
    tocar("Thinking", Infinity);          // pensa até a resposta chegar
    var loading = mensagem("bot", "Pensando…");
    var pontos = setInterval(function () {
      if (loading.textContent.indexOf("Pensando") === 0) {
        loading.textContent = "Pensando" + ".".repeat(1 + (Math.floor(Date.now() / 400) % 3));
      }
    }, 400);

    var local = buscarLocal(texto);
    if (local) {
      clearInterval(pontos);
      responder(loading, local.resposta + " (Tema: " + local.tema + ")");
      return;
    }

    var ia = await perguntarGemini(texto);
    clearInterval(pontos);
    if (ia) {
      responder(loading, ia);
    } else {
      loading.textContent = "Não consegui responder agora. Tente de novo em instantes ou procure a UBS. " +
        (typeof textos !== "undefined" && textos && textos.avisoEducativo ? textos.avisoEducativo : "");
      sequencia([["Empathy", 2600]]);
    }
  });

  if (window.THREE) iniciar3D(); else fallback2D();

  function fallback2D() {
    palco.innerHTML = '<div id="holomed-fallback"><svg viewBox="0 0 200 260" aria-hidden="true"><ellipse cx="100" cy="245" rx="55" ry="10" fill="none" stroke="#FFB74D" stroke-width="5" opacity="0.8"/><rect x="60" y="95" width="80" height="70" rx="26" fill="#9adcf0" opacity="0.65"/><circle cx="100" cy="55" r="45" fill="#f4f7fa"/><rect x="66" y="32" width="68" height="44" rx="20" fill="#041018"/><circle cx="86" cy="50" r="6" fill="#7ff3ff"/><circle cx="114" cy="50" r="6" fill="#7ff3ff"/><path d="M90 62 Q100 70 110 62" stroke="#7ff3ff" stroke-width="4" fill="none"/></svg></div>';
  }

  var redimensionar = function () {};

  /* =====================================================================
  MODELO 3D PROCEDURAL — blockout → estrutura → forma → material → luz
  ===================================================================== */
  function iniciar3D() {
    var T = window.THREE;
    var renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if ("outputColorSpace" in renderer && T.SRGBColorSpace) renderer.outputColorSpace = T.SRGBColorSpace;
    else if (T.sRGBEncoding !== undefined) { try { renderer.outputEncoding = T.sRGBEncoding; } catch (e) {} }
    if (T.ACESFilmicToneMapping !== undefined) {
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
    }
    if (T.PCFSoftShadowMap !== undefined) renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";
    palco.appendChild(renderer.domElement);

    var cena = new T.Scene();
    var camera = new T.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 0.34, 4.9);
    camera.lookAt(0, 0.09, 0);

    /* luz: key com sombra + rim ciano + fill */
    cena.add(new T.AmbientLight(0xffffff, 0.75));
    cena.add(new T.HemisphereLight(0xdff3ff, 0x2b3440, 0.55));
    var dir = new T.DirectionalLight(0xffffff, 1.0);
    dir.position.set(2.5, 4, 3.5);
    dir.castShadow = true;
    if (dir.shadow.mapSize) dir.shadow.mapSize.set(512, 512);
    dir.shadow.camera.left = -2.4; dir.shadow.camera.right = 2.4;
    dir.shadow.camera.top = 2.6; dir.shadow.camera.bottom = -2.4;
    dir.shadow.camera.near = 1; dir.shadow.camera.far = 12;
    dir.shadow.bias = -0.0004;
    dir.shadow.camera.updateProjectionMatrix();
    cena.add(dir);
    var rim = new T.DirectionalLight(0x5fd4ff, 0.55);
    rim.position.set(-2.5, 1.6, -3.2); cena.add(rim);
    var pt = new T.PointLight(0x4fc3f7, 0.5);
    pt.position.set(0, 0.6, 2.4); cena.add(pt);

    var chao = new T.Mesh(new T.PlaneGeometry(7, 7), new T.ShadowMaterial({ opacity: 0.22 }));
    chao.rotation.x = -Math.PI / 2; chao.position.y = -1.5;
    chao.receiveShadow = true; cena.add(chao);

    /* materiais */
    var matCasco = new T.MeshPhysicalMaterial({ color: 0xf5f8fb, roughness: 0.3, metalness: 0.04, clearcoat: 0.55, clearcoatRoughness: 0.3 });
    var matVisor = new T.MeshPhysicalMaterial({ color: 0x06141f, roughness: 0.14, metalness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08 });
    var matHolo = new T.MeshPhysicalMaterial({ color: 0x9adcf0, transparent: true, opacity: 0.5, roughness: 0.2, metalness: 0, emissive: 0x12454f, emissiveIntensity: 0.4, depthWrite: false });
    var matNucleo = new T.MeshStandardMaterial({ color: 0x11242e, roughness: 0.45, metalness: 0.6 });
    var matLaranja = new T.MeshStandardMaterial({ color: 0xffb74d, roughness: 0.38, metalness: 0.05, emissive: 0xff9800, emissiveIntensity: 0.45 });
    var matMao = new T.MeshStandardMaterial({ color: 0x5c6d79, roughness: 0.45, metalness: 0.15 });
    var matAural = new T.MeshBasicMaterial({ color: 0x7ff3ff });

    var robo = new T.Group(); cena.add(robo);

    /* --- cabeça: casca branca + visor curvo + tela --- */
    var cabeca = new T.Group(); cabeca.position.y = 1.15; robo.add(cabeca);
    var casca = new T.Group(); casca.scale.set(1, 0.92, 0.95); cabeca.add(casca);

    var cranio = new T.Mesh(new T.SphereGeometry(0.52, 48, 32), matCasco);
    cranio.castShadow = true; casca.add(cranio);

    var PHI_C = Math.PI / 2, PHI_L = 1.8, TH_L = 1.3;   // visor frontal centrado em +Z
    var cascoVisor = new T.Mesh(
      new T.SphereGeometry(0.535, 48, 24, PHI_C - PHI_L / 2, PHI_L, Math.PI / 2 - TH_L / 2, TH_L),
      matVisor
    );
    casca.add(cascoVisor);

    var rostoCv = document.createElement("canvas");
    rostoCv.width = 256; rostoCv.height = 184;
    var rctx = rostoCv.getContext("2d");
    var rostoTex = new T.CanvasTexture(rostoCv);
    if (rostoTex.colorSpace !== undefined && T.SRGBColorSpace) rostoTex.colorSpace = T.SRGBColorSpace;
    var tela = new T.Mesh(
      new T.SphereGeometry(0.545, 48, 24, PHI_C - PHI_L / 2, PHI_L, Math.PI / 2 - TH_L / 2, TH_L),
      new T.MeshBasicMaterial({ map: rostoTex, transparent: true, depthWrite: false })
    );
    casca.add(tela);

    /* orelhas com núcleo luminoso */
    [-1, 1].forEach(function (lado) {
      var ore = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.09, 24), matLaranja);
      ore.rotation.z = Math.PI / 2; ore.position.set(lado * 0.55, 0, 0);
      ore.castShadow = true; cabeca.add(ore);
      var nuc = new T.Mesh(new T.CylinderGeometry(0.055, 0.055, 0.02, 20), matAural);
      nuc.rotation.z = Math.PI / 2; nuc.position.set(lado * 0.6, 0, 0);
      cabeca.add(nuc);
    });

    var pescoco = new T.Mesh(new T.CylinderGeometry(0.1, 0.11, 0.16, 20), matNucleo);
    pescoco.position.set(0, 0.64, 0); robo.add(pescoco);

    /* --- tronco holográfico com endoesqueleto interno --- */
    var torso = new T.Mesh(new T.CapsuleGeometry(0.4, 0.4, 8, 24), matHolo);
    torso.position.y = 0.02; robo.add(torso);
    var nucleo = new T.Mesh(new T.CapsuleGeometry(0.1, 0.52, 6, 16), matNucleo);
    nucleo.position.y = 0.02; robo.add(nucleo);

    var fc = new T.Shape();
    fc.moveTo(0, -0.24);
    fc.bezierCurveTo(0.26, 0.02, 0.23, 0.3, 0, 0.15);
    fc.bezierCurveTo(-0.23, 0.3, -0.26, 0.02, 0, -0.24);
    var coracao = new T.Mesh(new T.ShapeGeometry(fc), new T.MeshBasicMaterial({ color: 0x7cfc9a, side: T.DoubleSide }));
    coracao.position.set(0, 0.24, 0.27); robo.add(coracao);

    /* textura de brilho (sprite radial) reutilizável */
    var brilhoCv = document.createElement("canvas");
    brilhoCv.width = brilhoCv.height = 64;
    var bctx = brilhoCv.getContext("2d");
    var grad = bctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.3, "rgba(255,255,255,0.5)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    bctx.fillStyle = grad; bctx.fillRect(0, 0, 64, 64);
    var texBrilho = new T.CanvasTexture(brilhoCv);

    var brilhoCoracao = new T.Sprite(new T.SpriteMaterial({ map: texBrilho, color: 0x7cfc9a, transparent: true, opacity: 0.55, blending: T.AdditiveBlending, depthWrite: false }));
    brilhoCoracao.scale.set(0.55, 0.55, 1);
    brilhoCoracao.position.copy(coracao.position);
    robo.add(brilhoCoracao);

    /* --- base flutuante: quadril, cauda, anel de propulsão, jato --- */
    var quadril = new T.Mesh(new T.SphereGeometry(0.28, 32, 24), matCasco);
    quadril.scale.set(1.12, 0.62, 0.92); quadril.position.y = -0.58;
    quadril.castShadow = true; robo.add(quadril);
    var cauda = new T.Mesh(new T.SphereGeometry(0.22, 32, 24), matHolo);
    cauda.scale.set(1, 1.55, 1); cauda.position.y = -0.88; robo.add(cauda);
    var anel = new T.Mesh(new T.TorusGeometry(0.66, 0.026, 12, 64), new T.MeshBasicMaterial({ color: 0xffb74d, transparent: true, opacity: 0.85 }));
    anel.rotation.x = Math.PI / 2; anel.position.y = -1.28; robo.add(anel);
    var motor = new T.Sprite(new T.SpriteMaterial({ map: texBrilho, color: 0xffb74d, transparent: true, opacity: 0.5, blending: T.AdditiveBlending, depthWrite: false }));
    motor.scale.set(0.85, 0.85, 1); motor.position.set(0, -1.36, 0); robo.add(motor);

    /* --- braços: ombro + cotovelo + mão com polegar --- */
    function braco(lado) { // -1 esquerda | +1 direita
      var ombro = new T.Group();
      ombro.position.set(lado * 0.5, 0.42, 0);
      var esferaOmbro = new T.Mesh(new T.SphereGeometry(0.115, 20, 16), matLaranja);
      esferaOmbro.castShadow = true; ombro.add(esferaOmbro);

      var superior = new T.Group(); ombro.add(superior);
      var segSup = new T.Mesh(new T.CapsuleGeometry(0.08, 0.24, 4, 12), matHolo);
      segSup.position.y = -0.15; superior.add(segSup);

      var cotovelo = new T.Group(); cotovelo.position.y = -0.32; superior.add(cotovelo);
      cotovelo.add(new T.Mesh(new T.SphereGeometry(0.085, 20, 16), matHolo));
      var segAnt = new T.Mesh(new T.CapsuleGeometry(0.07, 0.2, 4, 12), matHolo);
      segAnt.position.y = -0.13; cotovelo.add(segAnt);

      var mao = new T.Group(); mao.position.y = -0.3; cotovelo.add(mao);
      var palma = new T.Mesh(new T.SphereGeometry(0.095, 20, 16), matMao);
      palma.scale.set(0.95, 1.1, 0.8); palma.castShadow = true; mao.add(palma);
      var polegar = new T.Mesh(new T.CapsuleGeometry(0.035, 0.05, 3, 8), matMao);
      polegar.position.set(-lado * 0.08, -0.02, 0.03);
      polegar.rotation.z = -lado * 0.7;
      mao.add(polegar);

      robo.add(ombro);
      return { raiz: ombro, cot: cotovelo, mao: mao };
    }
    var bracoE = braco(-1), bracoD = braco(1);

    /* partículas de energia (posições determinísticas) */
    var nPart = 42, posArr = new Float32Array(nPart * 3);
    for (var i = 0; i < nPart; i++) {
      var ang = rng() * Math.PI * 2;
      var raioP = 1.05 + rng() * 0.55;
      posArr[i * 3] = Math.cos(ang) * raioP;
      posArr[i * 3 + 1] = -1.25 + rng() * 2.75;
      posArr[i * 3 + 2] = Math.sin(ang) * raioP;
    }
    var partGeo = new T.BufferGeometry();
    partGeo.setAttribute("position", new T.BufferAttribute(posArr, 3));
    var particulas = new T.Points(partGeo, new T.PointsMaterial({ color: 0x8fd8ef, size: 0.05, map: texBrilho, transparent: true, opacity: 0.45, depthWrite: false, blending: T.AdditiveBlending }));
    cena.add(particulas);

    /* ---------- rosto: expressões + piscar + olhar ---------- */
    var olhar = { x: 0, y: 0 }, olharAlvo = { x: 0, y: 0 }, olharAte = 0;
    var piscar = { fase: 0, prox: 1.6 };

    function desenharRosto(expr, t) {
      var W = 256, H = 184;
      rctx.clearRect(0, 0, W, H);

      rctx.globalAlpha = 0.06;             // scanlines sutis
      rctx.fillStyle = "#7ff3ff";
      for (var sy = 2; sy < H; sy += 5) rctx.fillRect(0, sy, W, 1);
      rctx.globalAlpha = 1;

      rctx.strokeStyle = "#7ff3ff";
      rctx.fillStyle = "#7ff3ff";
      rctx.shadowColor = "#38dcff";
      rctx.shadowBlur = 12;
      rctx.lineWidth = 11;
      rctx.lineCap = "round";

      var lx = Math.round(olhar.x), ly = Math.round(olhar.y);
      var eL = 80 + lx, eR = 176 + lx, ey = 72 + ly;
      var mX = 128 + Math.round(lx * 0.6), mY = 124 + Math.round(ly * 0.4);

      function olhoArco(x, r) { rctx.beginPath(); rctx.arc(x, ey + 8, r, Math.PI, 0); rctx.stroke(); }
      function olhoRedondo(x, r) { rctx.beginPath(); rctx.arc(x, ey, r, 0, Math.PI * 2); rctx.stroke(); }
      function olhoFechado(x) { rctx.beginPath(); rctx.moveTo(x - 16, ey + 3); rctx.lineTo(x + 16, ey + 3); rctx.stroke(); }
      function sorriso(r, cheio) {
        rctx.beginPath();
        rctx.arc(mX, mY - r * 0.1, r, 0.12 * Math.PI, 0.88 * Math.PI);
        if (cheio) { rctx.closePath(); rctx.fill(); }
        rctx.stroke();
      }
      function bocaO() { rctx.beginPath(); rctx.arc(mX, mY, 14, 0, Math.PI * 2); rctx.fill(); }
      function bocaFalar() {
        var a = Math.abs(Math.sin(t * 9)) * 0.7 + Math.abs(Math.sin(t * 13.7)) * 0.3;
        rctx.beginPath();
        rctx.ellipse(mX, mY, 15, 4 + 9 * a, 0, 0, Math.PI * 2);
        rctx.fill();
      }
      function bocaReta() { rctx.beginPath(); rctx.moveTo(mX - 18, mY); rctx.lineTo(mX + 18, mY + 2); rctx.stroke(); }

      var olhos;
      switch (expr) {
        case "Joy": olhos = function (x) { olhoArco(x, 22); }; sorriso(34, true); break;
        case "Wave": olhos = function (x) { olhoArco(x, 20); }; sorriso(28, false); break;
        case "Surprise": olhos = function (x) { olhoRedondo(x, 21); }; bocaO(); break;
        case "Thinking": olhos = function (x) { olhoRedondo(x, 12); }; bocaReta(); break;
        case "Empathy": olhos = function (x) { olhoArco(x, 15); }; sorriso(23, false); break;
        case "Talk": olhos = function (x) { olhoArco(x, 19); }; bocaFalar(); break;
        default: olhos = function (x) { olhoRedondo(x, 15); }; sorriso(25, false);
      }
      if (piscar.fase > 0) olhos = function (x) { olhoFechado(x); };
      olhos(eL); olhos(eR);

      rostoTex.needsUpdate = true;
    }

    /* ---------- sistema de poses (com cotovelo + cabeça) ---------- */
    var cur = {
      eX: 0.06, eY: 0, eZ: -0.16, eCX: -0.18, eCZ: 0,
      dX: 0.06, dY: 0, dZ: 0.16, dCX: -0.18, dCZ: 0,
      cX: 0, cY: 0, cZ: 0, energia: 1
    };

    function alvosPose(t) {
      var p = {
        eX: 0.06, eY: 0, eZ: -0.16, eCX: -0.18, eCZ: 0,
        dX: 0.06, dY: 0, dZ: 0.16, dCX: -0.18, dCZ: 0,
        cX: 0.02 * Math.sin(t * 0.7), cY: 0, cZ: 0.025 * Math.sin(t * 0.5),
        energia: 1
      };
      switch (anim.atual) {
        case "Wave":
          p.dX = 0.1; p.dZ = 2.45 + 0.16 * Math.sin(t * 7);
          p.dCX = -0.25; p.dCZ = 0.5 * Math.sin(t * 7 + 0.7);
          p.cX = -0.05; p.cY = -0.1; p.cZ = -0.08;
          p.energia = 1.4;
          break;
        case "Talk":
          p.dX = -0.9 + 0.14 * Math.sin(t * 3.4); p.dZ = 0.4;
          p.dCX = -1.15 + 0.24 * Math.sin(t * 3.4 + 1.2); p.dCZ = 0.12;
          p.eX = -0.15; p.eZ = -0.18; p.eCX = -1.0; p.eCZ = -0.08;
          p.cX = 0.045 * Math.sin(t * 2.6); p.cY = 0.05 * Math.sin(t * 1.3);
          p.energia = 1.15;
          break;
        case "Empathy":
          p.eX = -0.6; p.eZ = 0.75; p.eCX = -1.9; p.eCZ = 0.1;   // mão no coração
          p.dX = 0.08; p.dZ = 0.18; p.dCX = -0.5;
          p.cX = 0.09; p.cY = 0.06; p.cZ = 0.18;                 // cabeça inclinada
          break;
        case "Thinking":
          p.dX = -0.9; p.dZ = 0.35; p.dCX = -2.2; p.dCZ = 0.08;  // mão no queixo
          p.eX = -0.35; p.eZ = -0.18; p.eCX = -1.35;             // braço cruzado
          p.cX = 0.1; p.cY = 0.1; p.cZ = -0.05;
          break;
        case "Joy":
          p.eX = 0; p.eZ = -2.45; p.eCX = -0.3; p.eCZ = -0.25;
          p.dX = 0; p.dZ = 2.45; p.dCX = -0.3; p.dCZ = 0.25;
          p.cX = -0.1;
          p.energia = 2.2;
          break;
        case "Surprise":
          p.eX = -0.45; p.eZ = -1.25; p.eCX = -0.55; p.eCZ = -0.15;
          p.dX = -0.45; p.dZ = 1.25; p.dCX = -0.55; p.dCZ = 0.15;
          p.cX = 0.13;
          p.energia = 1.8;
          break;
      }
      if (atento && anim.atual === "Idle") { p.cX = 0.09; p.cY = 0.05; }
      return p;
    }

    /* ---------- interação: arrastar para girar + partes clicáveis ---------- */
    var girando = false, gx = 0, rotY = 0, rotYAlvo = 0;
    var downX = 0, downY = 0, arrastou = false;
    var raio = new T.Raycaster(), pt2 = new T.Vector2();
    var clicaveis = [];
    var ultimoBoop = 0;

    coracao.userData.acao = "coracao"; clicaveis.push(coracao);
    cranio.userData.acao = "cabeca"; clicaveis.push(cranio);
    cascoVisor.userData.acao = "cabeca"; clicaveis.push(cascoVisor);

    function ativar(acao) {
      if (acao === "coracao") {
        tocar("Joy", 2600);
        mensagem("bot", "💡 " + DICAS[dicaIdx++ % DICAS.length]);
      } else if (acao === "cabeca") {
        tocar("Surprise", 2000);
        var agoraMs = Date.now();
        if (agoraMs - ultimoBoop > 9000) {
          ultimoBoop = agoraMs;
          mensagem("bot", "Bip bop! Toque no meu coração para uma dica de saúde. 💚");
        }
      }
    }
    function raycast(ev) {
      var r = renderer.domElement.getBoundingClientRect();
      pt2.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
      pt2.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
      raio.setFromCamera(pt2, camera);
      var hits = raio.intersectObjects(clicaveis, false);
      return hits.length ? hits[0].object.userData.acao : null;
    }

    renderer.domElement.addEventListener("pointerdown", function (e) {
      girando = true; arrastou = false;
      gx = e.clientX; downX = e.clientX; downY = e.clientY;
    });
    window.addEventListener("pointermove", function (e) {
      if (girando) {
        if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 6) arrastou = true;
        rotYAlvo += (e.clientX - gx) * 0.006; gx = e.clientX;
      } else if (!painel.hidden) {
        renderer.domElement.style.cursor = raycast(e) ? "pointer" : "grab";
      }
    });
    window.addEventListener("pointerup", function (e) {
      if (girando && !arrastou) {
        var a = raycast(e);
        if (a) ativar(a);
      }
      girando = false;
    });

    /* ---------- laço principal ---------- */
    var relogio = new T.Clock();
    function loop() {
      requestAnimationFrame(loop);
      if (painel.hidden) { relogio.getDelta(); return; }
      var dt = Math.min(relogio.getDelta(), 0.05);
      simT += dt;
      var t = simT;

      if (anim.fim <= t && (anim.atual !== "Idle" || anim.fila.length)) avancar();

      /* piscar automático (com piscada dupla ocasional) */
      if (t >= piscar.prox) {
        piscar.fase = 0.13;
        piscar.prox = t + (reduzido ? 5 : 2.2) + rng() * 3.6;
        if (rng() < 0.15) piscar.prox = t + 0.34;
      }
      if (piscar.fase > 0) piscar.fase -= dt;

      /* direção do olhar por estado + vagueio no idle */
      if (anim.atual === "Thinking") { olharAlvo.x = 7; olharAlvo.y = -11; }
      else if (anim.atual === "Talk") { olharAlvo.x = 5 * Math.sin(t * 1.1); olharAlvo.y = 0; }
      else if (atento) { olharAlvo.x = 0; olharAlvo.y = 9; }
      else if (t >= olharAte) {
        if (olharAlvo.x !== 0 || olharAlvo.y !== 0) {
          olharAlvo.x = 0; olharAlvo.y = 0;
          olharAte = t + 1.8 + rng() * 4;
        } else {
          olharAlvo.x = (rng() < 0.5 ? -1 : 1) * (8 + rng() * 8);
          olharAlvo.y = (rng() - 0.5) * 8;
          olharAte = t + 0.6 + rng() * 0.7;
        }
      }
      var kO = 1 - Math.exp(-dt * 9);
      olhar.x += (olharAlvo.x - olhar.x) * kO;
      olhar.y += (olharAlvo.y - olhar.y) * kO;

      /* pose suavizada */
      var p = alvosPose(t);
      var k = 1 - Math.exp(-dt * 7);
      for (var chave in p) cur[chave] += (p[chave] - cur[chave]) * k;

      bracoE.raiz.rotation.set(cur.eX, cur.eY, cur.eZ);
      bracoE.cot.rotation.set(cur.eCX, 0, cur.eCZ);
      bracoD.raiz.rotation.set(cur.dX, cur.dY, cur.dZ);
      bracoD.cot.rotation.set(cur.dCX, 0, cur.dCZ);
      cabeca.rotation.set(cur.cX + olhar.y * 0.008, cur.cY + olhar.x * 0.01, cur.cZ);

      rotY += (rotYAlvo - rotY) * (1 - Math.exp(-dt * 8));
      robo.rotation.y = rotY;

      if (!reduzido) {
        robo.position.y = Math.sin(t * 1.7) * 0.05 * Math.min(cur.energia, 1.6);
        robo.rotation.z = Math.sin(t * 0.85) * 0.02;
        anel.scale.setScalar(1 + Math.sin(t * 2.6) * 0.07);
        anel.material.opacity = 0.65 + Math.sin(t * 2.6) * 0.25;
        motor.material.opacity = 0.4 + Math.abs(Math.sin(t * 4.4)) * 0.3;
        brilhoCoracao.material.opacity = 0.45 + Math.sin(t * 3.4) * 0.25;
        particulas.rotation.y = t * 0.06;
      }
      coracao.scale.setScalar(1.05 + Math.sin(t * 3.4) * 0.09);
      coracao.rotation.z = 0.06 * Math.sin(t * 3.4);
      brilhoCoracao.scale.setScalar(0.55 + Math.sin(t * 3.4) * 0.06);

      desenharRosto(anim.atual, t);
      renderer.render(cena, camera);
    }
    loop();

    redimensionar = function () {
      var w = palco.clientWidth, h = palco.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      /* em painel estreito, afasta a câmera para os braços não cortarem */
      var z = Math.max(4.9, 1.35 / (0.3443 * camera.aspect));
      camera.position.set(0, 0.34, z);
      camera.lookAt(0, 0.09, 0);
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", redimensionar);
  }
})();