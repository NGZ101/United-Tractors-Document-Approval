import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function NuPage({ title }) {
    return (
        <div>
            <Head title={title} />
            <h1>{title}</h1>
            <p>This is the NuPage.</p>
            <Link href="/" style={{
                padding: '10px 20px',
                backgroundColor: '#4299e1',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
            }}>
                Kembali
            </Link>
        </div>
    );
}
