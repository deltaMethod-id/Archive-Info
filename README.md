# Archive Info

Archive Info adalah website informasi arsip digital dengan tema cyberpunk merah-hitam. Situs ini berisi panduan organisasi file arsip seperti ZIP, RAR, 7Z, TAR, GZ, dan ISO untuk kebutuhan backup, kompresi, dan keamanan data.

## Fitur

- Landing page modern dan responsif
- Informasi archive format lengkap
- Perbandingan format arsip
- Dashboard status file arsip
- Error page 403 dan 404
- Siap di-deploy di Vercel atau hosting Node.js

## Jalankan lokal

```bash
npm install
npm start
```

Lalu buka:

```text
http://localhost:3000
```

## Deploy ke production

Project ini sudah dikonfigurasi untuk deployment di Vercel menggunakan `vercel.json`.

### Deploy via Vercel

1. Push repository ke GitHub.
2. Import ke Vercel.
3. Gunakan project root sebagai root folder.
4. Deploy otomatis.

## Struktur utama

- `public/pages` : file halaman HTML
- `public/styles` : styling per halaman
- `public/js` : script halaman
- `server` : server runtime
- `routes` : data route dan informasi arsip

## Tech stack

- HTML
- CSS
- JavaScript
- Node.js
