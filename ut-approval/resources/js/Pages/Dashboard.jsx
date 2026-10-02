import React, { useState, useEffect, useRef } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import "/resources/css/dashboard.css";
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
            router.post("/logout");
        } else if (PopupConfig.type === "delete") {
            router.post("/delete-account");
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
        });
    };

    const Timeline = (doc) => {
        const TimelineSteps = [
            {key: 'dept', label: 'Dept Head', approvedAt: doc.dept_head_approved_at, pendingStatus: 'pending_dept' },
            {key: 'div', label: 'Div Head', approvedAt: doc.div_head_approved_at, pendingStatus: 'pending_div' },
            {key: 'sop_pic', label: 'SOP PIC', approvedAt: doc.sop_pic_approved_at, pendingStatus: 'pending_sop_pic' },
            {key: 'sop_head', label: 'SOP Head', approvedAt: doc.sop_head_approved_at, pendingStatus: 'pending_sop_head' },
        ];

        let isRejected = false;

        return TimelineSteps.map(step => {
            let status = '';
            let date = '';
            let dotColor = 'dot-black';

            if (step.approvedAt) {
                status = 'Approval';
                date = `on ${step.approvedAt.substring(0, 10).replace(/-/g, "/")}`;
                dotColor = 'dot-green';
            }
            else if (doc.status === 'rejected' && doc.rejected_by_role === step.key) {
                status = 'Rejection';
                date = `on ${doc.rejected_at ? doc.rejected_at.substring(0, 10).replace(/-/g, "/") : ''}`;
                dotColor = 'dot-red';
                isRejected = true;
            }
            else if (doc.status === step.pendingStatus) {
                status = 'On Review';
                date = '';
                dotColor = 'dot-yellow';
            }
            else {
                status = isRejected ? 'Canceled' : 'Pending';
                date = '';
                dotColor = 'dot-black';
            }
            return {label: step.label, status, date, dotColor};
        })
    }

    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="dashboard-container">
            <Head title="Dashboard" />
            {PopupConfig.isOpen && (
                <div className="popup-container">
                    <h1>{PopupConfig.message}</h1>
                    <div className="popup-btns">
                        <button className="yes-btn" onClick={PopupConfirm}>
                            YES
                        </button>
                        <button className="no-btn" onClick={PopupCancel}>
                            NO
                        </button>
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
                            <button className="dropdown-item" onClick={() => window.location.href = '/profile'}>
                                Profile
                            </button>
                            <button
                                href="/logout"
                                className="dropdown-item"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                            <button
                                href="/delete-account"
                                className="dropdown-item"
                                onClick={handleDelete}
                            >
                                Delete Account
                            </button>
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
                                <td></td>
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

                                if (doc.status === "pending_dept") {
                                    statusColor = "#EAB514";
                                    statusText = "On Review By Dept Head";
                                }

                                if (doc.status === "pending_div") {
                                    statusColor = "#EAB514";
                                    statusText = "On Review By Div Head";
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
                                    <tr key={doc.id} className="table-items">
                                        <td>
                                            {doc.created_at
                                                ? doc.created_at
                                                      .substring(0, 10)
                                                      .replace(/-/g, "/")
                                                : "-"}
                                        </td>
                                        <td>{doc.judul_dokumen}</td>
                                        <td style={{ color: statusColor }}>
                                            <div className="hover-status">
                                                <span style={{color: statusColor,}}>
                                                    {statusText}
                                                </span>
                                                <div className="status-timeline">
                                                    <div className="timeline-list">
                                                        {Timeline(doc).map((item, idx) => (
                                                            <div key={idx} className="timeline-item">
                                                                <div className={`timeline-dot ${item.dotColor}`}></div>
                                                                <span>
                                                                    <strong>{item.label}:</strong> {item.status} {item.date}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
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
                                                    className="download-btn"
                                                    href={`/documents/${doc.id}/signature`}
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
                                                    className="retry-btn"
                                                    href={`/documents/${doc.id}/retry`}
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
