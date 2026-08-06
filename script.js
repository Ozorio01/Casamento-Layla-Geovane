// =====================================================================
// TROQUE AQUI A DATA E HORA DO CASAMENTO
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

// Data legível no topo
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

// RSVP Form
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');

rsvpForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  rsvpForm.hidden = true;
  rsvpSuccess.hidden = false;
});

// Copiar chave Pix
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
    if (pixCopyStatus) pixCopyStatus.textContent = 'Chave Pix copiada com sucesso!';
  } else if (manualFallback) {
    if (pixCopyStatus) {
      pixCopyStatus.textContent = `Copie manualmente: ${pixKey.textContent.trim()}`;
    }
    return;
  }

  setTimeout(() => {
    pixCopyBtn.classList.remove('is-copied');
    pixCopyLabel.textContent = 'Copiar chave Pix';
    if (pixCopyStatus) pixCopyStatus.textContent = '';
  }, 2200);
}

// Filtro de presentes por categoria
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
// SISTEMA COMPLETO DE CARRINHO E CHECKOUT
// =====================================================================
let cart = [];

const cartModal = document.getElementById('cartModal');
const paymentModal = document.getElementById('paymentModal');
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalValue = document.getElementById('cartTotalValue');

// Abertura e Fechamento dos Modais
document.getElementById('openCartBtn')?.addEventListener('click', () => cartModal.removeAttribute('hidden'));
document.getElementById('closeCartBtn')?.addEventListener('click', () => cartModal.setAttribute('hidden', 'true'));
document.getElementById('closeCartOverlay')?.addEventListener('click', () => cartModal.setAttribute('hidden', 'true'));
document.getElementById('keepShoppingBtn')?.addEventListener('click', () => cartModal.setAttribute('hidden', 'true'));

document.getElementById('closePaymentBtn')?.addEventListener('click', () => paymentModal.setAttribute('hidden', 'true'));
document.getElementById('closePaymentOverlay')?.addEventListener('click', () => paymentModal.setAttribute('hidden', 'true'));
document.getElementById('backToCartBtn')?.addEventListener('click', () => {
  paymentModal.setAttribute('hidden', 'true');
  cartModal.removeAttribute('hidden');
});

// Adicionar item ao carrinho
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const id = btn.getAttribute('data-id');
    const title = btn.getAttribute('data-title');
    const price = parseFloat(btn.getAttribute('data-price'));

    cart.push({ id, title, price });
    updateCartUI();
    cartModal.removeAttribute('hidden');
  });
});

// Atualiza a visualização do carrinho
function updateCartUI() {
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
      <button class="cart-item__remove" onclick="removeFromCart(${index})">Remover</button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  cartTotalValue.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartUI();
};

// Gerador de Mensagens por IA (Simulado)
const aiMessages = [
  "Layla e Eduardo, que a vida a dois seja sempre repleta de fé, amor e muitas alegrias!",
  "Que felicidade celebrar esse momento com vocês! Que o lar de vocês seja abençoado e cheio de paz.",
  "Desejo toda a felicidade do mundo nessa nova caminhada! Que nunca falte amor e companheirismo.",
  "Um brinde ao amor de vocês! Que este seja apenas o começo da história mais linda das suas vidas."
];

document.getElementById('aiGenerateBtn')?.addEventListener('click', () => {
  const randomMsg = aiMessages[Math.floor(Math.random() * aiMessages.length)];
  const msgInput = document.getElementById('guestMessage');
  if (msgInput) msgInput.value = randomMsg;
});

// Botão "Finalizar Compra" -> Abre Modal de Pagamento
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
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

  cartModal.setAttribute('hidden', 'true');
  paymentModal.removeAttribute('hidden');
});

// Pagar via Pix dentro do Modal
document.getElementById('payPixModalBtn')?.addEventListener('click', () => {
  const pixKey = "19971706455";
  navigator.clipboard.writeText(pixKey);
  alert(`Chave Pix (${pixKey}) copiada com sucesso! Transfira o valor do presente pelo aplicativo do seu banco.`);
  paymentModal.setAttribute('hidden', 'true');
});
