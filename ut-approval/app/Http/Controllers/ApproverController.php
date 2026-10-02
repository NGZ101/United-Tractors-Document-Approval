<?php

namespace App\Http\Controllers;

use App\Models\Approver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ApproverController extends Controller
{
    public function store(Request $request) {
        $validated = $request->validate([
            'nama_full'        => 'required|string|max:255',
            'divisi'           => 'required|string',
            'role'             => 'required|string',
            'email' => 'required|string|email|max:100|unique:approvers,email',
            'no_telp'          => 'required|string|max:255',
            'ttd_img'          => 'required|file|mimes:png,jpg,jpeg|max:5120',
        ], [
            'email.unique' => 'Maaf, email ini sudah terdaftar',
        ]);

        try {
            // Pastikan user sudah login
            if (!Auth::check()) {
                dd("ERROR: Kamu belum login! Auth::id() bernilai kosong.");
            }

            $filePath = $request->file('ttd_img')->store('ttd_images', 'public');

            $approver = Approver::create([
                'nama_full'        => $validated['nama_full'],
                'divisi'           => $validated['divisi'],
                'role'             => $validated['role'],
                'email'            => $validated['email'],
                'no_telp'          => $validated['no_telp'],
                'ttd_img'          => $filePath,
            ]);

            return redirect()->route('dashboardAdmin')->with('success', 'Dokumen berhasil disubmit!');

        } catch (\Exception $e) {
            // JIKA DATABASE MENOLAK, ERROR ASLINYA AKAN MUNCUL DI LAYAR!
            dd("DATABASE ERROR: " . $e->getMessage());
        }
    }

    public function showApprover($id) {
        $approver = Approver::findOrFail($id);
        return Inertia::render('Admin/ShowApprover', [
            'title' => 'Detail Approver',
            'approver' => $approver
        ]);
    }

    public function updateApprover(Request $request, $id) {
        $approver = Approver::findOrFail($id);
        $request->validate([
            'nama_full' => 'required|string|max:100',
            'role' => 'required|string|max:20',
            'divisi' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:approvers,email,'.$approver->id,
            'no_telp' => 'required|string|max:20',
            'ttd_img' => 'nullable|file|mimes:png,jpg,jpeg|max:10240',
        ], [
            'email.unique' => 'Maaf, email ini sudah terdaftar',
        ]);

        $approverUpdate = [
            'nama_full' => $request->nama_full,
            'role' => $request->role,
            'divisi' => $request->divisi,
            'email' => $request->email,
            'no_telp' => $request->no_telp,
        ];
        if ($request->hasFile('ttd_img')) {
            if (Storage::disk('public')->exists($approver->ttd_img)) {
                Storage::disk('public')->delete($approver->ttd_img);
            }
            $filePath = $request->file('ttd_img')->store('ttd_images', 'public');
            $approverUpdate['ttd_img'] = $filePath;
        }

        $approver->update($approverUpdate);
        return redirect()->route('dashboardAdmin')->with('success', 'Approver telah di update');
    }

    public function deleteApprover($id) {
        $approver = Approver::findOrFail($id);
        if ($approver->ttd_img && Storage::disk('public')->exists($approver->ttd_img)) {
            Storage::disk('public')->delete($approver->ttd_img);
        }
        $approver->delete();
        return redirect()->route('dashboardAdmin')->with('success', 'Approver telah dihapus');
    }
}