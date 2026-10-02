import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import "/resources/css/edit.css";
export default function Edit() {
    const { auth } = usePage().props;
    const user = auth.user;
    const { data, setData, put, processing, errors } = useForm({
        nama_full: user.nama_full || "",
        email: user.email || "",
        username: user.username || "",
        password: "",
        password_confirmation: "", // Ditambahkan untuk syarat validasi Laravel
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const submit = (e) => {
        e.preventDefault(); // Mencegah browser me-reload halaman
        put('/profile/edit'); // Mengirim data ke route POST /login Laravel
    };
    return (
        <div>
            <Head title="Edit" />
            <header className="navbar">
                <Link className="back-btn" id="backButton" href="/profile">
                    <img src="/assets/icon/return.png" alt="return" />
                </Link>
                <div className="logo">
                    <img src="/assets/logo.png" alt="logo" />
                </div>
            </header>

            <form onSubmit={submit}>
                <div className="form-container">
                    <h1>Edit Profile</h1>
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
                            placeholder="Email"
                            required
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            required
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
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
                            placeholder="Konfirmasi Password Baru"
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
                        className="btn-update"
                        disabled={processing} // Tombol mati saat sedang loading
                    >
                        {processing ? "Memproses..." : "Update"}
                    </button>
                </div>
            </form>
        </div>
    );
}