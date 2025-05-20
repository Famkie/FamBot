# `commands/lotto/` - KieBot Lotto Command Suite

**Folder ini berisi semua command yang berkaitan dengan sistem lotre (lotto) di KieBot.**  
Lotto adalah salah satu fitur utama KieBot yang memungkinkan pengguna mengadakan undian berhadiah secara interaktif di Discord, dengan dukungan command hybrid (prefix `!` dan slash `/`).

## Fitur Utama

- Hybrid command (`!` dan `/`) untuk fleksibilitas tinggi
- Dukungan berbagai mode lotre: Ping, No Ping, Quick, Karma, Additive, Faction Only
- Sistem Karma yang memberi penghargaan pada partisipasi positif
- Kompatibel dengan Torn API untuk integrasi send line otomatis
- Sistem leaderboard dan statistik lengkap (karma, minigame, total lotto)
- Kontrol penuh untuk host: edit hadiah, countdown, auto draw, dan lainnya

## Struktur dan Penjelasan Command

### 1. Start a Lotto

- **Command**: `!sl`, `/startlotto`
- **Parameter Wajib**: `prize:<prize>`, `base:<ping|noping|quick>`
- **Opsi Tambahan**:
  - `added:true` â†’ Lotto Additive (prize bertambah per entry)
  - `karma:true` â†’ Lotto Karma (bisa beli entry tambahan)
  - `faction:true` â†’ Lotto khusus anggota faksi

**Contoh**:
```
/startlotto prize:500k base:ping karma:true added:true
!sl 500k
```

### 2. Lotto Varian Khusus

| Varian           | Alias         | Keterangan                           |
|------------------|---------------|--------------------------------------|
| No Ping          | `!slnp`       | Lotto tanpa ping                     |
| Karma            | `!slk`        | Lotto dengan sistem karma            |
| Additive         | `!sla`        | Prize bertambah tiap entry           |
| Karma + Additive | `!slak`       | Kombinasi karma & additive           |
| Quick            | `!slq`        | Lotto cepat (20 detik) tanpa ping    |
| Faction Only     | `!slf`        | Lotto khusus anggota faction         |

### 3. Partisipasi & Kontrol

| Fungsi              | Command       | Keterangan                           |
|---------------------|---------------|--------------------------------------|
| Join Lotto          | `!j`, `/join` | Bergabung dengan lotto               |
| Buy Entry (Karma)   | `!buy`        | Beli entry tambahan di lotto karma   |
| Replay Lotto        | `!rl`, `/replay` | Jalankan ulang lotto sebelumnya  |
| Multiprize          | `!multiprize` | Tentukan jumlah send line            |
| Edit Prize          | `!editprize`  | Ubah prize selama lotto berlangsung  |
| Manual Send Line    | `!manualsend` | Matikan auto send line dari API      |
| Last Call           | `!lastcall`   | Reminder ping peserta                |
| Auto Draw           | `!autodraw`   | Atur waktu draw otomatis             |
| Auto CD by Entry    | `!autocd`     | Draw otomatis saat cukup peserta     |
| Countdown           | `!cd`         | Countdown 15 detik lalu draw         |
| Draw Now            | `!draw`       | Draw sekarang juga                   |
| GG (Congratulate)   | `!gg`         | Memberi selamat dan memberi karma    |
| Thank Runner        | `!ty`         | Ucapan terima kasih dari pemenang    |
| Unlock Lotto        | `!unlock`     | Membuka kembali lotto terkunci       |
| Lock Minigame       | `!minilock`   | Cegah user lain menjalankan minigame |

### 4. Statistik & Leaderboard

| Fungsi             | Command       | Deskripsi                            |
|--------------------|---------------|--------------------------------------|
| Cek Status Lotto   | `!chk`, `/check` | Info detail lotto berjalan        |
| Lotto Total        | `!total`      | Total prize dan karma                |
| Karma Info         | `!karma`      | Lihat karma user                     |
| Last Winner        | `!lastlotto`  | Lihat pemenang terakhir              |
| Top 5 Leaderboard  | `!top`        | Top 5 leaderboard                    |
| Top 10 Leaderboard | `!topten`     | Sama seperti `!top` tapi 10 besar    |

### 5. Preferensi User (Opt In / Out)

| Fungsi           | Command          | Penjelasan                           |
|------------------|------------------|--------------------------------------|
| Ping Opt In      | `!pingoptin`     | Aktifkan ping saat lotto dimulai     |
| Ping Opt Out     | `!pingoptout`    | Nonaktifkan ping                     |
| Karma Opt In     | `!karmaoptin`    | Aktifkan fitur karma                 |
| Karma Opt Out    | `!karmaoptout`   | Nonaktifkan fitur karma              |

### 6. Torn API Integration

| Fungsi            | Command       | Keterangan                           |
|-------------------|---------------|--------------------------------------|
| Tambah API        | `/api`        | Tambah API key untuk auto send line  |
| Hapus API         | `/api remove` | Hapus API key                        |
| Info API          | `/api info`   | Info sistem API                      |
| Penggunaan API    | `!api`        | Statistik penggunaan API             |

## Contoh Penggunaan Cepat

```
!sl 1m                 # Lotto ping biasa
!slk 500k             # Lotto karma
/startlotto prize:2m base:noping karma:true
!sla 250k             # Lotto additive
!buy 3                # Beli 3 entry tambahan
!draw                 # Draw pemenang sekarang
!top                  # Lihat leaderboard
```

## Catatan Developer

- Semua command berada di file terpisah per fungsi
- Handler otomatis mendaftarkan command
- Slash command auto deploy saat bot dijalankan
- Menggunakan .env untuk menyimpan token dan API key
