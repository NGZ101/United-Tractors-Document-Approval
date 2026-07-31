<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str; // Tambahkan ini untuk membuat token acak

class DocumentController extends Controller
{
    public function store(Request $request) {
        $validated = $request->validate([
            'judul_dokumen'    => 'required|string|max:255',
            'divisi'           => 'required|string',
            'departemen_email' => 'required|email',
            'divisi_email'     => 'required|email',
            'file_dokumen'     => 'required|file|mimes:pdf,doc,docx|max:5120', 
        ]);

        try {
            // Pastikan user sudah login
            if (!Auth::check()) {
                dd("ERROR: Kamu belum login! Auth::id() bernilai kosong.");
            }

            $filePath = $request->file('file_dokumen')->store('documents', 'public');

            Document::create([
                'user_id'          => Auth::id(), 
                'judul_dokumen'    => $validated['judul_dokumen'],
                'divisi'           => $validated['divisi'],
                'departemen_email' => $validated['departemen_email'],
                'divisi_email'     => $validated['divisi_email'],
                'file_dokumen'     => $filePath,
                
                // TAMBAHKAN INI: Nilai default agar database tidak menolak
                'status'           => 'pending_div', 
                'approval_token'   => Str::random(32),
                'sop_pic_email'    => $validated['divisi_email'],
                'sop_head_email'   => $validated['departemen_email'],
            ]);
            
            return redirect()->route('dashboard')->with('success', 'Dokumen berhasil disubmit!');

        } catch (\Exception $e) {
            // JIKA DATABASE MENOLAK, ERROR ASLINYA AKAN MUNCUL DI LAYAR!
            dd("DATABASE ERROR: " . $e->getMessage());
        }
    }

    public function show($id) {
        $document = Document::where('id', $id)
        ->where('user_id', Auth::id())
        ->firstOrFail();
        return Inertia::render('Show', [
            'document' => $document
        ]);
    }
}
