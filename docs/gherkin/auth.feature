Feature: Authentication
  Sebagai owner usaha
  Saya ingin bisa mendaftar dan masuk ke akun POHub
  Agar saya dapat mengelola toko dan pre-order saya

  Background:
    Given saya berada di halaman beranda POHub

  # --- Register ---

  Scenario: Daftar akun baru dengan data valid
    Given saya berada di halaman "/daftar"
    When saya mengisi "Nama Bisnis" dengan "Kopi Bu Ani Test"
    And saya mengisi "Email" dengan "test-register@pohub.app"
    And saya mengisi "Password" dengan "password123"
    And saya menekan tombol "Daftar Sekarang"
    Then saya melihat pesan konfirmasi untuk cek email

  Scenario: Daftar dengan email yang sudah terdaftar
    Given saya berada di halaman "/daftar"
    When saya mengisi "Email" dengan email yang sudah terdaftar
    And saya mengisi form dengan data valid lainnya
    And saya menekan tombol "Daftar Sekarang"
    Then saya melihat notifikasi error "email sudah digunakan"

  Scenario: Daftar dengan password kurang dari 8 karakter
    Given saya berada di halaman "/daftar"
    When saya mengisi "Password" dengan "abc123"
    And saya menekan tombol "Daftar Sekarang"
    Then saya melihat pesan validasi password minimal 8 karakter

  # --- Login ---

  Scenario: Login dengan kredensial valid
    Given saya berada di halaman "/masuk"
    When saya mengisi "Email" dengan email yang terdaftar
    And saya mengisi "Password" dengan password yang benar
    And saya menekan tombol "Masuk"
    Then saya diarahkan ke halaman "/dashboard"

  Scenario: Login dengan email tidak terdaftar
    Given saya berada di halaman "/masuk"
    When saya mengisi "Email" dengan "tidakada@email.com"
    And saya mengisi "Password" dengan "password123"
    And saya menekan tombol "Masuk"
    Then saya melihat notifikasi error login

  Scenario: Login dengan password salah
    Given saya berada di halaman "/masuk"
    When saya mengisi "Email" dengan email yang terdaftar
    And saya mengisi "Password" dengan "passwordsalah"
    And saya menekan tombol "Masuk"
    Then saya melihat notifikasi error login

  Scenario: Halaman login memiliki semua elemen UI yang diperlukan
    Given saya berada di halaman "/masuk"
    Then saya melihat input Email
    And saya melihat input Password
    And saya melihat tombol "Masuk"
    And saya melihat tombol "Masuk dengan Google"
    And saya melihat link "Lupa password?"
    And saya melihat link "Daftar gratis"

  Scenario: Navigasi dari halaman login ke daftar
    Given saya berada di halaman "/masuk"
    When saya menekan link "Daftar gratis"
    Then saya diarahkan ke halaman "/daftar"

  # --- Forgot Password ---

  Scenario: Meminta reset password
    Given saya berada di halaman "/lupa-password"
    When saya mengisi "Email" dengan email yang terdaftar
    And saya menekan tombol kirim
    Then saya melihat pesan konfirmasi email reset dikirim
