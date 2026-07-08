Feature: Pre-Order Campaign Management
  Sebagai owner usaha
  Saya ingin bisa membuat dan mengelola periode pre-order
  Agar pelanggan bisa melakukan pemesanan dalam periode yang ditentukan

  Background:
    Given saya sudah login sebagai owner
    And sudah ada produk dengan status PUBLISHED

  Scenario: Membuat periode PO baru
    Given saya berada di halaman "/periode-po/baru"
    When saya mengisi "Nama Periode PO" dengan "PO Mingguan #1"
    And saya mengisi "Tanggal Buka" dengan besok pukul 08:00
    And saya mengisi "Tanggal Tutup" dengan 7 hari ke depan pukul 20:00
    And saya memilih produk "Kopi Susu Gula Aren"
    And saya menekan tombol "Buat Periode PO"
    Then saya diarahkan ke halaman detail kampanye
    And kampanye tersimpan dengan status "Draft"

  Scenario: Wajib pilih minimal 1 produk
    Given saya berada di halaman "/periode-po/baru"
    When saya mengisi semua field kecuali memilih produk
    And saya menekan tombol "Buat Periode PO"
    Then saya melihat error "Pilih minimal 1 produk"

  Scenario: Hanya produk PUBLISHED yang bisa dipilih
    Given ada produk dengan status DRAFT dan PUBLISHED
    When saya berada di halaman "/periode-po/baru"
    Then hanya produk PUBLISHED yang tampil dalam daftar pilihan

  Scenario: Membuka kampanye (DRAFT → OPEN)
    Given kampanye dalam status DRAFT
    When saya menekan tombol "Buka PO"
    Then status kampanye berubah menjadi "Buka"
    And badge status di detail kampanye menampilkan "Buka"

  Scenario: Menutup kampanye (OPEN → CLOSED)
    Given kampanye dalam status OPEN
    When saya menekan tombol "Tutup PO"
    Then status kampanye berubah menjadi "Tutup"
    And pelanggan tidak bisa lagi melakukan pemesanan

  Scenario: Kampanye CLOSED memunculkan tombol Lembar Produksi
    Given kampanye dalam status CLOSED atau PRODUCTION
    When saya berada di halaman detail kampanye
    Then tombol "Lihat Lembar Produksi" tampil

  Scenario: Daftar kampanye menampilkan jumlah pesanan dan produk
    Given ada kampanye dengan 5 pesanan dan 2 produk
    When saya berada di halaman "/periode-po"
    Then baris kampanye menampilkan "5 pesanan · 2 produk"

  Scenario: Pelanggan tidak bisa order saat kampanye CLOSED
    Given kampanye dalam status CLOSED
    When pelanggan mencoba mengakses form order kampanye tersebut
    Then pelanggan tidak bisa submit pesanan
