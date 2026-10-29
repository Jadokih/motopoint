/**
 * Motopoint Multimarcas — Catálogo Online
 * Dados extraídos fielmente da pasta `catalogo/` (moto1, moto2, moto3)
 */

const WHATSAPP_NUMBER = '5537988283536';

/**
 * Gera URL oficial do WhatsApp com codificação correta
 * @param {string} message
 * @returns {string}
 */
function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Mensagem personalizada para cada moto conforme especificação
 * @param {string} brandAndModel
 * @returns {string}
 */
function buildMotoWhatsAppUrl(brandAndModel) {
  const msg = `Olá! Vi a ${brandAndModel} no catálogo da Motopoint e gostaria de saber mais informações.`;
  return buildWhatsAppUrl(msg);
}

/**
 * Estoque real extraído de:
 * - catalogo/moto1/descrição.txt + Captura de tela 2026-10-29 152350.png
 * - catalogo/moto2/descricao.txt + Captura de tela 2026-10-29 152440.png
 * - catalogo/moto3/descrição.txt + Captura de tela 2026-10-29 152517.png
 */
const MOTOS_DATA = [
  {
    id: 'moto1',
    folder: 'catalogo/moto1',
    brand: 'Honda',
    model: 'Fan 160 Flex',
    brandAndModel: 'Honda Fan 160 Flex',
    year: '2019/2019',
    yearNumeric: 2019,
    displacement: '160 cc',
    mileage: '28 mil km',
    priceFormatted: 'R$ 13.900,00',
    priceNumeric: 13900,
    image: encodeURI('catalogo/moto1/Captura de tela 2026-10-29 152350.png'),
    imageAlt: 'Honda Fan 160 Flex 2019 vermelha disponível na Motopoint Multimarcas',
    features: [
      'Completa',
      'Partida elétrica',
      'Freio a disco',
      'Rodas de liga leve',
      'Combibrake',
      'Pneus novos',
      'Novíssima',
      'Apenas 28 mil km rodados',
      'Doc 2026 ok',
      'Placa Mercosul',
      'Não tem passagem por leilão nem sinistro'
    ]
  },
  {
    id: 'moto2',
    folder: 'catalogo/moto2',
    brand: 'Honda',
    model: 'Pop 110i',
    brandAndModel: 'Honda Pop 110i',
    year: '2023/2023',
    yearNumeric: 2023,
    displacement: '110 cc',
    mileage: null, // Não informado na descrição original (não inventar dados ausentes)
    priceFormatted: 'R$ 11.900,00',
    priceNumeric: 11900,
    image: encodeURI('catalogo/moto2/Captura de tela 2026-10-29 152440.png'),
    imageAlt: 'Honda Pop 110i 2023/2023 preta disponível na Motopoint Multimarcas',
    features: [
      'Praticamente único dono',
      'Manual e chave reserva',
      'Pneus ótimos',
      'Toda revisada',
      'Sem detalhes'
    ]
  },
  {
    id: 'moto3',
    folder: 'catalogo/moto3',
    brand: 'Honda',
    model: 'Bros 160 Esdd',
    brandAndModel: 'Honda Bros 160 Esdd',
    year: '2021/2021',
    yearNumeric: 2021,
    displacement: '160 cc',
    mileage: '39 mil km',
    priceFormatted: 'R$ 18.500,00',
    priceNumeric: 18500,
    image: encodeURI('catalogo/moto3/Captura de tela 2026-10-29 152517.png'),
    imageAlt: 'Honda Bros 160 Esdd 2021/2021 disponível na Motopoint Multimarcas',
    features: [
      'Completa',
      'Flex',
      'Freio a disco nas duas rodas',
      'Combibrake',
      'Pneu traseiro zero, sem uso',
      'Transmissão recém trocada',
      'Apenas 39 mil km rodados'
    ]
  }
];

/* ==========================================================================
   1. TELA DE CARREGAMENTO DE ~2 SEGUNDOS (Apenas na abertura da página)
   ========================================================================== */
function initLoaderScreen() {
  const loader = document.getElementById('loader-screen');
  if (!loader) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const durationMs = prefersReducedMotion ? 350 : 2000;

  document.body.classList.add('lock-scroll');

  window.setTimeout(() => {
    loader.classList.add('is-hidden');
    document.body.classList.remove('lock-scroll');

    window.setTimeout(() => {
      loader.setAttribute('aria-hidden', 'true');
    }, 450);
  }, durationMs);
}

/* ==========================================================================
   2. MENU MOBILE
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  if (!toggleBtn || !mainNav) return;

  function setMenuState(isOpen) {
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    mainNav.classList.toggle('is-open', isOpen);
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    setMenuState(!isExpanded);
  });

  // Fechar menu ao clicar em um link de navegação interna
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setMenuState(false);
    });
  });

  // Fechar com tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
      setMenuState(false);
      toggleBtn.focus();
    }
  });
}

/* ==========================================================================
   3. RENDERIZAÇÃO DOS CARDS E FILTROS DO CATÁLOGO
   ========================================================================== */
function createMotoCardElement(moto) {
  const article = document.createElement('article');
  article.className = 'moto-card';
  article.setAttribute('data-moto-id', moto.id);

  // Metadados disponíveis (Ano, Cilindrada, Quilometragem somente quando disponível)
  const metaPillsHtml = [
    `<span class="meta-pill"><span class="meta-pill-label">Ano:</span> ${moto.year}</span>`,
    `<span class="meta-pill"><span class="meta-pill-label">Cilindrada:</span> ${moto.displacement}</span>`,
    moto.mileage
      ? `<span class="meta-pill"><span class="meta-pill-label">Km:</span> ${moto.mileage}</span>`
      : ''
  ]
    .filter(Boolean)
    .join('');

  const waUrl = buildMotoWhatsAppUrl(moto.brandAndModel);

  article.innerHTML = `
    <div class="moto-card-media" data-open-moto="${moto.id}" role="button" tabindex="0" aria-label="Ver detalhes da ${moto.brandAndModel}">
      <img
        src="${moto.image}"
        alt="${moto.imageAlt}"
        class="moto-card-img"
        loading="lazy"
        width="865"
        height="492"
      >
      <div class="moto-card-top-badges">
        <span class="card-badge">${moto.year}</span>
        <span class="card-badge card-badge-cc">${moto.displacement}</span>
      </div>
    </div>

    <div class="moto-card-body">
      <div class="moto-card-header">
        <span class="moto-card-brand">${moto.brand}</span>
        <h3 class="moto-card-title">${moto.brand} ${moto.model}</h3>
      </div>

      <div class="moto-card-price-row">
        <span class="price-label">Valor à vista</span>
        <strong class="price-value">${moto.priceFormatted}</strong>
      </div>

      <div class="moto-meta-pills" aria-label="Especificações principais">
        ${metaPillsHtml}
      </div>

      <div class="moto-card-actions">
        <a
          href="${waUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-whatsapp btn-full"
        >
          <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 7.002c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          <span>Tenho interesse</span>
        </a>
        <button
          type="button"
          class="btn btn-secondary btn-full"
          data-open-moto="${moto.id}"
        >
          Detalhes
        </button>
      </div>
    </div>
  `;

  // Fallback visual caso alguma imagem falhe ao carregar
  const imgEl = article.querySelector('.moto-card-img');
  if (imgEl) {
    imgEl.addEventListener('error', () => {
      const mediaWrapper = article.querySelector('.moto-card-media');
      if (mediaWrapper) {
        mediaWrapper.innerHTML = `
          <div class="moto-img-fallback">
            <span>Fotografia indisponível no momento</span>
            <strong>${moto.brandAndModel}</strong>
          </div>
        `;
      }
    });
  }

  return article;
}

function normalizeText(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function initCatalogAndFilters() {
  const gridEl = document.getElementById('catalog-grid');
  const emptyStateEl = document.getElementById('empty-state');
  const countBadgeEl = document.getElementById('catalog-count');

  const searchInput = document.getElementById('search-input');
  const brandSelect = document.getElementById('filter-brand');
  const ccSelect = document.getElementById('filter-cc');
  const priceSelect = document.getElementById('filter-price');
  const sortSelect = document.getElementById('filter-sort');
  const resetBtn = document.getElementById('reset-filters-btn');
  const emptyResetBtn = document.getElementById('empty-reset-btn');

  if (!gridEl) return;

  function applyFiltersAndRender() {
    const query = normalizeText(searchInput ? searchInput.value.trim() : '');
    const selectedBrand = brandSelect ? brandSelect.value : 'all';
    const selectedCc = ccSelect ? ccSelect.value : 'all';
    const selectedPrice = priceSelect ? priceSelect.value : 'all';
    const selectedSort = sortSelect ? sortSelect.value : 'default';

    let filtered = MOTOS_DATA.filter((moto) => {
      // Filtro de busca por marca, modelo, ano ou característica
      if (query) {
        const searchableText = normalizeText(
          `${moto.brand} ${moto.model} ${moto.year} ${moto.displacement} ${moto.features.join(' ')}`
        );
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Filtro por marca
      if (selectedBrand !== 'all' && moto.brand !== selectedBrand) {
        return false;
      }

      // Filtro por cilindrada
      if (selectedCc !== 'all' && moto.displacement !== selectedCc) {
        return false;
      }

      // Filtro por faixa de preço
      if (selectedPrice === 'up-to-12000' && moto.priceNumeric > 12000) {
        return false;
      }
      if (
        selectedPrice === '12000-to-15000' &&
        (moto.priceNumeric < 12000 || moto.priceNumeric > 15000)
      ) {
        return false;
      }
      if (selectedPrice === 'above-15000' && moto.priceNumeric <= 15000) {
        return false;
      }

      return true;
    });

    // Ordenação
    if (selectedSort === 'price-asc') {
      filtered.sort((a, b) => a.priceNumeric - b.priceNumeric);
    } else if (selectedSort === 'price-desc') {
      filtered.sort((a, b) => b.priceNumeric - a.priceNumeric);
    } else if (selectedSort === 'year-desc') {
      filtered.sort((a, b) => b.yearNumeric - a.yearNumeric);
    }

    // Atualizar contador
    if (countBadgeEl) {
      if (filtered.length === 0) {
        countBadgeEl.textContent = 'Nenhuma moto encontrada';
      } else if (filtered.length === 1) {
        countBadgeEl.textContent = 'Exibindo 1 moto';
      } else {
        countBadgeEl.textContent = `Exibindo ${filtered.length} motos`;
      }
    }

    // Limpar e renderizar
    gridEl.innerHTML = '';

    if (filtered.length === 0) {
      gridEl.hidden = true;
      if (emptyStateEl) emptyStateEl.hidden = false;
    } else {
      gridEl.hidden = false;
      if (emptyStateEl) emptyStateEl.hidden = true;

      filtered.forEach((moto) => {
        gridEl.appendChild(createMotoCardElement(moto));
      });
    }
  }

  function resetAllFilters() {
    if (searchInput) searchInput.value = '';
    if (brandSelect) brandSelect.value = 'all';
    if (ccSelect) ccSelect.value = 'all';
    if (priceSelect) priceSelect.value = 'all';
    if (sortSelect) sortSelect.value = 'default';
    applyFiltersAndRender();
  }

  [searchInput, brandSelect, ccSelect, priceSelect, sortSelect].forEach((control) => {
    if (!control) return;
    control.addEventListener('input', applyFiltersAndRender);
    control.addEventListener('change', applyFiltersAndRender);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', resetAllFilters);
  }
  if (emptyResetBtn) {
    emptyResetBtn.addEventListener('click', resetAllFilters);
  }

  applyFiltersAndRender();
}

/* ==========================================================================
   4. MODAL DE DETALHES DA MOTO (<dialog> + Light-Dismiss Fallback)
   ========================================================================== */
function initMotoDetailsModal() {
  const dialog = document.getElementById('moto-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const brandEl = document.getElementById('modal-moto-brand');
  const titleEl = document.getElementById('modal-moto-title');
  const priceEl = document.getElementById('modal-moto-price');
  const imgEl = document.getElementById('modal-moto-img');
  const specsEl = document.getElementById('modal-moto-specs');
  const featuresEl = document.getElementById('modal-moto-features');
  const waBtn = document.getElementById('modal-whatsapp-btn');

  if (!dialog) return;

  function openModalForMoto(motoId) {
    const moto = MOTOS_DATA.find((item) => item.id === motoId);
    if (!moto) return;

    if (brandEl) brandEl.textContent = moto.brand;
    if (titleEl) titleEl.textContent = moto.brandAndModel;
    if (priceEl) priceEl.textContent = moto.priceFormatted;

    if (imgEl) {
      imgEl.src = moto.image;
      imgEl.alt = moto.imageAlt;
    }

    if (specsEl) {
      const specsItems = [
        { label: 'Marca', val: moto.brand },
        { label: 'Modelo', val: moto.model },
        { label: 'Ano', val: moto.year },
        { label: 'Cilindrada', val: moto.displacement }
      ];

      if (moto.mileage) {
        specsItems.push({ label: 'Quilometragem', val: moto.mileage });
      }

      specsEl.innerHTML = specsItems
        .map(
          (spec) => `
          <div class="spec-box">
            <span class="spec-box-label">${spec.label}</span>
            <strong class="spec-box-val">${spec.val}</strong>
          </div>
        `
        )
        .join('');
    }

    if (featuresEl) {
      featuresEl.innerHTML = moto.features
        .map(
          (feat) => `
          <li class="feature-item">
            <span class="feature-check" aria-hidden="true">✓</span>
            <span>${feat}</span>
          </li>
        `
        )
        .join('');
    }

    if (waBtn) {
      waBtn.href = buildMotoWhatsAppUrl(moto.brandAndModel);
    }

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  // Delegação de eventos para abrir modal a partir de qualquer botão/card com [data-open-moto]
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-moto]');
    if (!trigger) return;
    const motoId = trigger.getAttribute('data-open-moto');
    openModalForMoto(motoId);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const trigger = event.target.closest('.moto-card-media[data-open-moto]');
    if (!trigger) return;
    event.preventDefault();
    openModalForMoto(trigger.getAttribute('data-open-moto'));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      dialog.close();
    });
  }

  // Fallback para navegadores sem suporte nativo a <dialog closedby="any">
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (isDialogContent) return;
      dialog.close();
    });
  }
}

/* ==========================================================================
   INICIALIZAÇÃO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initLoaderScreen();
  initMobileMenu();
  initCatalogAndFilters();
  initMotoDetailsModal();
});

