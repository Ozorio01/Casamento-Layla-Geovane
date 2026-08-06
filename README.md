# Site do meu Casamento

Site estático (HTML + CSS + JS puro, sem frameworks) pronto para editar e publicar
de graça no GitHub Pages.

## Estrutura dos arquivos

```
wedding-site/
├── index.html   → todo o conteúdo e textos do site
├── style.css    → cores, fontes e layout
├── script.js    → contagem regressiva, RSVP, botão de copiar Pix, menu mobile
└── img/         → onde ficam as fotos (você vai adicionar as suas aqui)
```

## O que trocar primeiro (nessa ordem)

1. **Nomes do casal** — `index.html`, dentro de `<h1 class="hero__names">`.
2. **Data e hora do casamento** — `script.js`, linha `const WEDDING_DATE = '...'`.
   Formato: `'AAAA-MM-DDTHH:MM:SS'`. É a partir dessa linha que a contagem
   regressiva e a data escrita no topo são calculadas automaticamente.
3. **Local da cerimônia** — `index.html`, seção `id="cerimonia"` (nome do
   espaço, cidade, horário, traje) e o link do mapa (veja abaixo).
4. **Textos da seção "Nossa história"** — `index.html`, seção `id="historia"`.
5. **Chave Pix** — `index.html`, `<p class="pix__key" id="pixKey">`.

Todos esses pontos estão marcados com comentários `<!-- TROQUE ... -->` no
HTML para facilitar achar.

## Como adicionar suas fotos

1. Coloque os arquivos de imagem dentro da pasta `img/`. Nomes sugeridos:
   `casal.jpg`, `foto1.jpg`, `foto2.jpg` ... `foto6.jpg` (já são os nomes que
   o HTML espera — assim você nem precisa editar o código, só substituir os
   arquivos).
2. Se quiser usar outros nomes de arquivo, ou mais fotos na galeria, edite
   os atributos `src="img/....jpg"` dentro de `index.html`:
   - foto do casal: seção `id="historia"`, dentro de `<div class="story__photo">`
   - galeria: seção `id="galeria"`, cada foto é um bloco `<figure class="gallery__item">`.
     Para adicionar mais fotos, copie um bloco `<figure>...</figure>` inteiro
     e cole logo abaixo, trocando o `src`.
3. Enquanto uma foto não existir, o espaço aparece com uma borda e um aviso
   de qual arquivo falta — assim fica fácil ver o que ainda precisa trocar.

Dica: fotos muito pesadas deixam o site lento. Se puder, redimensione para
no máximo ~1600px no lado maior antes de subir (ex.: no site squoosh.app).

## Como ativar o mapa do local

No Google Maps: busque o endereço → clique em **Compartilhar** →
**Incorporar um mapa** → copie o link que aparece dentro de `src="..."` →
cole no lugar do `src` do `<iframe>` na seção `id="cerimonia"` do `index.html`.

## Como receber as respostas do "Confirmar presença" de verdade

Hoje o formulário só mostra uma mensagem de agradecimento na tela — ele não
envia os dados para lugar nenhum ainda (sites 100% estáticos, como o GitHub
Pages, não têm um servidor próprio para guardar isso). Duas formas simples
e gratuitas de resolver:

**Opção A — Google Forms (mais simples)**
Crie um Google Forms com os mesmos campos, pegue o link dele e troque o
botão "Confirmar presença" do menu/hero para apontar direto para esse link,
em vez de usar o formulário embutido.

**Opção B — Formspree (mantém o formulário no seu site)**
1. Crie uma conta grátis em formspree.io e um formulário lá, você vai
   receber uma URL tipo `https://formspree.io/f/xxxxxxx`.
2. Em `script.js`, dentro do bloco `rsvpForm.addEventListener('submit', ...)`,
   descomente e ajuste as linhas de exemplo com o `fetch(...)`, usando a
   sua URL.

## Como publicar no GitHub Pages (grátis)

1. Crie uma conta no [GitHub](https://github.com) se ainda não tiver.
2. Crie um repositório novo (pode chamar, por exemplo, `nosso-casamento`).
3. Envie estes 4 arquivos (`index.html`, `style.css`, `script.js` e a pasta
   `img/`) para esse repositório. Duas formas de fazer isso:
   - **Pela interface do site**: no repositório, clique em **Add file →
     Upload files**, arraste os arquivos e a pasta, e confirme o commit.
   - **Pelo terminal**, se preferir Git:
     ```
     git init
     git add .
     git commit -m "primeiro site do casamento"
     git branch -M main
     git remote add origin https://github.com/SEU-USUARIO/nosso-casamento.git
     git push -u origin main
     ```
4. No repositório, vá em **Settings → Pages**.
5. Em "Source", selecione a branch `main` e a pasta `/ (root)`, depois
   clique em **Save**.
6. Aguarde um ou dois minutos — o GitHub vai te dar um link parecido com:
   `https://SEU-USUARIO.github.io/nosso-casamento/`

Esse link é o que você compartilha com os convidados. Toda vez que você
subir uma alteração nos arquivos, o site atualiza sozinho em alguns minutos.

## Testar localmente antes de publicar

Basta abrir o arquivo `index.html` duas vezes com o clique do mouse no seu
computador — ele abre no navegador normalmente. O contador, o menu mobile e
o botão de copiar Pix funcionam sem precisar de internet ou servidor.
