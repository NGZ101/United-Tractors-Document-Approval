import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import '/resources/css/alur.css'; 
export default function Alur() {
    return (
        <div>
            <Head title="Alur" />
            <header className="navbar">
                <Link className="back-btn" id="backButton" href='/dashboard'>
                    <img src="/assets/icon/return.png" alt="return"/>
                </Link>
                <div className="logo">
                    <img src="/assets/logo.png" alt="logo" />
                </div>
            </header>

            <div className="list-container">
                <h1>Alur Approval</h1>
                <ol className="approval">
                    <li>Membuat dokumen SOP sesuai template</li>
                    <li>Finalisasi SOP dengan PIC SOP (CRM)</li>
                    <li>Mengupload dokumen tersebut ke Aplikasi</li>
                    <li>Approval Department Head</li>
                    <li>Approval Division Head</li>
                    <li>Approval PIC SOP (CRM)</li>
                    <li>Approval CRM Dept Head</li>
                    <li>SOP Completed</li>
                </ol>
            </div>
        </div>
    );
}
