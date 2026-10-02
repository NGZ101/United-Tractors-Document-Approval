import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import "/resources/css/submit.css";

export default function EditApprover({ approver }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        nama_full: approver?.nama_full || "",
        divisi: approver?.divisi || "",
        role: approver?.role || "",
        email: approver?.email || "",
        no_telp: approver?.no_telp || "",
        ttd_img: null,
    });

    console.log("Pesan Penolakan Laravel:", errors);

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault(); 
        
        console.log("Data yang mau dikirim ke Laravel:", data);

        post(`/admin/approvers/${approver.id}/edit`, {
            forceFormData: true,
            onError: (errors) => {
                if (errors.email) {
                    setData("email", "");
                }
            } 
        }); 
    };

    return (
        <div>
            <Head title="Edit Approver" />
            <header className="navbar">
                <Link className="back-btn" id="backButton" href="/admin/dashboardAdmin">
                    <img src="/assets/icon/return.png" alt="return" />
                </Link>
                <div className="logo">
                    <img src="/assets/logo.png" alt="logo" />
                </div>
            </header>

            <form onSubmit={submit}>
                <div className="form-container">
                    <h1>Edit Approver</h1>

                    <div className="input-group">
                        <input
                            type="text"
                            name="nama_full"
                            placeholder="Nama Approver"
                            required
                            value={data.nama_full} // Sesuaikan nama
                            onChange={
                                (e) => setData("nama_full", e.target.value) // Sesuaikan nama
                            }
                        />
                    </div>

                    <div className="input-group">
                        <select
                            className="input-field"
                            value={data.role}
                            onChange={(e) => setData("role", e.target.value)}
                            name="role"
                            required
                        >
                            <option value="">Pilih Role</option>
                            <option value="dept_head">Departemen Head</option>
                            <option value="div_head">Divisi Head</option>
                            <option value="sop_pic">SOP PIC</option>
                            <option value="sop_head">SOP HEAD</option>
                        </select>
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
                            name="email"
                            required
                            value={data.email} // Sesuaikan nama
                            onChange={
                                (e) => setData("email", e.target.value) // Sesuaikan nama
                            }
                            placeholder={errors.email ? errors.email : "Email"}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="text" // Ubah jadi email
                            name="no_telp"
                            placeholder="Nomor Telepon Approver"
                            required
                            value={data.no_telp} // Sesuaikan nama
                            onChange={
                                (e) =>
                                    setData("no_telp", e.target.value) // Sesuaikan nama
                            }
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="file"
                            name="ttd_img"
                            placeholder="Attach Tanda Tangan"
                            onChange={
                                (e) =>
                                    setData("ttd_img", e.target.files[0]) // Sesuaikan nama
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-login"
                        disabled={processing}
                    >
                        {processing ? "Memproses..." : "Update Approver"}
                    </button>
                </div>
            </form>
        </div>
    );
}