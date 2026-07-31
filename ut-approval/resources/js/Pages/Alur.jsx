import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import 'D:/06-Coding Naufal/United-Tractors-Document-Approval/ut-approval/resources/css/alur.css'; 
export default function Alur() {
    return (
        <div>
            <Head title="Alur" />
            <header className="navbar">
                <Link className="back-btn" id="backButton" href='/'>
                    <img src="/assets/icon/return.png" alt="return"/>
                </Link>
                <div className="logo">
                    <img src="/assets/logo.png" alt="logo" />
                </div>
            </header>

            <div className="list-container">
                <h1>Alur Approval</h1>
                <ol className="approval">
                    <li>Membuat dokumen menurut template</li>
                    <li>Finalisasi dengan PIC</li>
                    <li>Mengupload dokumen tersebut</li>
                    <li>Menunggu approval department head</li>
                    <li>Menunggu approval division head</li>
                </ol>
            </div>
        </div>
    );
}
