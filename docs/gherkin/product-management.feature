Feature: Product Management
  Sebagai owner usaha
  Saya ingin bisa mengelola produk yang saya jual
  Agar produk tersedia dalam kampanye pre-order

  Background:
    Given saya sudah login sebagai owner

  # --- Membuat Produk ---

  Scenario: Membuat produk baru (wizard 3 langkah)
    Given saya berada di halaman "/produk/baru"
    When saya mengisi "Nama Produk" dengan "Kopi Susu Gula Aren"
    And saya mengisi "Deskripsi" dengan "Kopi susu segar dengan gula aren pilihan"
    And saya memilih "Kategori" dengan "Beverage"
    And saya menekan tombol "Lanjut"
    And saya menekan tombol "Lanjut" lagi (melewati varian)
    And saya mengisi "Harga Jual" dengan "25000"
    And saya menekan tombol "Buat Produk"
    Then saya diarahkan ke halaman resep produk
    And produk tersimpan dengan status "Draft"

  Scenario: Produk baru selalu tersimpan sebagai DRAFT
    Given saya membuat produk baru dengan data valid
    When saya menekan "Buat Produk"
    Then produk baru muncul di daftar produk dengan badge "Draft"

  Scenario: Menambah varian pada produk
    Given saya berada di halaman "/produk/baru" di langkah 2 (Varian)
    When saya menekan tombol "Tambah Varian"
    And saya mengisi nama varian "250ml" dengan selisih harga "0"
    And saya menekan tombol "Tambah Varian" lagi
    And saya mengisi nama varian "500ml" dengan selisih harga "5000"
    Then dua varian tampil dalam daftar

  Scenario: Menerbitkan produk dari Draft ke Published
    Given saya berada di halaman detail produk dengan status DRAFT
    When saya menekan tombol "Terbitkan"
    Then badge status produk berubah menjadi "Terbit"
    And produk tampil di halaman toko publik

  Scenario: Mengarsipkan produk Published
    Given saya berada di halaman detail produk dengan status PUBLISHED
    When saya menekan tombol "Arsipkan"
    Then badge status produk berubah menjadi "Arsip"
    And produk tidak tampil di halaman toko publik

  Scenario: Produk DRAFT tidak tampil di halaman toko publik
    Given ada produk dengan status DRAFT
    When pelanggan mengakses halaman publik toko
    Then produk DRAFT tidak terlihat

  Scenario: Daftar produk menampilkan badge status
    Given ada produk dengan berbagai status (Draft, Terbit, Arsip)
    When saya berada di halaman "/produk"
    Then setiap produk menampilkan badge status yang sesuai

  Scenario: Menghapus produk dengan konfirmasi
    Given saya berada di halaman detail produk
    When saya menekan tombol "Hapus Produk"
    Then modal konfirmasi hapus muncul
    When saya menekan tombol "Hapus" di modal
    Then produk dihapus dan saya diarahkan ke "/produk"
