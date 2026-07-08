Feature: Dashboard & Profit Dashboard
  Sebagai owner usaha
  Saya ingin melihat kondisi bisnis saya saat ini
  Agar saya bisa mengambil keputusan berdasarkan data

  Background:
    Given saya sudah login sebagai owner
    And toko sudah dibuat

  # --- Dashboard ---

  Scenario: Dashboard menampilkan semua widget metrik
    When saya berada di halaman "/dashboard"
    Then widget "Periode PO Aktif" tampil
    And widget "Menunggu Pembayaran" tampil
    And widget "Perlu Verifikasi" tampil
    And widget "Pesanan Hari Ini" tampil

  Scenario: Widget menampilkan angka yang akurat
    Given ada 2 kampanye OPEN, 5 pesanan PENDING_PAYMENT, 3 pesanan PAYMENT_REVIEW
    When saya berada di halaman "/dashboard"
    Then widget "Periode PO Aktif" menampilkan angka 2
    And widget "Menunggu Pembayaran" menampilkan angka 5
    And widget "Perlu Verifikasi" menampilkan angka 3

  Scenario: Dashboard menampilkan ringkasan keuangan
    When saya berada di halaman "/dashboard"
    Then "Total Pendapatan" tampil
    And "Total HPP" tampil
    And "Estimasi Keuntungan" tampil

  Scenario: Dashboard menampilkan 5 pesanan terbaru
    Given ada lebih dari 5 pesanan
    When saya berada di halaman "/dashboard"
    Then maksimal 5 pesanan terbaru tampil

  Scenario: Redirect ke setup toko jika toko belum dibuat
    Given owner belum membuat toko
    When saya berada di halaman "/dashboard"
    Then pesan "Selamat datang di POHub!" tampil
    And tombol "Buat Toko Sekarang" tersedia

  # --- Profit Dashboard ---

  Scenario: Halaman profit menampilkan metrik keuntungan
    When saya berada di halaman "/keuntungan"
    Then "Pendapatan" tampil
    And "Total HPP" tampil
    And "Estimasi Keuntungan" tampil
    And "Margin Keuntungan" tampil

  Scenario: Formula profit - Profit = Revenue - HPP
    Given total pendapatan Rp 1.000.000 dan total HPP Rp 600.000
    When saya melihat dashboard profit
    Then estimasi keuntungan tampil sebagai Rp 400.000
