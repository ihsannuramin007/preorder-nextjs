Feature: Production Planning
  Sebagai owner usaha
  Saya ingin sistem menghasilkan lembar produksi otomatis
  Agar saya tahu kebutuhan bahan baku untuk semua pesanan

  Background:
    Given saya sudah login sebagai owner
    And ada kampanye dengan pesanan yang sudah PAID
    And produk dalam kampanye memiliki resep bahan baku

  Scenario: Lembar produksi tersedia saat kampanye CLOSED
    Given kampanye dalam status CLOSED
    When saya berada di halaman detail kampanye
    Then tombol "Lihat Lembar Produksi" tampil

  Scenario: Mengakses halaman lembar produksi
    Given kampanye CLOSED atau PRODUCTION
    When saya menekan "Lihat Lembar Produksi"
    Then saya diarahkan ke "/periode-po/{id}/produksi"

  Scenario: Generate lembar produksi
    Given halaman produksi kosong
    When saya menekan tombol "Generate"
    Then tabel kebutuhan bahan baku dihitung dan tampil

  Scenario: Lembar produksi menampilkan total bahan yang dibutuhkan
    Given kampanye memiliki pesanan:
      | Pesanan | Produk       | Qty |
      | P001    | Kopi Susu    | 10  |
      | P002    | Kopi Susu    | 5   |
    And resep "Kopi Susu" menggunakan 20g Kopi Arabika
    When lembar produksi di-generate
    Then tabel menampilkan "Kopi Arabika: 300 gram" (15 × 20)

  Scenario: Lembar produksi menampilkan estimasi biaya bahan
    Given lembar produksi sudah di-generate
    When saya melihat tabel bahan
    Then setiap bahan menampilkan:
      | Bahan | Jumlah | Est. Biaya |
    And total biaya bahan tampil di bagian bawah

  Scenario: Hanya pesanan PAID yang dihitung dalam lembar produksi
    Given ada pesanan PENDING_PAYMENT dan PAID dalam kampanye
    When lembar produksi di-generate
    Then hanya kuantitas dari pesanan PAID yang dihitung
