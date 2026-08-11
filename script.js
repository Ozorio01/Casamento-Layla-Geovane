// =====================================================================
// DATA E HORA DO CASAMENTO
// Corrigido: agora bate com o "17h00" mostrado no HTML (antes estava 16:30).
// =====================================================================
const WEDDING_DATE = '2028-09-30T17:00:00';

// E-mail que recebe as notificações do FormSubmit (RSVP e presentes).
// Troque em UM lugar só se precisar mudar — os dois formulários usam esta constante.
const NOTIFY_EMAIL = 'ozorio2305@gmail.com';

// Menu Mobile
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

// =====================================================================
// CONTAGEM REGRESSIVA
// Quando a data chega, esconde os números e mostra "É hoje!" em vez de
// ficar travado em 00:00:00:00.
// =====================================================================
const countdownEl = document.getElementById('countdown');
const countdownToday = document.getElementById('countdownToday');

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
    if (countdownEl) countdownEl.hidden = true;
    if (countdownToday) countdownToday.hidden = false;
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

// Data formatada no topo
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

// =====================================================================
// RSVP — envia via FormSubmit (sem precisar de backend)
// Lembre-se de clicar no link de confirmação que chega no seu e-mail na
// primeira vez que alguém enviar o formulário.
// =====================================================================
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');

rsvpForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitBtn = rsvpForm.querySelector('.rsvp__submit');
  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    const formData = new FormData(rsvpForm);
    const response = await fetch(rsvpForm.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData
    });

    if (!response.ok) throw new Error('Falha no envio');

    rsvpForm.hidden = true;
    rsvpSuccess.hidden = false;
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
    alert('Não foi possível enviar sua confirmação agora. Tente novamente em instantes ou chame a gente direto pelo WhatsApp.');
  }
});

// =====================================================================
// COPIAR CHAVE PIX (card "Livre Escolha")
// =====================================================================
const pixCopyBtn = document.getElementById('pixCopyBtn');
const pixKeyEl = document.getElementById('pixKey');
const pixCopyLabel = pixCopyBtn?.querySelector('.pix__copy-label');
const pixCopyStatus = document.getElementById('pixCopyStatus');

pixCopyBtn?.addEventListener('click', async () => {
  const key = pixKeyEl.textContent.trim();
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
    if (pixCopyStatus) pixCopyStatus.textContent = 'Chave Pix copiada com sucesso!';
  } else if (manualFallback) {
    if (pixCopyStatus) {
      pixCopyStatus.textContent = `Copie manualmente: ${pixKeyEl.textContent.trim()}`;
    }
    return;
  }

  setTimeout(() => {
    pixCopyBtn.classList.remove('is-copied');
    pixCopyLabel.textContent = 'Copiar chave Pix';
    if (pixCopyStatus) pixCopyStatus.textContent = '';
  }, 2200);
}

// Filtro de Categorias
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

// =====================================================================
// SISTEMA DE CARRINHO E CHECKOUT
// =====================================================================
const CART_STORAGE_KEY = 'casamento-layla-geovane-cart';

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    // localStorage indisponível (modo privado, navegador antigo, etc.)
    // O carrinho continua funcionando nesta sessão, só não persiste.
  }
}

// Carrinho carregado do localStorage, se já houver algo salvo de uma visita anterior.
let cart = loadCart();

const cartModal = document.getElementById('cartModal');
const paymentModal = document.getElementById('paymentModal');
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalValue = document.getElementById('cartTotalValue');

// ---------------------------------------------------------------------
// Acessibilidade dos modais: Esc fecha, Tab fica preso dentro do modal.
// ---------------------------------------------------------------------
function getFocusable(container) {
  return Array.from(
    container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')
  ).filter((el) => el.offsetParent !== null);
}

function openModal(modal) {
  modal.removeAttribute('hidden');
  const focusable = getFocusable(modal.querySelector('[role="dialog"]') || modal);
  if (focusable.length) focusable[0].focus();
}

function closeModal(modal) {
  modal.setAttribute('hidden', 'true');
}

function setupModalA11y(modalEl, contentSelector, closeFn) {
  const content = modalEl.querySelector(contentSelector);
  modalEl.addEventListener('keydown', (event) => {
    if (modalEl.hasAttribute('hidden')) return;
    if (event.key === 'Escape') {
      closeFn();
      return;
    }
    if (event.key === 'Tab' && content) {
      const focusable = getFocusable(content);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

setupModalA11y(cartModal, '.cart-modal__content', () => closeModal(cartModal));
setupModalA11y(paymentModal, '.payment-modal__content', () => closeModal(paymentModal));

// Controles dos Modais
document.getElementById('openCartBtn')?.addEventListener('click', () => openModal(cartModal));
document.getElementById('closeCartBtn')?.addEventListener('click', () => closeModal(cartModal));
document.getElementById('closeCartOverlay')?.addEventListener('click', () => closeModal(cartModal));
document.getElementById('keepShoppingBtn')?.addEventListener('click', () => closeModal(cartModal));

document.getElementById('closePaymentBtn')?.addEventListener('click', () => closeModal(paymentModal));
document.getElementById('closePaymentOverlay')?.addEventListener('click', () => closeModal(paymentModal));
document.getElementById('backToCartBtn')?.addEventListener('click', () => {
  closeModal(paymentModal);
  openModal(cartModal);
});

// Adicionar Item ao Carrinho (Captura o evento nos botões com classe .add-to-cart-btn)
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const id = btn.getAttribute('data-id');
    const title = btn.getAttribute('data-title');
    const price = parseFloat(btn.getAttribute('data-price'));

    cart.push({ id, title, price });
    updateCartUI();
    openModal(cartModal);
  });
});

// Renderizar itens do carrinho
function updateCartUI() {
  saveCart();

  if (cartCount) cartCount.textContent = cart.length;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Seu carrinho está vazio.</p>';
    cartTotalValue.textContent = 'R$ 0,00';
    return;
  }

  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div class="cart-item__info">
        <strong>${item.title}</strong>
        <span>R$ ${item.price.toFixed(2).replace('.', ',')}</span>
      </div>
      <button type="button" class="cart-item__remove" onclick="removeFromCart(${index})">Remover</button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  cartTotalValue.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Preenche o carrinho salvo assim que a página carrega.
updateCartUI();

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartUI();
};

// Gerador de Mensagem por IA
const aiMessages = [
  "Layla e Geovane, que a vida a dois seja sempre repleta de fé, amor e muitas alegrias!",
  "Que felicidade celebrar esse momento com vocês! Que o lar de vocês seja abençoado e cheio de paz.",
  "Desejo toda a felicidade do mundo nessa nova caminhada! Que nunca falte amor e companheirismo.",
  "Um brinde ao amor de vocês! Que este seja apenas o começo da história mais linda das suas vidas."
];

document.getElementById('aiGenerateBtn')?.addEventListener('click', () => {
  const randomMsg = aiMessages[Math.floor(Math.random() * aiMessages.length)];
  const msgInput = document.getElementById('guestMessage');
  if (msgInput) msgInput.value = randomMsg;
});

// =====================================================================
// FINALIZAR COMPRA
// Antes: só abria a tela de pagamento e os dados do convidado (nome,
// presentes escolhidos, mensagem) se perdiam. Agora envia tudo via
// FormSubmit para o mesmo e-mail do RSVP, para vocês saberem quem
// presenteou e com o quê.
// =====================================================================
const checkoutBtn = document.getElementById('checkoutBtn');
const GIFT_NOTIFY_ENDPOINT = `https://formsubmit.co/ajax/${NOTIFY_EMAIL}`;

checkoutBtn?.addEventListener('click', async () => {
  if (cart.length === 0) {
    alert('Por favor, adicione ao menos um presente ao carrinho antes de continuar.');
    return;
  }
  const nameInput = document.getElementById('guestName');
  if (!nameInput || !nameInput.value.trim()) {
    alert('Por favor, insira o seu nome antes de prosseguir.');
    nameInput.focus();
    return;
  }

  const originalLabel = checkoutBtn.textContent;
  checkoutBtn.disabled = true;
  checkoutBtn.textContent = 'Registrando...';

  const messageInput = document.getElementById('guestMessage');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const itemsList = cart.map((item) => `${item.title} (R$ ${item.price.toFixed(2).replace('.', ',')})`).join(' | ');

  const payload = {
    _subject: 'Novo presente escolhido — Casamento Layla & Geovane',
    _template: 'table',
    nome: nameInput.value.trim(),
    presentes_escolhidos: itemsList,
    total: `R$ ${total.toFixed(2).replace('.', ',')}`,
    mensagem: messageInput?.value.trim() || '(sem mensagem)'
  };

  try {
    const response = await fetch(GIFT_NOTIFY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Falha no envio');
  } catch (err) {
    // Mesmo se a notificação falhar, deixamos o convidado seguir para o
    // pagamento — só avisamos para ele confirmar com vocês por outro canal.
    alert('Não foi possível registrar seu presente automaticamente. Você ainda pode pagar normalmente, mas por favor nos avise pelo WhatsApp para garantirmos o registro.');
  } finally {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = originalLabel;
  }

  closeModal(cartModal);
  openModal(paymentModal);
});

// Pagamento via Pix no Modal — lê a chave direto do DOM em vez de
// repetir o número aqui (evita os dois lugares ficarem dessincronizados).
document.getElementById('payPixModalBtn')?.addEventListener('click', () => {
  const pixKeyValue = pixKeyEl.textContent.trim();
  navigator.clipboard.writeText(pixKeyValue);
  alert(`Chave Pix (${pixKeyValue}) copiada com sucesso! Transfira o valor do presente pelo aplicativo do seu banco.`);
  closeModal(paymentModal);
});
