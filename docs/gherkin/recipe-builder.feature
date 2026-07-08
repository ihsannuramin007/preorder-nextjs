Feature: Recipe Builder
  Sebagai owner usaha
  Saya ingin bisa membuat resep produk dari bahan baku
  Agar HPP produk dihitung secara otomatis

  Background:
    Given saya sudah login sebagai owner
    And sudah ada bahan baku di sistem

  Scenario: Menambahkan bahan baku ke resep produk
    Given saya berada di halaman resep produk "/produk/{id}/resep"
    When saya memilih bahan "Kopi Arabika" dari dropdown
    And saya mengisi jumlah "20"
    And saya menekan tombol "Tambah"
    Then "Kopi Arabika - 20 gram" muncul dalam daftar resep
    And nilai HPP diperbarui

  Scenario: HPP dihitung dari semua bahan dalam resep
    Given resep produk berisi:
      | Bahan        | Qty | Harga Beli | Qty Beli |
      | Kopi Arabika | 20  | 50000      | 100      |
      | Susu         | 150 | 15000      | 1000     |
    Then HPP produk = (50000/100 × 20) + (15000/1000 × 150) = Rp 12.250

  Scenario: Menghapus bahan dari resep
    Given resep produk sudah berisi "Kopi Arabika"
    When saya menekan tombol hapus di baris "Kopi Arabika"
    Then "Kopi Arabika" hilang dari daftar resep
    And HPP dihitung ulang tanpa bahan tersebut

  Scenario: Bahan baku yang sudah ditambahkan tidak muncul di dropdown
    Given "Kopi Arabika" sudah ada di resep
    When saya membuka dropdown pilih bahan
    Then "Kopi Arabika" tidak tersedia untuk dipilih lagi

  Scenario: Satu bahan baku bisa digunakan di banyak resep
    Given bahan baku "Gula" sudah ada di sistem
    When saya menambahkan "Gula" ke resep produk A
    And saya menambahkan "Gula" ke resep produk B
    Then kedua produk memiliki "Gula" dalam resepnya
