// =====================================================================
// TROQUE AQUI A DATA E HORA DO CASAMENTO
// Formato: 'AAAA-MM-DDTHH:MM:SS'  (ano-mês-dia T hora:minuto:segundo)
// Exemplo para 12 de agosto de 2028 às 16h30:  '2028-08-12T16:30:00'
// =====================================================================
const WEDDING_DATE = '2028-08-12T16:30:00';

// -------------------------------------------------------------------
// Menu mobile
// -------------------------------------------------------------------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('is-open');
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('is-open'));
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
// -------------------------------------------------------------------
const pixCopyBtn = document.getElementById('pixCopyBtn');
const pixKey = document.getElementById('pixKey');

pixCopyBtn?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(pixKey.textContent.trim());
    pixCopyBtn.textContent = 'Copiado!';
    setTimeout(() => { pixCopyBtn.textContent = 'Copiar chave'; }, 2000);
  } catch (err) {
    alert('Não foi possível copiar automaticamente. Copie manualmente: ' + pixKey.textContent.trim());
  }
});
