Feature: Public Store Page
  Sebagai pelanggan
  Saya ingin bisa mengakses halaman toko tanpa perlu login
  Agar saya bisa melihat produk dan melakukan pemesanan

  Background:
    Given ada toko dengan slug "kopi-bu-ani" yang sudah aktif

  Scenario: Halaman toko dapat diakses tanpa login
    When saya mengakses "/kopi-bu-ani" sebagai pengunjung
    Then halaman toko tampil dengan benar
    And saya tidak perlu login untuk melihatnya

  Scenario: Nama dan deskripsi toko tampil di halaman publik
    Given toko memiliki nama "Kopi Bu Ani" dan deskripsi "Kopi rumahan terbaik"
    When saya mengakses halaman publik toko
    Then nama "Kopi Bu Ani" tampil di halaman
    And deskripsi "Kopi rumahan terbaik" tampil di halaman

  Scenario: Hanya kampanye OPEN yang tampil di halaman publik
    Given ada kampanye OPEN "PO Mingguan #1" dan DRAFT "PO Mingguan #2"
    When saya mengakses halaman publik toko
    Then "PO Mingguan #1" tampil dengan tombol "Pesan Sekarang"
    And "PO Mingguan #2" tidak tampil

  Scenario: Tombol WhatsApp tampil jika nomor diisi
    Given toko memiliki nomor WhatsApp "628123456789"
    When saya mengakses halaman publik toko
    Then tombol WhatsApp tampil
    And link mengarah ke "https://wa.me/628123456789"

  Scenario: Tombol Instagram tampil jika URL diisi
    Given toko memiliki Instagram "@kopibani"
    When saya mengakses halaman publik toko
    Then tombol Instagram tampil
    And link mengarah ke "https://instagram.com/kopibani"

  Scenario: Toko yang tidak ada menampilkan halaman 404
    When saya mengakses "/toko-yang-tidak-ada-xyz"
    Then saya melihat halaman 404

  Scenario: Daftar produk tampil di halaman publik
    Given toko memiliki 3 produk PUBLISHED
    When saya mengakses halaman publik toko
    Then 3 produk tampil dengan nama dan harga masing-masing
