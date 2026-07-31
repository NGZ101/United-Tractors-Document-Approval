import React, { useState, useEffect, useRef } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import "D:/06-Coding Naufal/United-Tractors-Document-Approval/ut-approval/resources/css/dashboard.css";
export default function Dashboard({ title, documents }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const dropdownRef = useRef(null);
    const popupref = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [PopupConfig, setPopupConfig] = useState({
        isOpen: false,
        type: null,
        message: "",
    });

    const handleLogout = (e) => {
        e.preventDefault();
        setPopupConfig({
            isOpen: true,
            type: "logout",
            message: "Apakah anda yakin ingin logout ?",
        });
    };

    const handleDelete = (e) => {
        e.preventDefault();
        setPopupConfig({
            isOpen: true,
            type: "delete",
            message: "Apakah anda yakin ingin hapus akun ?",
        });
    };

    const PopupConfirm = () => {
        if (PopupConfig.type === "logout") {
            router.post('/logout');
        } else if (PopupConfig.type === "delete") {
            router.post('/delete-account');
        }
        setPopupConfig({
            isOpen: false,
            type: null,
            message: "",
        });
    };
    const PopupCancel = () => {
        setPopupConfig({
            isOpen: false,
            type: null,
            message: "",
        })
    };

    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div>
            <Head title="Dashboard" />
            {PopupConfig.isOpen && (
                <div className="popup-container">
                    <h1>{PopupConfig.message}</h1>
                    <div className="popup-btns">
                        <Link className="yes-btn" onClick={PopupConfirm}>YES</Link>
                        <Link className="no-btn" onClick={PopupCancel}>NO</Link>
                    </div>
                </div>
            )}
            <header className="navbar">
                <div className="logo">
                    <img src="/assets/logo.png" alt="logo" />
                </div>
                <div className="user-info" ref={dropdownRef}>
                    <button className="profile" onClick={toggleDropdown}>
                        <img
                            className="profile-img"
                            src="/assets/icon/profile.png"
                            alt="profile"
                        />
                    </button>
                    {isDropdownOpen && (
                        <div className="dropdown-profile">
                            <Link href="/profile" className="dropdown-item">
                                Profile
                            </Link>
                            <Link
                                href="/logout"
                                className="dropdown-item"
                                onClick={handleLogout}
                            >
                                Logout
                            </Link>
                            <Link
                                href="/delete-account"
                                className="dropdown-item"
                                onClick={handleDelete}
                            >
                                Delete Account
                            </Link>
                        </div>
                    )}
                </div>
            </header>
            <div className="table-container">
                <div className="above-table">
                    <h1>Dashboard</h1>
                    <a className="submit-btn" href="/submit">
                        <img src="/assets/icon/plus.png" alt="plus" />
                        Submit Document
                    </a>
                </div>
                <table className="table-dashboard">
                    <thead>
                        <tr>
                            <th className="tanggal">Tanggal Submisi</th>
                            <th className="judul">Judul Dokumen</th>
                            <th className="status">Status</th>
                            <th className="actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!documents || documents.length === 0 ? (
                            <tr>
                                <td>Belum ada dokumen yang disubmit.</td>
                            </tr>
                        ) : (
                            documents.map((doc) => {
                                let statusText = doc.status;
                                let statusColor = "black";

                                if (doc.status === "approved") {
                                    statusColor = "green";
                                    statusText = "Approved";
                                }

                                if (doc.status === "rejected") {
                                    statusColor = "red";
                                    statusText = "Rejected";
                                }

                                if (doc.status === "pending_div") {
                                    statusColor = "#EAB514";
                                    statusText = "On Review By Div Head";
                                }

                                if (doc.status === "pending_dept") {
                                    statusColor = "#EAB514";
                                    statusText = "On Review By Dept Head";
                                }

                                if (doc.status === "pending_sop_pic") {
                                    statusColor = "#EAB514";
                                    statusText = "On Review By SOP PIC";
                                }

                                if (doc.status === "pending_sop_head") {
                                    statusColor = "#EAB514";
                                    statusText = "On Review By SOP Head";
                                }

                                return (
                                    <tr key={doc.id}>
                                        <td>
                                            {doc.created_at
                                                ? doc.created_at
                                                      .substring(0, 10)
                                                      .replace(/-/g, "/")
                                                : "-"}
                                        </td>
                                        <td>{doc.judul_dokumen}</td>
                                        <td style={{ color: statusColor }}>
                                            {statusText}
                                        </td>
                                        <td className="action-btns">
                                            <Link
                                                className="view-btn"
                                                href={`/documents/${doc.id}`}
                                            >
                                                <img
                                                    className="btn-icon"
                                                    src="/assets/icon/view.png"
                                                    alt="view"
                                                ></img>
                                            </Link>
                                            {doc.status === "approved" && (
                                                <a
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="download-btn"
                                                >
                                                    <img
                                                        className="btn-icon"
                                                        src="/assets/icon/download.png"
                                                        alt="download"
                                                    />
                                                </a>
                                            )}
                                            {doc.status === "rejected" && (
                                                <a
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="retry-btn"
                                                >
                                                    <img
                                                        className="btn-icon"
                                                        src="/assets/icon/retry.png"
                                                        alt="retry"
                                                    />
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
                <div className="link-box">
                    <a
                        href="/assets/file/Template_Dokumen.docx"
                        download="Template_Dokumen.docx"
                    >
                        Template Dokumen
                    </a>
                    <Link href="/alur">Alur Approval Dokumen</Link>
                </div>
            </div>
        </div>
    );
}
