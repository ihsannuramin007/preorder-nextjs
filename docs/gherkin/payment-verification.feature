Feature: Payment Verification
  Sebagai owner usaha
  Saya ingin bisa memverifikasi pembayaran dari pelanggan
  Agar pesanan dapat diproses setelah pembayaran dikonfirmasi

  Background:
    Given saya sudah login sebagai owner
    And ada pesanan dengan status "PAYMENT_REVIEW"
    And saya berada di halaman detail pesanan tersebut

  Scenario: Bagian verifikasi pembayaran tampil saat status PAYMENT_REVIEW
    Then kartu verifikasi pembayaran tampil
    And tombol "Setujui" tersedia
    And tombol "Tolak" tersedia

  Scenario: Melihat bukti pembayaran yang diupload
    Given pelanggan sudah upload bukti pembayaran
    When saya menekan tombol "Lihat Bukti Pembayaran"
    Then gambar atau file bukti pembayaran tampil

  Scenario: Menyetujui pembayaran
    When saya menekan tombol "Setujui"
    Then status pesanan berubah menjadi "Lunas"
    And bagian verifikasi pembayaran tidak tampil lagi
    And tombol status berikutnya ("Mulai Produksi") tersedia

  Scenario: Menolak pembayaran dengan alasan
    When saya menekan tombol "Tolak"
    Then modal tolak pembayaran muncul
    And ada field "Alasan Penolakan"
    When saya mengisi alasan "Jumlah transfer tidak sesuai"
    And saya menekan tombol "Tolak Pembayaran" di modal
    Then status pesanan berubah kembali
    And alasan penolakan tampil di halaman detail pesanan

  Scenario: Alasan penolakan wajib diisi
    When saya menekan tombol "Tolak"
    And modal tolak muncul
    And saya menekan "Tolak Pembayaran" tanpa mengisi alasan
    Then saya melihat notifikasi error "Masukkan alasan penolakan"
    And pesanan tidak berubah status

  Scenario: Bagian verifikasi tidak tampil jika status bukan PAYMENT_REVIEW
    Given pesanan dalam status PENDING_PAYMENT
    When saya melihat detail pesanan tersebut
    Then kartu verifikasi pembayaran tidak tampil
