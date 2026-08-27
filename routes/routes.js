const archiveCatalog = [
  {
    type: 'ZIP',
    extension: '.zip',
    category: 'Universal',
    description: 'Format arsip paling umum untuk dokumen, software, dan bundel data kecil dan menengah.',
    strength: 'Kompatibel di banyak platform',
    bestFor: 'Pengiriman file dan dokumen umum'
  },
  {
    type: 'RAR',
    extension: '.rar',
    category: 'Compression',
    description: 'Format kompresi yang kuat dengan dukungan split archive dan enkripsi password.',
    strength: 'Rasio kompresi tinggi',
    bestFor: 'Backup besar dan file pribadi'
  },
  {
    type: '7Z',
    extension: '.7z',
    category: 'Efficiency',
    description: 'Format modern dengan rasio kompresi sangat tinggi dan keamanan enkripsi yang kuat.',
    strength: 'Efisiensi ruang paling optimal',
    bestFor: 'File besar dan arsip utama'
  },
  {
    type: 'TAR',
    extension: '.tar',
    category: 'Linux',
    description: 'Format pengemasan file Unix yang sering dipakai bersama gzip atau xz.',
    strength: 'Stabil untuk backup server',
    bestFor: 'Sistem Linux dan server'
  },
  {
    type: 'GZ',
    extension: '.gz',
    category: 'Compression',
    description: 'Format kompresi tunggal yang cepat dan ringan untuk file log atau paket distribusi.',
    strength: 'Ringan dan cepat',
    bestFor: 'File log, paket, backup singkat'
  },
  {
    type: 'ISO',
    extension: '.iso',
    category: 'Disk Image',
    description: 'Image disk yang merepresentasikan seluruh isi media optik atau sistem bootable.',
    strength: 'Bootable dan portable',
    bestFor: 'Instalasi OS dan image media'
  }
];

/**
 * @param {string} type
 * @returns {{ type: string, extension: string, category: string, description: string, strength: string, bestFor: string } | null}
 */
function getArchiveByType(type) {
  return archiveCatalog.find((item) => item.type.toLowerCase() === String(type).toLowerCase()) || null;
}

module.exports = {
  archiveCatalog,
  getArchiveByType
};
