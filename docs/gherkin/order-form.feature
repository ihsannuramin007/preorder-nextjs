Feature: Order Form (Pelanggan)
  Sebagai pelanggan
  Saya ingin bisa melakukan pemesanan produk pre-order
  Tanpa harus mendaftar akun

  Background:
    Given ada kampanye OPEN di toko "kopi-bu-ani"
    And kampanye memiliki produk dengan varian tersedia

  Scenario: Form order menampilkan semua field yang diperlukan
    Given saya berada di halaman form order
    Then saya melihat input "Nama Lengkap"
    And saya melihat input "Nomor HP / WhatsApp"
    And saya melihat textarea "Alamat Lengkap"
    And saya melihat input "Catatan"
    And saya melihat tombol kurangi qty untuk setiap varian
    And saya melihat tombol tambah qty untuk setiap varian
    And saya melihat tombol "Kirim Pesanan"

  Scenario: Menambah quantity produk
    Given saya berada di halaman form order
    When saya menekan tombol + untuk varian "250ml"
    Then qty varian "250ml" bertambah menjadi 1

  Scenario: Mengurangi quantity produk
    Given qty varian "250ml" saat ini adalah 2
    When saya menekan tombol - untuk varian "250ml"
    Then qty varian "250ml" berkurang menjadi 1
    And tidak bisa dikurangi di bawah 0

  Scenario: Total pembayaran dihitung otomatis
    Given varian "250ml" memiliki harga Rp 25.000
    When saya menambah qty "250ml" menjadi 2
    And saya menambah qty "500ml" (Rp 30.000) menjadi 1
    Then total tampil sebagai Rp 80.000

  Scenario: Validasi - wajib pilih minimal 1 produk
    Given semua qty masih 0
    When saya menekan tombol "Kirim Pesanan"
    Then saya melihat error "Pilih minimal 1 produk"
    And pesanan tidak terkirim

  Scenario: Validasi - nama, telepon, alamat wajib diisi
    Given saya sudah memilih 1 produk
    When saya menekan "Kirim Pesanan" tanpa mengisi nama
    Then validasi form mencegah submit

  Scenario: Pesanan berhasil dikirim
    Given saya mengisi semua data customer dengan benar
    And saya memilih minimal 1 produk
    When saya menekan tombol "Kirim Pesanan"
    Then saya diarahkan ke halaman sukses
    And nomor pesanan tampil di halaman sukses

  Scenario: Halaman sukses menampilkan nomor pesanan
    Given pesanan berhasil dibuat dengan nomor "PO-20240101-001"
    When saya berada di halaman sukses
    Then "PO-20240101-001" tampil di halaman
