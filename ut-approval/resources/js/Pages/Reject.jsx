import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import "/resources/css/submit.css";

export default function Reject({document}) {
    const { data, setData, post, processing, errors } = useForm({
        reject_reason: "",
    });

    // --- TAMBAHKAN BARIS INI ---
    console.log("Pesan Penolakan Laravel:", errors);

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault(); 
        
        // --- TAMBAHKAN BARIS INI UNTUK CEK DATA ---
        console.log("Data yang mau dikirim ke Laravel:", data);

        post(`/approval/${document.id}/reject`, {
            forceFormData: true, 
        }); 
    };

    return (
        <div>
            <Head title="Reject Document" />
            <header className="navbar">
                <div className="logo">
                    <img src="/assets/logo.png" alt="logo" />
                </div>
            </header>

            <form onSubmit={submit}>
                <div className="form-container">
                    <h1>Reject Document</h1>

                    <div className="input-group">
                        <input
                            type="text"
                            name="reject_reason"
                            placeholder="Alasan Untuk Penolakan"
                            required
                            value={data.reject_reason} // Sesuaikan nama
                            onChange={
                                (e) => setData("reject_reason", e.target.value) // Sesuaikan nama
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-login"
                        disabled={processing}
                    >
                        {processing ? "Memproses..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
}