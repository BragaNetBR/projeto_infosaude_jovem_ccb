/* =====================================================================
HOLOMED — ANIMAÇÕES AUTOMÁTICAS CONTEXTUAIS + VIREONIX
===================================================================== */
(function () {
  "use strict";

  var VIREONIX_MODEL = "auto";
  var VIREONIX_URL = "https://projetoinfosaudejovemccb.gb546142.workers.dev/";

  var SYSTEM_PROMPT = "Você é Jarvis, assistente virtual educativo do Projeto Infosaúde Jovem CCB (Escola Estadual Carlos de Castro Brasil, Corumbá-MS). Público: adolescentes 12-18 anos.\n\n" +
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

  /* --- Máquina de estados --- */
  var ESTADO = { IDLE: "Idle", THINKING: "Thinking", TALKING: "Talk", JOY: "Joy", EMPATHY: "Empathy", WAVE: "Wave", SURPRISE: "Surprise" };
  var estadoAtual = ESTADO.IDLE;
  var estadoAnterior = ESTADO.IDLE;
  var tempoNoEstado = 0;
  var proximoPiscar = 2 + Math.random() * 3;
  var piscando = 0; // 0 = aberto, 0..1 = fechando
  var olharAlvo = { x: 0, y: 0 };
  var olharAtual = { x: 0, y: 0 };
  var variacaoPose = Math.random() * 100; // semente pra variar poses

  function mudarEstado(novo, duracaoMs) {
    if (novo === estadoAtual && !duracaoMs) return;
    estadoAnterior = estadoAtual;
    estadoAtual = novo;
    tempoNoEstado = 0;
    variacaoPose = Math.random() * 100;
    if (duracaoMs) {
      setTimeout(function () {
        if (estadoAtual === novo) {
          estadoAtual = ESTADO.IDLE;
          variacaoPose = Math.random() * 100;
        }
      }, duracaoMs);
    }
  }

  /* --- UI --- */
  var botao = document.createElement("button");
  botao.id = "holomed-botao"; botao.type = "button";
  botao.setAttribute("aria-label", "Abrir assistente HoloMed");
  botao.setAttribute("aria-expanded", "false");
  botao.innerHTML = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M24 40C10 30 4 22 4 14a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 8-6 16-20 26Z"/></svg>';

  var painel = document.createElement("section");
  painel.id = "holomed-painel"; painel.hidden = true;
  painel.setAttribute("aria-label", "Assistente HoloMed");
  painel.innerHTML =
    '<header id="holomed-topo"><strong>Jarvis</strong><span>Assistente de IA · Infosaúde Jovem CCB</span></header>' +
    '<div id="holomed-palco"></div>' +
    '<div id="holomed-expressoes" role="group" aria-label="Debug animações"></div>' +
    '<div id="holomed-chat" aria-live="polite"></div>' +
    '<form id="holomed-form"><input id="holomed-input" type="search" placeholder="Pergunte sobre saúde…" autocomplete="off" aria-label="Pergunta"><button type="submit">Enviar</button></form>';

  document.body.appendChild(botao); document.body.appendChild(painel);

  var palco = painel.querySelector("#holomed-palco");
  var chat = painel.querySelector("#holomed-chat");
  var form = painel.querySelector("#holomed-form");
  var input = painel.querySelector("#holomed-input");
  var barra = painel.querySelector("#holomed-expressoes");

barra.style.display = "none";

  Object.keys(ESTADO).forEach(function (k) {
    var b = document.createElement("button");
    b.type = "button"; b.textContent = ESTADO[k];
    b.addEventListener("click", function () { mudarEstado(ESTADO[k], 3000); });
    barra.appendChild(b);
  });

  function abrir() {
    painel.hidden = false;
    botao.setAttribute("aria-expanded", "true");
    redimensionar();
    mudarEstado(ESTADO.WAVE, 2200);
    if (!chat.children.length) mensagem("bot", "Oi! Sou o Jarvis 💚 Pergunte sobre saúde mental, drogas, ISTs, bullying…");
    input.focus();
  }
  function fechar() {
    painel.hidden = true;
    botao.setAttribute("aria-expanded", "false");
    botao.focus();
  }
  botao.addEventListener("click", function () { painel.hidden ? abrir() : fechar(); });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && !painel.hidden) fechar(); });

  function mensagem(quem, texto) {
    var div = document.createElement("div");
    div.className = "holomed-msg " + quem;
    div.textContent = texto;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return div;
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

  async function perguntarVireonix(pergunta) {
var ctrl = new AbortController();
var t = setTimeout(function () { ctrl.abort(); }, 12000);
try {
var corpo = {
model: VIREONIX_MODEL,
messages: [
{ role: "system", content: SYSTEM_PROMPT },
{ role: "user", content: pergunta }
],
temperature: 0.2,
stream: false
};
var r = await fetch(VIREONIX_URL, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(corpo),
signal: ctrl.signal
});
clearTimeout(t);
if (!r.ok) return null;
var d = await r.json();
return (d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content) || null;
} catch (e) {
clearTimeout(t);
return null;
}
}

  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    var texto = input.value.trim();
    if (!texto) return;
    mensagem("usuario", texto);
    input.value = "";

    /* --- Pensando --- */
    mudarEstado(ESTADO.THINKING);
    var loading = mensagem("bot", "Pensando…");

    var local = buscarLocal(texto);
    if (local) {
      /* Surpresa leve ao encontrar rápido, depois falar */
      mudarEstado(ESTADO.SURPRISE, 600);
      setTimeout(function () { mudarEstado(ESTADO.TALKING, 4000); }, 600);
      loading.textContent = local.resposta + " (Tema: " + local.tema + ")";
      /* Após falar, alegria breve */
      setTimeout(function () { mudarEstado(ESTADO.JOY, 1800); }, 4600);
      return;
    }

    var ia = await perguntarVireonix(texto);
    if (ia) {
      mudarEstado(ESTADO.TALKING, Math.min(5000, ia.length * 40));
      loading.textContent = ia;
      setTimeout(function () { mudarEstado(ESTADO.JOY, 1500); }, Math.min(5000, ia.length * 40));
    } else {
      mudarEstado(ESTADO.EMPATHY, 3500);
      loading.textContent = "Não consegui responder agora. Tente de novo em instantes ou procure a UBS. " + (window.textos && textos.avisoEducativo ? textos.avisoEducativo : "");
    }
  });

  /* --- Olhar segue o mouse dentro do palco --- */
  palco.addEventListener("pointermove", function (e) {
    var rect = palco.getBoundingClientRect();
    olharAlvo.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    olharAlvo.y = ((e.clientY - rect.top) / rect.height - 0.5) * -2;
  });
  palco.addEventListener("pointerleave", function () {
    olharAlvo.x = 0; olharAlvo.y = 0;
  });

  if (window.THREE) iniciar3D(); else fallback2D();

  function fallback2D() {
    palco.innerHTML = '<div id="holomed-fallback"><svg viewBox="0 0 200 260" aria-hidden="true"><ellipse cx="100" cy="245" rx="55" ry="10" fill="none" stroke="#FFB74D" stroke-width="5" opacity="0.8"/><rect x="60" y="95" width="80" height="70" rx="26" fill="#9adcf0" opacity="0.65"/><circle cx="100" cy="55" r="45" fill="#f4f7fa"/><rect x="66" y="32" width="68" height="44" rx="20" fill="#041018"/><circle cx="86" cy="50" r="6" fill="#7ff3ff"/><circle cx="114" cy="50" r="6" fill="#7ff3ff"/><path d="M90 62 Q100 70 110 62" stroke="#7ff3ff" stroke-width="4" fill="none"/></svg></div>';
  }

  var redimensionar = function () {};
  function iniciar3D() {
    var T = window.THREE;
    var renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    palco.appendChild(renderer.domElement);

    var cena = new T.Scene();
    cena.fog = new T.FogExp2(0x0e1a24, 0.08);
    var camera = new T.PerspectiveCamera(36, 1, 0.1, 50);
    camera.position.set(0, 0.4, 5.2); camera.lookAt(0, 0.1, 0);

    cena.add(new T.AmbientLight(0x4fc3f7, 0.6));
    var dir = new T.DirectionalLight(0xffffff, 1.0); dir.position.set(3, 5, 4); cena.add(dir);
    var ptAzul = new T.PointLight(0x4fc3f7, 1.2, 6); ptAzul.position.set(-2, 1, 3); cena.add(ptAzul);
    var ptVerde = new T.PointLight(0x66bb6a, 0.8, 6); ptVerde.position.set(2, 0.5, 2); cena.add(ptVerde);
    var rim = new T.PointLight(0xffb74d, 0.6, 5); rim.position.set(0, -1, 4); cena.add(rim);

    var matBranco = new T.MeshPhysicalMaterial({ color: 0xf4f7fa, roughness: 0.2, metalness: 0.1, clearcoat: 0.5, clearcoatRoughness: 0.2 });
    var matHolo = new T.MeshPhysicalMaterial({ color: 0x4fc3f7, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.45, transmission: 0.3, emissive: 0x4fc3f7, emissiveIntensity: 0.15 });
    var matHoloInterno = new T.MeshBasicMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.15 });
    var matLaranja = new T.MeshStandardMaterial({ color: 0xffb74d, emissive: 0xffb74d, emissiveIntensity: 0.8, roughness: 0.3 });
    var matMao = new T.MeshStandardMaterial({ color: 0xf4f7fa, roughness: 0.4 });
    var matCircuito = new T.MeshBasicMaterial({ color: 0x7ff3ff, transparent: true, opacity: 0.6 });

    var robo = new T.Group(); cena.add(robo);

    var cabeca = new T.Group(); cabeca.position.y = 1.15; robo.add(cabeca);
    var cranio = new T.Mesh(new T.SphereGeometry(0.58, 64, 64), matBranco);
    cranio.scale.set(1, 0.95, 0.92); cabeca.add(cranio);

    var rostoCv = document.createElement("canvas");
    rostoCv.width = 512; rostoCv.height = 352;
    var rctx = rostoCv.getContext("2d");
    var rostoTex = new T.CanvasTexture(rostoCv);
    rostoTex.minFilter = T.LinearFilter; rostoTex.magFilter = T.LinearFilter;

    var visor = new T.Mesh(new T.PlaneGeometry(0.92, 0.62), new T.MeshBasicMaterial({ map: rostoTex, transparent: true }));
    visor.position.set(0, 0.03, 0.52); cabeca.add(visor);
    var visorGlow = new T.Mesh(new T.PlaneGeometry(1.0, 0.7), new T.MeshBasicMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.15 }));
    visorGlow.position.set(0, 0.03, 0.51); cabeca.add(visorGlow);

    [-0.58, 0.58].forEach(function (x) {
      var orelha = new T.Mesh(new T.CylinderGeometry(0.14, 0.14, 0.06, 32), matLaranja);
      orelha.rotation.z = Math.PI / 2; orelha.position.set(x, 0, 0); cabeca.add(orelha);
    });

    var torso = new T.Mesh(new T.CapsuleGeometry(0.44, 0.5, 16, 32), matHolo);
    torso.position.y = 0.15; robo.add(torso);
    var torsoInterno = new T.Mesh(new T.CapsuleGeometry(0.38, 0.45, 12, 24), matHoloInterno);
    torsoInterno.position.y = 0.15; robo.add(torsoInterno);

    var circuitos = new T.Group(); circuitos.position.y = 0.15; robo.add(circuitos);
    for (var i = 0; i < 6; i++) {
      var linha = new T.Mesh(new T.BoxGeometry(0.6, 0.012, 0.012), matCircuito);
      linha.position.y = (i - 2.5) * 0.15; linha.position.z = 0.44; circuitos.add(linha);
    }
    for (var j = 0; j < 4; j++) {
      var linhaV = new T.Mesh(new T.BoxGeometry(0.012, 0.8, 0.012), matCircuito);
      linhaV.position.x = (j - 1.5) * 0.18; linhaV.position.z = 0.44; circuitos.add(linhaV);
    }

    var coracaoGrupo = new T.Group(); coracaoGrupo.position.set(0, 0.3, 0.42); robo.add(coracaoGrupo);
    var fc = new T.Shape();
    fc.moveTo(0, -0.18); fc.bezierCurveTo(0.2, 0.02, 0.18, 0.22, 0, 0.1);
    fc.bezierCurveTo(-0.18, 0.22, -0.2, 0.02, 0, -0.18);
    var coracao = new T.Mesh(new T.ShapeGeometry(fc), new T.MeshBasicMaterial({ color: 0x66bb6a }));
    coracaoGrupo.add(coracao);
    var coracaoGlow = new T.Mesh(new T.CircleGeometry(0.14, 32), new T.MeshBasicMaterial({ color: 0x66bb6a, transparent: true, opacity: 0.4 }));
    coracaoGlow.position.z = -0.01; coracaoGrupo.add(coracaoGlow);

    var quadril = new T.Mesh(new T.SphereGeometry(0.28, 32, 32), matBranco);
    quadril.scale.set(1.1, 0.6, 0.85); quadril.position.y = -0.42; robo.add(quadril);
    var cauda = new T.Mesh(new T.ConeGeometry(0.22, 0.55, 32), matHolo);
    cauda.position.y = -0.85; cauda.rotation.x = Math.PI; robo.add(cauda);
    var caudaPonta = new T.Mesh(new T.SphereGeometry(0.1, 20, 20), matLaranja);
    caudaPonta.position.y = -1.12; robo.add(caudaPonta);

    function braco(x) {
      var g = new T.Group(); g.position.set(x, 0.5, 0);
      g.add(new T.Mesh(new T.SphereGeometry(0.1, 20, 20), matLaranja));
      var superBraco = new T.Mesh(new T.CapsuleGeometry(0.07, 0.25, 6, 16), matHolo);
      superBraco.position.y = -0.18; g.add(superBraco);
      var cotovelo = new T.Mesh(new T.SphereGeometry(0.08, 16, 16), matLaranja);
      cotovelo.position.y = -0.35; g.add(cotovelo);
      var antebraco = new T.Mesh(new T.CapsuleGeometry(0.06, 0.25, 6, 16), matHolo);
      antebraco.position.y = -0.52; g.add(antebraco);
      var mao = new T.Mesh(new T.SphereGeometry(0.09, 20, 20), matMao);
      mao.position.y = -0.72; g.add(mao);
      robo.add(g); return { grupo: g, antebraco: antebraco };
    }
    var bracoE = braco(-0.52), bracoD = braco(0.52);

    var anel = new T.Mesh(new T.TorusGeometry(0.85, 0.04, 16, 80), new T.MeshBasicMaterial({ color: 0xffb74d }));
    anel.rotation.x = Math.PI / 2; anel.position.y = -1.45; cena.add(anel);
    var anelGlow = new T.Mesh(new T.RingGeometry(0.75, 1.05, 64), new T.MeshBasicMaterial({ color: 0xffb74d, transparent: true, opacity: 0.2, side: T.DoubleSide }));
    anelGlow.rotation.x = -Math.PI / 2; anelGlow.position.y = -1.45; cena.add(anelGlow);

    var particulasGeo = new T.BufferGeometry();
    var pCount = 120;
    var posicoes = new Float32Array(pCount * 3);
    for (var p = 0; p < pCount; p++) {
      var angulo = Math.random() * Math.PI * 2;
      var raio = 1.2 + Math.random() * 0.8;
      posicoes[p * 3] = Math.cos(angulo) * raio;
      posicoes[p * 3 + 1] = (Math.random() - 0.5) * 3;
      posicoes[p * 3 + 2] = Math.sin(angulo) * raio;
    }
    particulasGeo.setAttribute("position", new T.BufferAttribute(posicoes, 3));
    var particulas = new T.Points(particulasGeo, new T.PointsMaterial({ color: 0x7ff3ff, size: 0.04, transparent: true, opacity: 0.8, sizeAttenuation: true }));
    cena.add(particulas);

    /* --- Desenho do rosto (automático: piscadas, olhar) --- */
    function rr(c, x, y, w, h, r) {
      c.beginPath(); c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r); c.closePath();
    }

    function desenharOlho(ctx, x, y, abertura, olharX, olharY, raio) {
      raio = raio || 24;
      if (abertura < 0.15) {
        /* Piscado: linha curva */
        ctx.strokeStyle = "#7ff3ff"; ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(x, y + 6, raio, Math.PI, 0);
        ctx.stroke();
        return;
      }
      /* Olho aberto: círculo + pupila que segue olhar */
      ctx.strokeStyle = "#7ff3ff"; ctx.lineWidth = 12;
      ctx.beginPath(); ctx.arc(x, y, raio * abertura, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(127, 243, 255, 0.45)";
      ctx.beginPath(); ctx.arc(x, y, raio * 0.55 * abertura, 0, Math.PI * 2); ctx.fill();
      /* Pupilas seguem olhar */
      var px = x + olharX * 6;
      var py = y + olharY * -6;
      ctx.fillStyle = "#7ff3ff";
      ctx.beginPath(); ctx.arc(px, py, raio * 0.22 * abertura, 0, Math.PI * 2); ctx.fill();
    }

    function desenharRosto(expr, t, aberturaPiscar, olhar) {
      var W = 512, H = 352;
      rctx.clearRect(0, 0, W, H);
      rctx.fillStyle = "#0a1a24";
      rr(rctx, 6, 6, W - 12, H - 12, 80); rctx.fill();

      rctx.strokeStyle = "rgba(127, 243, 255, 0.15)"; rctx.lineWidth = 1;
      for (var i = 0; i < 20; i++) {
        var yLinha = (i * 18 + (t * 40) % 18) % H;
        rctx.beginPath(); rctx.moveTo(0, yLinha); rctx.lineTo(W, yLinha); rctx.stroke();
      }

      rctx.lineCap = "round"; rctx.lineJoin = "round";
      var eL = W * 0.32, eR = W * 0.68, ey = H * 0.42;

      /* Boca */
      function sorriso(r) {
        r = r || 40;
        rctx.strokeStyle = "#7ff3ff"; rctx.lineWidth = 12;
        rctx.beginPath(); rctx.arc(W / 2, H * 0.6, r, 0.15 * Math.PI, 0.85 * Math.PI); rctx.stroke();
      }
      function bocaO() {
        rctx.strokeStyle = "#7ff3ff"; rctx.lineWidth = 12;
        rctx.beginPath(); rctx.arc(W / 2, H * 0.7, 18, 0, Math.PI * 2); rctx.stroke();
      }
      function bocaTalk() {
        rctx.fillStyle = "#7ff3ff";
        rctx.beginPath();
        var ab = 10 + 14 * Math.abs(Math.sin(t * 10));
        rctx.ellipse(W / 2, H * 0.68, 22, ab, 0, 0, Math.PI * 2); rctx.fill();
      }
      function bocaTriste() {
        rctx.strokeStyle = "#7ff3ff"; rctx.lineWidth = 10;
        rctx.beginPath();
        rctx.arc(W / 2, H * 0.72, 22, 1.15 * Math.PI, 1.85 * Math.PI);
        rctx.stroke();
      }

      var abOlho = 1 - aberturaPiscar;

      switch (expr) {
        case ESTADO.WAVE:
          desenharOlho(rctx, eL, ey, abOlho, olhar.x, olhar.y, 24);
          desenharOlho(rctx, eR, ey, abOlho, olhar.x, olhar.y, 24);
          sorriso(50); break;
        case ESTADO.JOY:
          desenharOlho(rctx, eL, ey, abOlho, olhar.x, olhar.y, 24);
          desenharOlho(rctx, eR, ey, abOlho, olhar.x, olhar.y, 24);
          sorriso(58); break;
        case ESTADO.SURPRISE:
          desenharOlho(rctx, eL, ey, abOlho, olhar.x, olhar.y, 28);
          desenharOlho(rctx, eR, ey, abOlho, olhar.x, olhar.y, 28);
          bocaO(); break;
        case ESTADO.EMPATHY:
          desenharOlho(rctx, eL, ey - 4, abOlho * 0.85, olhar.x, olhar.y, 22);
          desenharOlho(rctx, eR, ey - 4, abOlho * 0.85, olhar.x, olhar.y, 22);
          bocaTriste(); break;
        case ESTADO.THINKING:
          desenharOlho(rctx, eL, ey, abOlho * 0.8, olhar.x, olhar.y, 20);
          desenharOlho(rctx, eR, ey + 4, abOlho, olhar.x, olhar.y, 26);
          rctx.strokeStyle = "#7ff3ff"; rctx.lineWidth = 10;
          rctx.beginPath(); rctx.arc(W / 2, H * 0.64, 14, 0.25 * Math.PI, 0.75 * Math.PI); rctx.stroke();
          break;
        case ESTADO.TALKING:
          desenharOlho(rctx, eL, ey, abOlho, olhar.x, olhar.y, 24);
          desenharOlho(rctx, eR, ey, abOlho, olhar.x, olhar.y, 24);
          bocaTalk(); break;
        default: /* Idle */
          desenharOlho(rctx, eL, ey, abOlho, olhar.x, olhar.y, 22);
          desenharOlho(rctx, eR, ey, abOlho, olhar.x, olhar.y, 22);
          sorriso(34);
      }

      /* Indicador de estado (LED superior direito) */
      var corLed = "#7ff3ff";
      if (expr === ESTADO.THINKING) corLed = "#ffb74d";
      if (expr === ESTADO.TALKING) corLed = "#66bb6a";
      if (expr === ESTADO.EMPATHY) corLed = "#e5477a";
      rctx.fillStyle = corLed;
      rctx.beginPath(); rctx.arc(W - 32, 32, 10, 0, Math.PI * 2); rctx.fill();
      rctx.fillStyle = corLed + "55";
      rctx.beginPath(); rctx.arc(W - 32, 32, 16, 0, Math.PI * 2); rctx.fill();

      rostoTex.needsUpdate = true;
    }

    /* --- Poses com transições e variações naturais --- */
    var cur = {
      eX: 0.15, eZ: 0.28, dX: 0.15, dZ: -0.28,
      aE: 0, aD: 0,
      cZ: 0, cX: 0, cY: 0,
      respiracao: 0,
      torsoY: 0
    };
    var target = {
      eX: 0.15, eZ: 0.28, dX: 0.15, dZ: -0.28,
      aE: 0, aD: 0,
      cZ: 0, cX: 0, cY: 0
    };

    function atualizarTarget(t) {
      /* Base idle sempre presente (respiração + sway) */
      var sway = Math.sin(t * 0.8 + variacaoPose) * 0.04;
      var respirar = Math.sin(t * 1.4) * 0.025;
      target.eX = 0.15 + respirar;
      target.eZ = 0.28 + sway;
      target.dX = 0.15 + respirar;
      target.dZ = -0.28 - sway;
      target.aE = 0; target.aD = 0;
      target.cZ = sway * 0.3;
      target.cX = Math.sin(t * 0.6 + 1.3 + variacaoPose) * 0.04;
      target.cY = Math.sin(t * 0.5 + variacaoPose) * 0.08;

      /* Olhar segue mouse (cabeça acompanha) */
      target.cY += olharAlvo.x * 0.25;
      target.cX += olharAlvo.y * -0.15;

      /* Sobrescrita por estado */
      switch (estadoAtual) {
        case ESTADO.WAVE:
          target.dX = -0.3;
          target.dZ = -2.4 + Math.sin(t * 6) * 0.3;
          target.cY = 0.15 + olharAlvo.x * 0.2;
          target.cX = -0.08;
          break;
        case ESTADO.JOY:
          target.eX = 0.1; target.eZ = 2.7 + Math.sin(t * 4) * 0.1;
          target.dX = 0.1; target.dZ = -2.7 - Math.sin(t * 4) * 0.1;
          target.cY = Math.sin(t * 5) * 0.1;
          target.cX = -0.15;
          break;
        case ESTADO.SURPRISE:
          target.eX = 0; target.eZ = 2.2;
          target.dX = 0; target.dZ = -2.2;
          target.cX = -0.25;
          break;
        case ESTADO.EMPATHY:
          target.eX = -1.4; target.eZ = -0.4;
          target.dX = 0.3; target.dZ = -0.15;
          target.cX = 0.2;
          target.cY = 0.15;
          target.cZ = 0.08;
          break;
        case ESTADO.THINKING:
          target.dX = -1.6; target.dZ = -0.4;
          target.aD = -0.9;
          target.cZ = 0.22;
          target.cX = 0.12 + Math.sin(t * 2) * 0.03;
          target.cY = 0.25 + Math.sin(t * 1.5) * 0.1;
          break;
        case ESTADO.TALKING:
          target.dX = -0.7 + Math.sin(t * 5) * 0.15;
          target.dZ = -0.4;
          target.aD = -0.5 + Math.sin(t * 6) * 0.1;
          target.eX = -0.2; target.eZ = 0.5 + Math.sin(t * 3 + 1) * 0.1;
          target.aE = -0.3 + Math.sin(t * 4) * 0.1;
          target.cY = Math.sin(t * 3) * 0.12;
          target.cX = Math.sin(t * 2.3) * 0.05;
          break;
      }
    }

    var girando = false, gx = 0, rotY = 0, rotYAlvo = 0;
    renderer.domElement.addEventListener("pointerdown", function (e) { girando = true; gx = e.clientX; });
    window.addEventListener("pointermove", function (e) {
      if (!girando) return;
      rotYAlvo += (e.clientX - gx) * 0.006; gx = e.clientX;
    });
    window.addEventListener("pointerup", function () { girando = false; });

    var ultimoTempo = performance.now();
    function loop() {
      requestAnimationFrame(loop);
      if (painel.hidden) return;
      var agora = performance.now();
      var dt = (agora - ultimoTempo) / 1000;
      ultimoTempo = agora;
      var t = agora / 1000;

      tempoNoEstado += dt;

      /* --- Piscadas automáticas em Idle --- */
      if (estadoAtual === ESTADO.IDLE) {
        proximoPiscar -= dt;
        if (piscando > 0) {
          piscando += dt * 12;
          if (piscando >= 2) { piscando = 0; }
          else if (piscando > 1) { piscando = 2 - piscando; }
        } else if (proximoPiscar <= 0) {
          piscando = 0.01;
          proximoPiscar = 2.5 + Math.random() * 4;
        }
      } else {
        piscando = 0; /* Sem piscar em estados ativos (olhos fixos na expressão) */
      }

      /* --- Interpolação suave do olhar --- */
      olharAtual.x += (olharAlvo.x - olharAtual.x) * 0.08;
      olharAtual.y += (olharAlvo.y - olharAtual.y) * 0.08;

      atualizarTarget(t);

      var k = 0.1;
      cur.eX += (target.eX - cur.eX) * k; cur.eZ += (target.eZ - cur.eZ) * k;
      cur.dX += (target.dX - cur.dX) * k; cur.dZ += (target.dZ - cur.dZ) * k;
      cur.aE += (target.aE - cur.aE) * k; cur.aD += (target.aD - cur.aD) * k;
      cur.cZ += (target.cZ - cur.cZ) * k;
      cur.cX += (target.cX - cur.cX) * k;
      cur.cY += (target.cY - cur.cY) * k;

      bracoE.grupo.rotation.set(cur.eX, 0, cur.eZ);
      bracoE.antebraco.rotation.x = cur.aE;
      bracoD.grupo.rotation.set(cur.dX, 0, cur.dZ);
      bracoD.antebraco.rotation.x = cur.aD;
      cabeca.rotation.set(cur.cX, cur.cY, cur.cZ);

      desenharRosto(estadoAtual, t, piscando, olharAtual);

      rotY += (rotYAlvo - rotY) * 0.12;
      robo.rotation.y = rotY;

      if (!reduzido) {
        robo.position.y = Math.sin(t * 1.4) * 0.08;
        anel.scale.setScalar(1 + Math.sin(t * 2.2) * 0.05);
        anelGlow.material.opacity = 0.15 + Math.sin(t * 2.2) * 0.08;
        var pulso = 1 + Math.sin(t * 3.5) * 0.12;
        coracao.scale.set(pulso, pulso, 1);
        coracaoGlow.scale.set(pulso, pulso, 1);
        coracaoGlow.material.opacity = 0.2 + Math.sin(t * 3.5) * 0.2;
        matCircuito.opacity = 0.4 + Math.sin(t * 3 + Math.PI) * 0.3;
        particulas.rotation.y = t * 0.15;
        var posArr = particulas.geometry.attributes.position.array;
        for (var i = 0; i < pCount; i++) {
          posArr[i * 3 + 1] += 0.003;
          if (posArr[i * 3 + 1] > 2) posArr[i * 3 + 1] = -2;
        }
        particulas.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(cena, camera);
    }
    loop();

    redimensionar = function () {
      var w = palco.clientWidth, h = palco.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", redimensionar);
  }
})();