import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import "/resources/css/register.css";
export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        nama_full: "",
        email: "",
        username: "",
        password: "",
        password_confirmation: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const submit = (e) => {
        e.preventDefault(); // Mencegah browser me-reload halaman
        post("/register", {
            onError: (errors) => {
                if (errors.email) {
                    setData("email", ""); // Kosongkan field email jika ada error
                }
                if (errors.username) {
                    setData("username", ""); // Kosongkan field username jika ada error
                }
            }
        }); // Mengirim data ke route POST /login Laravel
    };
    return (
        <div>
            <Head title="Register" />
            <header className="navbar">
                <Link className="back-btn" id="backButton" href="/">
                    <img src="/assets/icon/return.png" alt="return" />
                </Link>
                <div className="logo">
                    <img src="/assets/logo.png" alt="logo" />
                </div>
            </header>

            <form onSubmit={submit}>
                <div className="form-container">
                    <h1>Register</h1>
                    <div class="input-group">
                        <input
                            type="text"
                            name="Nama Lengkap"
                            placeholder="Nama Lengkap"
                            required
                            value={data.nama_full}
                            onChange={(e) =>
                                setData("nama_full", e.target.value)
                            }
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            name="Email"
                            required
                            value={data.email}
                            onChange={(e) => {
                                setData("email", e.target.value);
                                clearErrors('email');
                            }}
                            placeholder={errors.email ? errors.email : "Email"}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="username"
                            required
                            value={data.username}
                            onChange={(e) => {
                                setData("username", e.target.value);
                                clearErrors('username');
                            }}
                            placeholder={errors.username ? errors.username : "Username"}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password (Minimal 8 Karakter)"
                            required
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <i
                            className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-pass-login`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>
                    <div className="input-group">
                        <input
                            type={showPasswordConfirm ? "text" : "password"}
                            name="password_confirmation"
                            placeholder="Konfirmasi Password (Minimal 8 Karakter)"
                            required
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                        />
                        <i
                            className={`fa ${showPasswordConfirm ? "fa-eye-slash" : "fa-eye"} toggle-pass-login`}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                setShowPasswordConfirm(!showPasswordConfirm)
                            }
                        ></i>
                    </div>
                    <button
                        type="submit"
                        className="btn-login"
                        disabled={processing} // Tombol mati saat sedang loading
                    >
                        {processing ? "Memproses..." : "Register"}
                    </button>
                </div>
            </form>
        </div>
    );
}
