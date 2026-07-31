import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import "D:/06-Coding Naufal/United-Tractors-Document-Approval/ut-approval/resources/css/profile.css";
export default function Profile() {
    const { auth } = usePage().props;
    const user = auth?.user;
    return (
        <div>
            <Head title="Alur" />
            <header className="navbar">
                <Link className="back-btn" id="backButton" href="/">
                    <img src="/assets/icon/return.png" alt="return" />
                </Link>
                <div className="logo">
                    <img src="/assets/logo.png" alt="logo" />
                </div>
            </header>

            <div className="list-container">
                <h1>Akun</h1>
                <div className="info-box">
                    <div class="info-item"><strong>Nama Full:</strong>{user.nama_full}</div>
                    <div class="info-item"><strong>Username:</strong> {user.username}</div>
                    <div class="info-item"><strong>Email:</strong> {user.email}</div>
                </div>
                <Link
                    href="/profile/edit"
                    className="edit-btn"
                >
                    Edit Info Akun
                </Link>
            </div>
        </div>
    );
}
