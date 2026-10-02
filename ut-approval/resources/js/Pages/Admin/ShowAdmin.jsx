import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import '/resources/css/show.css'; 
export default function Show({document}) {
    let statusColor = "black";
    let statusText = document.status;

    //Status
    if (document.status === "approved") {
        statusColor = "green";
        statusText = "Approved";
    }

    if (document.status === "rejected") {
        statusColor = "red";
        statusText = "Rejected";
    }

    if (document.status === "pending_div") {
        statusColor = "#EAB514";
        statusText = "On Review By Div Head";
    }

    if (document.status === "pending_dept") {
        statusColor = "#EAB514";
        statusText = "On Review By Dept Head";
    }

    if (document.status === "pending_sop_pic") {
        statusColor = "#EAB514";
        statusText = "On Review By SOP PIC";
    }

    if (document.status === "pending_sop_head") {
        statusColor = "#EAB514";
        statusText = "On Review By SOP Head";
    }

    // Role rejection status
    if (document.rejected_by_role === "dept") {
        statusColor = "red";
        statusText = "Dept Head";
    }

    if (document.rejected_by_role === "div") {
        statusColor = "red";
        statusText = "Div Head";
    }

    if (document.rejected_by_role === "sop_pic") {
        statusColor = "red";
        statusText = "SOP PIC";
    }

    if (document.rejected_by_role === "sop_head") {
        statusColor = "red";
        statusText = "SOP Head";
    }

    return (
        <div>
            <Head title={`Document View-${document?.judul_dokumen}`} />
            <header className="navbar">
                <Link className="back-btn" id="backButton" href="/admin/dashboardAdmin">
                    <img src="/assets/icon/return.png" alt="return" />
                </Link>
                <div className="logo">
                    <img src="/assets/logo.png" alt="logo" />
                </div>
            </header>

            <div className="doc-container">
                <h1>Detail Submisi Dokumen</h1>
                <div class="doc-item">
                    Judul Dokumen: {document.judul_dokumen}
                </div>
                <div class="doc-item">Divisi: {document.divisi}</div>
                <div class="doc-item">
                    Email Dept Head: {document.departemen_email}
                </div>
                <div class="doc-item">
                    Email Div Head: {document.divisi_email}
                </div>
                <div class="doc-item">
                    Disubmisi Pada:{" "}
                    {document.created_at
                        ? document.created_at
                              .substring(0, 10)
                              .replace(/-/g, "/")
                        : "-"}
                </div>
                <div class="doc-item" style={{ color: statusColor }}>
                    Status: {statusText}
                </div>
                {document.status === "rejected" && (
                    <div class="doc-item" style={{ color: statusColor }}>
                        Alasan Penolakan: {document.reject_reason}
                    </div>
                )}
                {document.status === "rejected" && (
                    <div class="doc-item" style={{ color: statusColor }}>
                        Ditolak Oleh: {document.rejected_by_role}
                    </div>
                )}
            </div>
        </div>
    );
}