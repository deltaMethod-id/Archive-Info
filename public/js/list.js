const archives = [
  {
    name: 'ZIP',
    extension: '.zip',
    category: 'universal',
    description: 'Format universal untuk dokumen, aplikasi, dan distribusi data lintas platform.',
    best: 'Pengiriman file cepat',
    strength: 'Kompatibilitas tinggi'
  },
  {
    name: 'RAR',
    extension: '.rar',
    category: 'compression',
    description: 'Format kompresi kuat dengan split archive dan encryption password yang aman.',
    best: 'Backup dan arsip pribadi',
    strength: 'Rasio kompresi tinggi'
  },
  {
    name: '7Z',
    extension: '.7z',
    category: 'compression',
    description: 'Format modern dengan rasio kompresi paling efisien untuk file besar dan backup kritis.',
    best: 'File besar dan backup utama',
    strength: 'Efisiensi ruang terbaik'
  },
  {
    name: 'TAR',
    extension: '.tar',
    category: 'linux',
    description: 'Paket file Unix dan Linux yang sering dipakai bersama gzip atau xz untuk archive server.',
    best: 'Server dan sistem operasi',
    strength: 'Stabil untuk backup'
  },
  {
    name: 'GZ',
    extension: '.gz',
    category: 'compression',
    description: 'Kompresi ringan untuk file tunggal, log, dan paket distribusi yang cepat dan efisien.',
    best: 'Log dan file sistem',
    strength: 'Ringan dan cepat'
  },
  {
    name: 'ISO',
    extension: '.iso',
    category: 'disk',
    description: 'Image disk untuk OS, installer, game, dan media bootable yang siap dipindahkan.',
    best: 'Instalasi dan media distribusi',
    strength: 'Bootable dan portabel'
  }
];

const container = document.getElementById('archive-list');
const filterButtons = document.querySelectorAll('.filter-btn');

function renderArchives(filter = 'all') {
  if (!container) return;

  const filtered = filter === 'all'
    ? archives
    : archives.filter((item) => item.category === filter);

  container.innerHTML = filtered.map((item) => `
    <article class="archive-item">
      <div class="archive-topline">
        <span class="archive-badge">${item.extension}</span>
        <span class="archive-type">${item.category}</span>
      </div>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="meta-row">
        <span><strong>Best for:</strong> ${item.best}</span>
        <span><strong>Strength:</strong> ${item.strength}</span>
      </div>
    </article>
  `).join('');
}

if (container) {
  renderArchives();

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      renderArchives(button.dataset.filter);
    });
  });
}
