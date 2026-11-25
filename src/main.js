import Chart from 'chart.js/auto';
import './style.css';

const API_URL = 'https://www.freetogame.com/api/games';
const pageSize = 12;
let games = [];
let filteredGames = [];
let visibleCount = pageSize;
let genreChart;

const $ = (selector) => document.querySelector(selector);
const grid = $('#games-grid');
const status = $('#status-message');
const summary = $('#results-summary');
const loadMore = $('#load-more');
const dialog = $('#game-dialog');

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[char]);
}

function renderFeatured() {
  const featured = $('#featured-game');
  if (!games.length) return;
  const game = games[Math.floor(Math.random() * games.length)];
  featured.innerHTML = `<img src="${game.thumbnail}" alt="Capa de ${escapeHtml(game.title)}"><div><h2>${escapeHtml(game.title)}</h2><p>${escapeHtml(game.genre)} · ${escapeHtml(game.platform)}</p><button class="mini-link" data-game-id="${game.id}">Ver detalhes →</button></div>`;
}

function renderGames() {
  const shown = filteredGames.slice(0, visibleCount);
  grid.innerHTML = shown.map((game) => `<article class="game-card"><img src="${game.thumbnail}" alt="Capa de ${escapeHtml(game.title)}" loading="lazy"><div class="game-card-content"><div class="tags"><span>${escapeHtml(game.genre)}</span><span>${escapeHtml(game.platform === 'PC (Windows)' ? 'PC' : 'Navegador')}</span></div><h3>${escapeHtml(game.title)}</h3><p>${escapeHtml(game.short_description)}</p><button class="mini-link" data-game-id="${game.id}">Detalhes <span aria-hidden="true">→</span></button></div></article>`).join('');
  if (!shown.length) grid.innerHTML = '<p class="empty-state">Nenhum jogo encontrado. Tente outro termo ou filtro.</p>';
  summary.textContent = `${filteredGames.length} jogo${filteredGames.length === 1 ? '' : 's'} encontrado${filteredGames.length === 1 ? '' : 's'}`;
  loadMore.hidden = visibleCount >= filteredGames.length || filteredGames.length === 0;
}

function updateFilters() {
  const term = $('#search-input').value.trim().toLocaleLowerCase('pt-BR');
  const platform = $('#platform-filter').value;
  const genre = $('#genre-filter').value;
  filteredGames = games.filter((game) => (!term || `${game.title} ${game.short_description}`.toLocaleLowerCase('pt-BR').includes(term)) && (platform === 'all' || game.platform === platform) && (genre === 'all' || game.genre === genre));
  visibleCount = pageSize;
  renderGames();
}

function buildChart() {
  const counts = games.reduce((acc, game) => { acc[game.genre] = (acc[game.genre] || 0) + 1; return acc; }, {});
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 7);
  genreChart?.destroy();
  genreChart = new Chart($('#genre-chart'), { type: 'bar', data: { labels: entries.map(([name]) => name), datasets: [{ label: 'Jogos no catálogo', data: entries.map(([, count]) => count), backgroundColor: '#b8f63d', borderRadius: 8, borderSkipped: false }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0, color: '#b8c4ce' }, grid: { color: '#29333d' } }, x: { ticks: { color: '#eaf0f3' }, grid: { display: false } } } } });
}

function showDetails(id) {
  const game = games.find((item) => item.id === Number(id));
  if (!game) return;
  $('#dialog-content').innerHTML = `<img src="${game.thumbnail}" alt="Capa de ${escapeHtml(game.title)}"><div class="dialog-text"><p class="eyebrow">${escapeHtml(game.genre)} · ${escapeHtml(game.platform)}</p><h2 id="dialog-title">${escapeHtml(game.title)}</h2><p>${escapeHtml(game.short_description)}</p><p class="release">Lançamento: ${escapeHtml(game.release_date || 'não informado')} · Publicadora: ${escapeHtml(game.publisher || 'não informada')}</p><a class="button button-primary" href="${game.game_url}" target="_blank" rel="noreferrer">Acessar jogo ↗</a></div>`;
  dialog.showModal();
}

async function loadGames() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Resposta inválida da API');
    games = await response.json();
    const genres = [...new Set(games.map((game) => game.genre))].sort();
    $('#genre-filter').insertAdjacentHTML('beforeend', genres.map((genre) => `<option value="${escapeHtml(genre)}">${escapeHtml(genre)}</option>`).join(''));
    filteredGames = [...games];
    status.hidden = true;
    renderFeatured(); renderGames(); buildChart();
  } catch (error) {
    status.classList.add('error');
    status.textContent = 'Não foi possível carregar o catálogo agora. Verifique sua conexão e tente recarregar a página.';
    summary.textContent = 'Catálogo indisponível';
  }
}

$('#search-input').addEventListener('input', updateFilters);
$('#platform-filter').addEventListener('change', updateFilters);
$('#genre-filter').addEventListener('change', updateFilters);
loadMore.addEventListener('click', () => { visibleCount += pageSize; renderGames(); });
$('#random-button').addEventListener('click', renderFeatured);
document.addEventListener('click', (event) => { const button = event.target.closest('[data-game-id]'); if (button) showDetails(button.dataset.gameId); });
$('#dialog-close').addEventListener('click', () => dialog.close());
loadGames();
