Feature: Reporting & Export
  Sebagai owner usaha
  Saya ingin bisa mengekspor data bisnis saya
  Agar saya bisa menganalisis data di luar platform

  Background:
    Given saya sudah login sebagai owner
    And saya berada di halaman "/laporan"

  Scenario: Halaman laporan menampilkan semua tombol export
    Then tombol "Unduh" untuk "Laporan Pesanan (CSV)" tampil
    And tombol "Unduh" untuk "Laporan Pesanan (Excel)" tampil
    And tombol "Unduh" untuk "Laporan Keuntungan (CSV)" tampil
    And tombol "Unduh" untuk "Laporan Produksi (CSV)" tampil

  Scenario: Setiap laporan menampilkan format file yang jelas
    Then "Laporan Pesanan" ditandai dengan badge "CSV"
    And "Laporan Pesanan (Excel)" ditandai dengan badge "Excel"

  Scenario: Export CSV pesanan memulai download
    When saya menekan tombol "Unduh" di "Laporan Pesanan"
    Then file CSV didownload atau tab baru terbuka dengan data pesanan

  Scenario: Export Excel pesanan memulai download
    When saya menekan tombol "Unduh" di "Laporan Pesanan (Excel)"
    Then file Excel didownload atau tab baru terbuka

  Scenario: Export laporan keuntungan
    When saya menekan tombol "Unduh" di "Laporan Keuntungan"
    Then data keuntungan per kampanye didownload dalam format CSV

  Scenario: Export laporan produksi
    When saya menekan tombol "Unduh" di "Laporan Produksi"
    Then data kebutuhan bahan baku didownload dalam format CSV
