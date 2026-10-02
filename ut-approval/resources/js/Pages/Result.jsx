import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import '/resources/css/alur.css'; 
export default function Result({message}) {

    return (
        <div>
            <Head title="Pilihan Approver" />
            <header className="navbar">
                <div className="logo">
                    <img src="/assets/logo.png" alt="logo" />
                </div>
            </header>

            <div className="list-container">
                <h1>Pilihan Approver</h1>
                <p>{message}</p>
            </div>
        </div>
    );
}