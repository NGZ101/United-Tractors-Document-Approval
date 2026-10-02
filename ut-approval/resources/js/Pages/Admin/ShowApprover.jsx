import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import '/resources/css/show.css'; 
export default function Show({approver}) {
    return (
        <div>
            <Head title={`Approver View-${approver?.nama_full}`} />
            <header className="navbar">
                <Link className="back-btn" id="backButton" href="/admin/dashboardAdmin">
                    <img src="/assets/icon/return.png" alt="return" />
                </Link>
                <div className="logo">
                    <img src="/assets/logo.png" alt="logo" />
                </div>
            </header>

            <div className="doc-container">
                <h1>Detail Approver</h1>
                <div className="doc-item">Nama Approver: {approver?.nama_full} </div>
                <div className="doc-item">Role: {approver?.role}</div>
                <div className="doc-item">Divisi: {approver?.divisi}</div>
                <div className="doc-item">Email Approver: {approver?.email}</div>
                <div className="doc-item">No. Telepon: {approver?.no_telp}</div>
            </div>
        </div>
    );
}