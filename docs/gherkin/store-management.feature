Feature: Store Management
  Sebagai owner usaha
  Saya ingin bisa membuat dan mengelola profil toko saya
  Agar pelanggan dapat menemukan toko saya di halaman publik

  Background:
    Given saya sudah login sebagai owner
    And saya berada di halaman "/toko"

  Scenario: Menyimpan profil toko baru
    When saya mengisi "Nama Toko" dengan "Kopi Bu Ani"
    And slug otomatis terisi menjadi "kopi-bu-ani"
    And saya mengisi "Deskripsi Toko" dengan "Kopi berkualitas rumahan"
    And saya menekan tombol "Simpan Perubahan"
    Then saya melihat notifikasi "Toko berhasil disimpan"
    And URL toko publik tampil di bagian atas halaman

  Scenario: Slug otomatis di-generate dari nama toko
    When saya mengisi "Nama Toko" dengan "Toko Roti Manis"
    Then field "URL Toko" terisi otomatis dengan "toko-roti-manis"

  Scenario: Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung
    When saya mengisi "URL Toko" dengan "Toko Saya!!"
    Then karakter tidak valid dihapus otomatis dari slug

  Scenario: URL toko publik bisa disalin
    Given toko sudah tersimpan
    When saya menekan tombol salin URL toko
    Then URL toko tersalin ke clipboard

  Scenario: URL toko publik bisa dibuka di tab baru
    Given toko sudah tersimpan
    When saya menekan tombol buka toko
    Then tab baru terbuka dengan URL toko publik

  Scenario: Menyimpan nomor WhatsApp toko
    When saya mengisi "Nomor WhatsApp" dengan "628123456789"
    And saya menekan tombol "Simpan Perubahan"
    Then nomor WhatsApp tersimpan dan tombol WhatsApp muncul di halaman publik toko
