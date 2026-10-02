import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { router } from "@inertiajs/react";
import '/resources/css/login.css'; 

export default function LoginAdmin() {
    // 1. Menangkap session flash (error/success) dari Laravel
    const { flash = {} } = usePage().props;

    // 2. Setup Inertia Form Handling
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
    });

    // 3. React State pengganti script Vanilla JS untuk Show/Hide Password
    const [showPassword, setShowPassword] = useState(false);

    // 4. Fungsi untuk menangani klik Submit
    const submit = (e) => {
        e.preventDefault(); // Mencegah browser me-reload halaman
        post('/admin/loginAdmin');     // Mengirim data ke route POST /loginAdmin Laravel
    };

    return (
        <>
            <Head title="Login" />

            <div className="container">
                {/* ================= LEFT SIDE ================= */}
                <div className="left-side">
                    <div className="logo-box">
                        {/* Panggil gambar langsung dari folder public/assets */}
                        <img src="/assets/logo.png" alt="logo" />
                    </div>
                </div>

                {/* ================= RIGHT SIDE ================= */}
                <div className="right-side">
                    <div className="motto-box">
                        {/* Panggil gambar langsung dari folder public/assets */}
                        <img src="/assets/motto.png" alt="motto" />
                    </div>
                    <div className="login-card">
                        <h2>Welcome, Admin</h2>

                        {/* Menampilkan pesan error dari Laravel */}
                        {flash.error && (
                            <div className="alert-error">
                                {flash.error}
                            </div>
                        )}

                        {/* Menampilkan pesan success dari Laravel */}
                        {flash.success && (
                            <div className="alert-success">
                                {flash.success}
                            </div>
                        )}

                        {/* Form Login Inertia */}
                        <form onSubmit={submit}>
                            
                            {/* Username */}
                            <div className="input-group">
                                <input 
                                    type="text"
                                    name="username"
                                    placeholder="Admin Username"
                                    required
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                />
                                {/* Tampilkan error validasi username jika ada */}
                                {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
                            </div>

                            {/* Password */}
                            <div className="input-group password-wrapper">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Kata Sandi"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                
                                {/* Ikon Mata dinamis berdasarkan state */}
                                <i 
                                    className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-pass-login`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                            </div>

                            {/* Tombol Submit */}
                            <button 
                                type="submit" 
                                className="btn-login"
                                disabled={processing} // Tombol mati saat sedang loading
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}