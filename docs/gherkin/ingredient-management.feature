Feature: Ingredient Management
  Sebagai owner usaha
  Saya ingin bisa mengelola bahan baku
  Agar HPP produk dapat dihitung secara otomatis

  Background:
    Given saya sudah login sebagai owner

  Scenario: Menambah bahan baku baru
    Given saya berada di halaman "/bahan-baku/baru"
    When saya mengisi "Nama Bahan" dengan "Kopi Arabika"
    And saya memilih "Satuan" dengan "gram"
    And saya mengisi "Jumlah Pembelian" dengan "100"
    And saya mengisi "Harga Pembelian" dengan "50000"
    And saya menekan tombol "Simpan Bahan Baku"
    Then saya diarahkan ke "/bahan-baku"
    And bahan baku "Kopi Arabika" muncul di daftar

  Scenario: Satuan yang tersedia sesuai PRD
    Given saya berada di halaman "/bahan-baku/baru"
    When saya membuka dropdown "Satuan"
    Then pilihan yang tersedia adalah: gram, kilogram, ml, liter, pcs, pack

  Scenario: Cost per unit otomatis dihitung
    Given ada bahan baku "Kopi Arabika" dengan harga beli Rp 50.000 untuk 100 gram
    When saya melihat detail bahan baku tersebut
    Then cost per unit tertera sebagai Rp 500 per gram

  Scenario: Mengedit bahan baku
    Given saya berada di halaman edit bahan baku yang sudah ada
    When saya mengubah "Harga Pembelian" menjadi "60000"
    And saya menekan tombol "Simpan Perubahan"
    Then perubahan tersimpan dan HPP produk terkait dihitung ulang

  Scenario: Menghapus bahan baku dengan konfirmasi
    Given saya berada di halaman edit bahan baku
    When saya menekan tombol hapus (ikon sampah)
    Then modal konfirmasi muncul dengan peringatan data akan hilang permanen
    When saya menekan "Hapus" di modal konfirmasi
    Then bahan baku dihapus dan saya diarahkan ke "/bahan-baku"

  Scenario: Bahan baku yang dihapus tidak muncul lagi
    Given saya baru menghapus bahan baku "Kopi Arabika"
    When saya berada di halaman "/bahan-baku"
    Then "Kopi Arabika" tidak ada dalam daftar
