import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import "/resources/css/profile.css";
export default function ProfileAdmin() {
    const { auth } = usePage().props;
    const admin = auth?.admin;
    return (
        <div>
            <Head title="Alur" />
            <header className="navbar">
                <Link className="back-btn" id="backButton" href="/admin/dashboardAdmin">
                    <img src="/assets/icon/return.png" alt="return" />
                </Link>
                <div className="logo">
                    <img src="/assets/logo.png" alt="logo" />
                </div>
            </header>

            <div className="list-container">
                <h1>Akun</h1>
                <div className="info-box">
                    <div class="info-item"><strong>Nama Full:</strong>{admin?.nama_full}</div>
                    <div class="info-item"><strong>Username:</strong> {admin?.username}</div>
                    <div class="info-item"><strong>Email:</strong> {admin?.email}</div>
                </div>
                <Link
                    href="/admin/profileAdmin/editAdmin"
                    className="edit-btn"
                >
                    Edit Info Akun
                </Link>
            </div>
        </div>
    );
}