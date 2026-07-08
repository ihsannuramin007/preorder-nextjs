Feature: HPP Calculation
  Sebagai owner usaha
  Saya ingin HPP produk dihitung secara otomatis
  Agar saya tahu biaya produksi tanpa perhitungan manual

  Background:
    Given saya sudah login sebagai owner

  Scenario: HPP dihitung otomatis saat resep diisi
    Given produk "Kopi Susu" belum memiliki resep (HPP = 0)
    When saya menambahkan bahan ke resep produk
    Then HPP otomatis muncul di halaman resep
    And HPP tampil di daftar produk

  Scenario: Formula HPP - biaya per bahan
    Given bahan baku "Kopi Arabika" dengan harga beli Rp 50.000 untuk 100 gram
    And resep menggunakan 20 gram "Kopi Arabika"
    Then biaya bahan = 50000 / 100 × 20 = Rp 10.000

  Scenario: HPP adalah jumlah semua biaya bahan
    Given resep berisi 3 bahan dengan biaya masing-masing:
      | Bahan        | Biaya    |
      | Kopi Arabika | Rp 10.000|
      | Susu         | Rp 2.250 |
      | Gula         | Rp 500   |
    Then HPP total = Rp 12.750

  Scenario: HPP dihitung ulang saat harga bahan baku diubah
    Given produk dengan resep berisi "Kopi Arabika"
    And HPP saat ini adalah Rp 10.000
    When owner mengubah harga beli "Kopi Arabika" menjadi lebih tinggi
    And owner menyimpan perubahan
    Then HPP produk diperbarui sesuai harga baru

  Scenario: HPP tampil di daftar produk
    Given produk memiliki resep dengan bahan baku
    When saya berada di halaman "/produk"
    Then kolom HPP tampil di bawah harga jual setiap produk

  Scenario: Margin keuntungan dihitung dari HPP dan harga jual
    Given produk dengan harga jual Rp 25.000 dan HPP Rp 12.750
    When saya melihat halaman detail produk
    Then margin tampil sebagai 49.0%
