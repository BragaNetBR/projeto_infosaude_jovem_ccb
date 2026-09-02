/* =====================================================================
HOLOMED — THREE.JS + GEMINI API (Projeto Infosaúde Jovem CCB)
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

  var animAtual = "Idle", voltaIdle = null;
  function tocar(nome, ms) {
    animAtual = nome;
    clearTimeout(voltaIdle);
    if (nome !== "Idle") voltaIdle = setTimeout(function () { animAtual = "Idle"; }, ms || 2600);
  }
  ["Idle","Wave","Talk","Empathy","Thinking","Joy","Surprise"].forEach(function (n) {
    var b = document.createElement("button");
    b.type = "button"; b.textContent = n;
    b.addEventListener("click", function () { tocar(n, 3000); });
    barra.appendChild(b);
  });

  function abrir() {
    painel.hidden = false;
    botao.setAttribute("aria-expanded", "true");
    redimensionar(); tocar("Wave", 2200);
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

  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    var texto = input.value.trim();
    if (!texto) return;
    mensagem("usuario", texto);
    input.value = "";
    tocar("Thinking", 2000);
    var loading = mensagem("bot", "Pensando…");

    var local = buscarLocal(texto);
    if (local) {
      loading.textContent = local.resposta + " (Tema: " + local.tema + ")";
      tocar("Talk", 3500);
      return;
    }

    var ia = await perguntarGemini(texto);
    if (ia) {
      loading.textContent = ia;
      tocar("Talk", 3500);
    } else {
      loading.textContent = "Não consegui responder agora. Tente de novo em instantes ou procure a UBS. " + (textos && textos.avisoEducativo ? textos.avisoEducativo : "");
      tocar("Empathy", 2600);
    }
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
    var camera = new T.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 0.35, 4.3); camera.lookAt(0, 0.05, 0);

    cena.add(new T.AmbientLight(0xffffff, 0.9));
    var dir = new T.DirectionalLight(0xffffff, 0.8); dir.position.set(2, 3, 4); cena.add(dir);
    var pt = new T.PointLight(0x4fc3f7, 0.7); pt.position.set(0, 0.5, 2.5); cena.add(pt);

    var matBranco = new T.MeshStandardMaterial({ color: 0xf4f7fa, roughness: 0.35 });
    var matHolo = new T.MeshPhysicalMaterial({ color: 0x9adcf0, transparent: true, opacity: 0.55, roughness: 0.15 });
    var matLaranja = new T.MeshStandardMaterial({ color: 0xffb74d, emissive: 0xff9800, emissiveIntensity: 0.7 });
    var matMao = new T.MeshStandardMaterial({ color: 0x607080, roughness: 0.5 });

    var robo = new T.Group(); cena.add(robo);
    var cabeca = new T.Group(); cabeca.position.y = 1.05; robo.add(cabeca);
    var cranio = new T.Mesh(new T.SphereGeometry(0.55, 48, 48), matBranco);
    cranio.scale.set(1, 0.92, 0.95); cabeca.add(cranio);

    var rostoCv = document.createElement("canvas");
    rostoCv.width = 256; rostoCv.height = 176;
    var rctx = rostoCv.getContext("2d");
    var rostoTex = new T.CanvasTexture(rostoCv);
    var visor = new T.Mesh(new T.PlaneGeometry(0.84, 0.58), new T.MeshBasicMaterial({ map: rostoTex, transparent: true }));
    visor.position.set(0, 0.02, 0.5); cabeca.add(visor);
    [-0.56, 0.56].forEach(function (x) {
      var orelha = new T.Mesh(new T.CylinderGeometry(0.15, 0.15, 0.07, 24), matLaranja);
      orelha.rotation.z = Math.PI / 2; orelha.position.set(x, 0, 0); cabeca.add(orelha);
    });

    var torso = new T.Mesh(new T.CapsuleGeometry(0.42, 0.45, 8, 24), matHolo);
    torso.position.y = 0.1; robo.add(torso);
    var fc = new T.Shape();
    fc.moveTo(0, -0.22); fc.bezierCurveTo(0.25, 0.02, 0.22, 0.28, 0, 0.12);
    fc.bezierCurveTo(-0.22, 0.28, -0.25, 0.02, 0, -0.22);
    var coracao = new T.Mesh(new T.ShapeGeometry(fc), new T.MeshBasicMaterial({ color: 0x7cfc9a }));
    coracao.position.set(0, 0.28, 0.4); robo.add(coracao);

    var quadril = new T.Mesh(new T.SphereGeometry(0.3, 32, 32), matBranco);
    quadril.scale.set(1.1, 0.7, 0.9); quadril.position.y = -0.42; robo.add(quadril);
    var cauda = new T.Mesh(new T.SphereGeometry(0.26, 32, 32), matHolo);
    cauda.scale.set(1, 1.6, 1); cauda.position.y = -0.78; robo.add(cauda);

    function braco(x) {
      var g = new T.Group(); g.position.set(x, 0.45, 0);
      g.add(new T.Mesh(new T.SphereGeometry(0.11, 20, 20), matLaranja));
      var parte = new T.Mesh(new T.CapsuleGeometry(0.09, 0.3, 4, 12), matHolo);
      parte.position.y = -0.2; g.add(parte);
      var mao = new T.Mesh(new T.SphereGeometry(0.1, 20, 20), matMao);
      mao.position.y = -0.44; g.add(mao);
      robo.add(g); return g;
    }
    var bracoE = braco(-0.52), bracoD = braco(0.52);
    var anel = new T.Mesh(new T.TorusGeometry(0.8, 0.028, 12, 60), new T.MeshBasicMaterial({ color: 0xffb74d }));
    anel.rotation.x = Math.PI / 2; anel.position.y = -1.25; cena.add(anel);

    function rr(c, x, y, w, h, r) {
      c.beginPath(); c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    }
    function desenharRosto(expr, t) {
      var W = 256, H = 176;
      rctx.clearRect(0, 0, W, H);
      rctx.fillStyle = "#041018";
      rr(rctx, 4, 4, W - 8, H - 8, 62); rctx.fill();
      rctx.strokeStyle = "#7ff3ff"; rctx.fillStyle = "#7ff3ff";
      rctx.lineWidth = 13; rctx.lineCap = "round";
      var eL = W * 0.32, eR = W * 0.68, ey = H * 0.42;
      function feliz(x) { rctx.beginPath(); rctx.arc(x, ey + 10, 24, Math.PI, 0); rctx.stroke(); }
      function redondo(x, r) { rctx.beginPath(); rctx.arc(x, ey, r || 18, 0, Math.PI * 2); rctx.stroke(); }
      function sorriso(r) { rctx.beginPath(); rctx.arc(W / 2, H * 0.58, r || 32, 0.2 * Math.PI, 0.8 * Math.PI); rctx.stroke(); }
      function bocaO() { rctx.beginPath(); rctx.arc(W / 2, H * 0.68, 14, 0, Math.PI * 2); rctx.stroke(); }
      function bocaTalk() {
        rctx.beginPath();
        rctx.ellipse(W / 2, H * 0.66, 16, 6 + 10 * Math.abs(Math.sin(t * 9)), 0, 0, Math.PI * 2);
        rctx.fill();
      }
      switch (expr) {
        case "Joy": case "Wave": case "Empathy":
          feliz(eL); feliz(eR); sorriso(expr === "Joy" ? 40 : 30); break;
        case "Surprise": redondo(eL, 22); redondo(eR, 22); bocaO(); break;
        case "Thinking":
          redondo(eL, 16); feliz(eR);
          rctx.beginPath(); rctx.arc(W / 2, H * 0.62, 12, 0.25 * Math.PI, 0.75 * Math.PI); rctx.stroke(); break;
        case "Talk": feliz(eL); feliz(eR); bocaTalk(); break;
        default: redondo(eL); redondo(eR); sorriso(28);
      }
      rostoTex.needsUpdate = true;
    }

    var cur = { eX: 0.15, eZ: 0.28, dX: 0.15, dZ: -0.28, cZ: 0, cX: 0 };
    function pose(t) {
      var a = { eX: 0.15, eZ: 0.28, dX: 0.15, dZ: -0.28, cZ: 0, cX: 0 };
      switch (animAtual) {
        case "Wave": a.dX = 0; a.dZ = -2.5 + Math.sin(t * 7) * 0.3; break;
        case "Joy": a.eX = 0; a.eZ = 2.6; a.dX = 0; a.dZ = -2.6; break;
        case "Surprise": a.eX = 0; a.eZ = 2.1; a.dX = 0; a.dZ = -2.1; break;
        case "Empathy": a.eX = -1.5; a.eZ = -0.5; a.dX = 0.3; a.dZ = -0.2; a.cX = 0.12; break;
        case "Thinking": a.dX = -1.7; a.dZ = -0.5; a.cZ = 0.16; break;
        case "Talk": a.dX = -0.8 + Math.sin(t * 6) * 0.15; a.dZ = -0.5; a.eX = -0.3; a.eZ = 0.4; break;
      }
      var k = 0.12;
      cur.eX += (a.eX - cur.eX) * k; cur.eZ += (a.eZ - cur.eZ) * k;
      cur.dX += (a.dX - cur.dX) * k; cur.dZ += (a.dZ - cur.dZ) * k;
      cur.cZ += (a.cZ - cur.cZ) * k; cur.cX += (a.cX - cur.cX) * k;
      bracoE.rotation.set(cur.eX, 0, cur.eZ);
      bracoD.rotation.set(cur.dX, 0, cur.dZ);
      cabeca.rotation.set(cur.cX, 0, cur.cZ);
    }

    var girando = false, gx = 0, rotY = 0, rotYAlvo = 0;
    renderer.domElement.addEventListener("pointerdown", function (e) { girando = true; gx = e.clientX; });
    window.addEventListener("pointermove", function (e) {
      if (!girando) return;
      rotYAlvo += (e.clientX - gx) * 0.006; gx = e.clientX;
    });
    window.addEventListener("pointerup", function () { girando = false; });

    var relogio = new T.Clock();
    function loop() {
      requestAnimationFrame(loop);
      if (painel.hidden) return;
      var t = relogio.getElapsedTime();
      desenharRosto(animAtual, t); pose(t);
      rotY += (rotYAlvo - rotY) * 0.15;
      robo.rotation.y = rotY;
      if (!reduzido) {
        robo.position.y = Math.sin(t * 1.6) * 0.06;
        anel.scale.setScalar(1 + Math.sin(t * 2.4) * 0.06);
        anel.material.opacity = 0.7 + Math.sin(t * 2.4) * 0.3;
        anel.material.transparent = true;
      }
      coracao.scale.setScalar(1 + Math.sin(t * 3.2) * 0.09);
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