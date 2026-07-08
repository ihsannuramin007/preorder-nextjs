Feature: Order Management
  Sebagai owner usaha
  Saya ingin bisa melihat dan mengelola semua pesanan
  Agar saya bisa memproses pesanan dengan efisien

  Background:
    Given saya sudah login sebagai owner

  Scenario: Melihat daftar semua pesanan
    Given ada pesanan masuk dari pelanggan
    When saya berada di halaman "/pesanan"
    Then daftar pesanan tampil
    And setiap pesanan menampilkan nama pelanggan, status, dan total

  Scenario: Empty state saat belum ada pesanan
    Given belum ada pesanan sama sekali
    When saya berada di halaman "/pesanan"
    Then pesan "Belum ada pesanan" tampil

  Scenario: Membuka detail pesanan
    Given ada pesanan di daftar
    When saya menekan baris pesanan
    Then saya diarahkan ke halaman detail pesanan

  Scenario: Detail pesanan menampilkan informasi lengkap
    Given saya berada di halaman detail pesanan
    Then nama pelanggan tampil
    And nomor HP pelanggan tampil
    And alamat pelanggan tampil
    And item pesanan dengan harga tampil
    And total pembayaran tampil
    And badge status pesanan tampil

  Scenario: Status flow pesanan - PAID ke PRODUCTION
    Given pesanan dalam status PAID
    When saya menekan tombol "Mulai Produksi"
    Then status berubah menjadi "Sedang Diproduksi"

  Scenario: Status flow pesanan - PRODUCTION ke READY
    Given pesanan dalam status PRODUCTION
    When saya menekan tombol "Siap Kirim"
    Then status berubah menjadi "Siap Dikirim"

  Scenario: Status flow pesanan - READY ke COMPLETED
    Given pesanan dalam status READY
    When saya menekan tombol "Selesaikan"
    Then status berubah menjadi "Selesai"
