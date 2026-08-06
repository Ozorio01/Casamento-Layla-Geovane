// =====================================================================
// TROQUE AQUI A DATA E HORA DO CASAMENTO
// Formato: 'AAAA-MM-DDTHH:MM:SS'  (ano-mês-dia T hora:minuto:segundo)
// Exemplo para 12 de agosto de 2028 às 16h30:  '2028-08-12T16:30:00'
// =====================================================================
const WEDDING_DATE = '2028-09-30T16:30:00';

// -------------------------------------------------------------------
// Menu mobile
// -------------------------------------------------------------------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// -------------------------------------------------------------------
// Contagem regressiva
// -------------------------------------------------------------------
function updateCountdown() {
  const target = new Date(WEDDING_DATE).getTime();
  const now = Date.now();
  const diff = target - now;

  const elDias = document.getElementById('cd-dias');
  const elHoras = document.getElementById('cd-horas');
  const elMin = document.getElementById('cd-min');
  const elSeg = document.getElementById('cd-seg');

  if (!elDias) return;

  if (diff <= 0) {
    elDias.textContent = '00';
    elHoras.textContent = '00';
    elMin.textContent = '00';
    elSeg.textContent = '00';
    return;
  }

  const pad = (n) => String(n).padStart(2, '0');

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const min = Math.floor((diff / (1000 * 60)) % 60);
  const seg = Math.floor((diff / 1000) % 60);

  elDias.textContent = pad(dias);
  elHoras.textContent = pad(horas);
  elMin.textContent = pad(min);
  elSeg.textContent = pad(seg);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// -------------------------------------------------------------------
// Data legível no topo (opcional: gerada a partir de WEDDING_DATE)
// Se preferir escrever a data manualmente, edite direto o texto no
// HTML (id="weddingDateLabel") e apague este bloco.
// -------------------------------------------------------------------
const dateLabel = document.getElementById('weddingDateLabel');
if (dateLabel) {
  const d = new Date(WEDDING_DATE);
  if (!isNaN(d)) {
    const formatted = d.toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
    const hora = d.toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit'
    });
    dateLabel.textContent = `${formatted} · ${hora}`;
  }
}

// -------------------------------------------------------------------
// RSVP — por padrão só mostra confirmação na tela.
// Para receber de verdade, veja o README.md (Google Forms ou Formspree)
// e troque o bloco abaixo pelo envio real.
// -------------------------------------------------------------------
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');

rsvpForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  // Exemplo de como pegar os dados, caso queira enviar para um serviço:
  // const data = new FormData(rsvpForm);
  // fetch('https://formspree.io/f/SEU_ID', { method: 'POST', body: data, headers: { Accept: 'application/json' } });

  rsvpForm.hidden = true;
  rsvpSuccess.hidden = false;
});

// -------------------------------------------------------------------
// Copiar chave Pix
// Correção: antes o código sobrescrevia o textContent do botão inteiro,
// o que apagava o ícone SVG na primeira vez que era clicado. Agora o
// texto é trocado só dentro do <span class="pix__copy-label">, e um
// status separado (com aria-live) avisa leitores de tela.
// -------------------------------------------------------------------
const pixCopyBtn = document.getElementById('pixCopyBtn');
const pixKey = document.getElementById('pixKey');
const pixCopyLabel = pixCopyBtn?.querySelector('.pix__copy-label');
const pixCopyStatus = document.getElementById('pixCopyStatus');

pixCopyBtn?.addEventListener('click', async () => {
  const key = pixKey.textContent.trim();

  try {
    await navigator.clipboard.writeText(key);
    setCopiedState(true);
  } catch (err) {
    setCopiedState(false, true);
  }
});

function setCopiedState(success, manualFallback = false) {
  if (!pixCopyLabel) return;

  if (success) {
    pixCopyBtn.classList.add('is-copied');
    pixCopyLabel.textContent = 'Chave copiada!';
    if (pixCopyStatus) pixCopyStatus.textContent = 'Chave Pix copiada para a área de transferência.';
  } else if (manualFallback) {
    if (pixCopyStatus) {
      pixCopyStatus.textContent = `Não foi possível copiar automaticamente. Chave: ${pixKey.textContent.trim()}`;
    }
    return;
  }

  setTimeout(() => {
    pixCopyBtn.classList.remove('is-copied');
    pixCopyLabel.textContent = 'Copiar chave Pix';
    if (pixCopyStatus) pixCopyStatus.textContent = '';
  }, 2200);
}

// -------------------------------------------------------------------
// Filtro de presentes por categoria
// -------------------------------------------------------------------
const giftFilters = document.getElementById('giftFilters');
const giftCards = document.querySelectorAll('.gift__card');

giftFilters?.addEventListener('click', (event) => {
  const btn = event.target.closest('.gifts__filter');
  if (!btn) return;

  const filter = btn.dataset.filter;

  giftFilters.querySelectorAll('.gifts__filter').forEach((f) => {
    f.classList.remove('is-active');
    f.setAttribute('aria-selected', 'false');
  });
  btn.classList.add('is-active');
  btn.setAttribute('aria-selected', 'true');

  giftCards.forEach((card) => {
    const matches = filter === 'todos' || card.dataset.category === filter;
    card.classList.toggle('gift__card--hidden', !matches);
  });
});
