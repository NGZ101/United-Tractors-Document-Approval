import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import "D:/06-Coding Naufal/United-Tractors-Document-Approval/ut-approval/resources/css/submit.css";

export default function Submit() {
    const { data, setData, post, processing, errors } = useForm({
        judul_dokumen: "",
        divisi: "",
        divisi_email: "",
        departemen_email: "",
        file_dokumen: null,
    });

    // --- TAMBAHKAN BARIS INI ---
    console.log("Pesan Penolakan Laravel:", errors);

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault(); 
        
        // --- TAMBAHKAN BARIS INI UNTUK CEK DATA ---
        console.log("Data yang mau dikirim ke Laravel:", data);

        post("/submit", {
            forceFormData: true, 
        }); 
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
                    <h1>Submit Document</h1>

                    <div className="input-group">
                        <input
                            type="text"
                            name="judul_dokumen"
                            placeholder="Judul Dokumen"
                            required
                            value={data.judul_dokumen} // Sesuaikan nama
                            onChange={
                                (e) => setData("judul_dokumen", e.target.value) // Sesuaikan nama
                            }
                        />
                    </div>

                    <div className="input-group">
                        <select
                            className="input-field"
                            value={data.divisi}
                            onChange={(e) => setData("divisi", e.target.value)}
                            name="divisi"
                            required
                        >
                            <option value="">Pilih Divisi</option>
                            <option value="CFA">CFA</option>
                            <option value="CRA">CRA</option>
                            <option value="GLG">GLG</option>
                            <option value="DAD">DAD</option>
                            <option value="CGS">CGS</option>
                            <option value="CIST">CIST</option>
                            <option value="CHCU">CHCU</option>
                            <option value="TSO">TSO</option>
                            <option value="SOD">SOD</option>
                            <option value="TMO">TMO</option>
                            <option value="PIM">PIM</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <input
                            type="email" // Ubah jadi email agar validasi HTML jalan
                            name="divisi_email"
                            placeholder="Email Division Head"
                            required
                            value={data.divisi_email} // Sesuaikan nama
                            onChange={
                                (e) => setData("divisi_email", e.target.value) // Sesuaikan nama
                            }
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="email" // Ubah jadi email
                            name="departemen_email"
                            placeholder="Email Departemen Head"
                            required
                            value={data.departemen_email} // Sesuaikan nama
                            onChange={
                                (e) =>
                                    setData("departemen_email", e.target.value) // Sesuaikan nama
                            }
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="file"
                            name="file_dokumen"
                            placeholder="Attach Dokumen"
                            required
                            onChange={
                                (e) =>
                                    setData("file_dokumen", e.target.files[0]) // Sesuaikan nama
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