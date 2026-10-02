<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use App\Models\Approver;
use App\Mail\DocumentApprovalMail;
use App\Mail\NotificationMail;
use App\Mail\ApproverNotificationMail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use setasign\Fpdi\Fpdi;
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

            $document = Document::create([
                'user_id'          => Auth::id(), 
                'judul_dokumen'    => $validated['judul_dokumen'],
                'divisi'           => $validated['divisi'],
                'departemen_email' => $validated['departemen_email'],
                'divisi_email'     => $validated['divisi_email'],
                'file_dokumen'     => $filePath,
                
                'status'           => 'pending_dept', // Status awal dokumen
                'approval_token'   => Str::random(32),
                'sop_pic_email'    => 'neonewman420@gmail.com',
                'sop_head_email'   => 'anotherburner30@gmail.com',
            ]);
            
            $this->sendApprovalEmail($document, $document->departemen_email);

            return redirect()->route('dashboard')->with('success', 'Dokumen berhasil disubmit!');

        } catch (\Exception $e) {
            // JIKA DATABASE MENOLAK, ERROR ASLINYA AKAN MUNCUL DI LAYAR!
            dd("DATABASE ERROR: " . $e->getMessage());
        }
    }

    private function sendApprovalEmail(Document $document, $targetEmail) {
        $downloadUrl = route('documents.download', $document->id);
        $approvalUrl = URL::temporarySignedRoute(
            'documents.approve', 
            now()->addDays(7), 
            [
                'id' => $document->id,
                'expected_status' => $document->status
            ]
        );
        $rejectionUrl = URL::temporarySignedRoute(
            'documents.reject',
            now()->addDays(7),
            [
                'id' => $document->id,
                'expected_status' => $document->status
            ]
        );

        Mail::to($targetEmail)->send(new DocumentApprovalMail($document, $downloadUrl, $approvalUrl, $rejectionUrl));
    }

    public function download($id) {
        $document = Document::findOrFail($id);

        $filePath = storage_path('app/public/' . $document->file_dokumen);

        if (file_exists($filePath)) {
            $extension = pathinfo($document->file_dokumen, PATHINFO_EXTENSION);
            $filename = $document->judul_dokumen . '.' . $extension;
            return response()->download($filePath, $filename);
        }
        
        abort(404, 'File dokumen tidak ditemukan.');
    }

    public function approve(Request $request, $id) {
        $document = Document::findOrFail($id);

        if ($request->has('expected_status') && $document->status !== $request->expected_status) {
            return redirect()->route('result')->with('message', 'Status dokumen telah berubah. Silakan periksa kembali.');
        }

        $approverEmail = [];

        switch ($document->status) {
            case 'pending_dept':
                $document->update(['status' => 'pending_div', 'dept_head_approved_at' => now()]);
                $this->sendApprovalEmail($document, $document->divisi_email);
                $message = "Terima kasih telah menyetujui dokumen. Dokumen akan dikirim ke Div Head untuk persetujuan.";
                $approverEmail = [$document->departemen_email];
                break;
            case 'pending_div':
                $document->update(['status' => 'pending_sop_pic', 'div_head_approved_at' => now()]);
                $this->sendApprovalEmail($document, $document->sop_pic_email);
                $message = "Terima kasih telah menyetujui dokumen. Dokumen akan dikirim ke SOP PIC untuk persetujuan.";
                $approverEmail = [$document->departemen_email, $document->divisi_email];
                break;
            case 'pending_sop_pic':
                $document->update(['status' => 'pending_sop_head', 'sop_pic_approved_at' => now()]);
                $this->sendApprovalEmail($document, $document->sop_head_email);
                $message = "Terima kasih telah menyetujui dokumen. Dokumen akan dikirim ke SOP Head untuk persetujuan.";
                $approverEmail = [$document->departemen_email, $document->divisi_email, $document->sop_pic_email];
                break;
            case 'pending_sop_head':
                $document->update(['status' => 'approved', 'sop_head_approved_at' => now()]);
                $message = "Terima kasih telah menyetujui dokumen. Dokumen telah disetujui secara final.";
                $approverEmail = [$document->departemen_email, $document->divisi_email, $document->sop_pic_email, $document->sop_head_email];
                break;
            default:
                abort(400, 'Status dokumen tidak valid.');
        }

        $document->refresh();
        if(!empty($approverEmail)) {
            Mail::to($approverEmail)->send(new ApproverNotificationMail($document));
        }
        Mail::to($document->user->email)->send(new NotificationMail($document));
        return redirect()->route('result')->with('message', $message);
    }

    public function showReject(Request $request, $id) {
        $document = Document::findOrFail($id);
        if ($request->has('expected_status') && $document->status !== $request->expected_status) {
            return redirect()->route('result')->with('message', 'Status dokumen telah berubah. Silakan periksa kembali.');
        }
        return Inertia::render('Reject', [
            'document' => $document
        ]);
    }

    public function processRejection(Request $request, $id) {
        $document = Document::findOrFail($id);

        $request->validate([
            'reject_reason' => 'required|string|max:1000',
        ]);

        $role = str_replace('pending_', '', $document->status);

        $approverEmail = [];

        $document->update([
            'status' => 'rejected',
            'reject_reason' => $request->reject_reason,
            'rejected_at' => now(),
            'rejected_by_role' => $role,
        ]);

        switch ($document->rejected_by_role) {
            case 'dept':
                $approverEmail = [$document->departemen_email];
                break;
            case 'div':
                $approverEmail = [$document->departemen_email, $document->divisi_email];
                break;
            case 'sop_pic':
                $approverEmail = [$document->departemen_email, $document->divisi_email, $document->sop_pic_email];
                break;
            case 'sop_head':
                $approverEmail = [$document->departemen_email, $document->divisi_email, $document->sop_pic_email, $document->sop_head_email];
                break;
        }
        if(!empty($approverEmail)) {
            Mail::to($approverEmail)->send(new ApproverNotificationMail($document));
        }
        Mail::to($document->user->email)->send(new NotificationMail($document));

        $message = "Dokumen telah ditolak";

        return redirect()->route('result')->with('message', $message);
    }

    public function show($id) {
        $document = Document::where('id', $id)
        ->where('user_id', Auth::id())
        ->firstOrFail();
        return Inertia::render('Show', [
            'document' => $document
        ]);
    }

    public function showAdmin($id) {
        $document = Document::with('user')->findOrFail($id);
        return Inertia::render('Admin/ShowAdmin', [
            'title' => 'Detail Dokumen Approval',
            'document' => $document
        ]);
    }

    public function retry(Request $request, $id) {
        $document = Document::where('id', $id)
        ->where('user_id', Auth::id())
        ->firstOrFail();
        
        $request->validate([
            'divisi'           => 'required|string',
            'departemen_email' => 'required|email',
            'divisi_email'     => 'required|email',
            'file_dokumen'     => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        if ($request->hasFile('file_dokumen')) {
            if (Storage::disk('public')->exists($document->file_dokumen)) {
                Storage::disk('public')->delete($document->file_dokumen);
            }
            $newPath = $request->file('file_dokumen')->store('documents', 'public');
            $document->file_dokumen = $newPath;
        }

        $document->divisi = $request->divisi;
        $document->divisi_email = $request->divisi_email;
        $document->departemen_email = $request->departemen_email;

        $document->status = 'pending_dept';

        $document->div_head_approved_at = null;
        $document->dept_head_approved_at = null;
        $document->sop_pic_approved_at = null;
        $document->sop_head_approved_at = null;

        $document->rejected_by_role = null;
        $document->rejected_at = null;
        $document->reject_reason = null;

        $document->save();

        $this->sendApprovalEmail($document, $document->departemen_email);
        
        return redirect()->route('dashboard')->with('success', 'Dokumen berhasil di update');
    }

    public function showRetry($id) {
        $document = Document::where('id', $id)
        ->where('user_id', Auth::id())
        ->where('status', 'rejected')
        ->firstOrFail();
        return inertia('Retry', [
        'document'=>$document
        ]);
    }

    public function signature($id) {
        $document = Document::findOrFail($id);

        if ($document->status !== 'approved') {
            abort(400, 'Dokumen belum approval final');
        }
        $submittedFilePath = storage_path('app/public/' . $document->file_dokumen);

        if (!file_exists($submittedFilePath)) {
            return back()->with('error', 'File tidak ditemukan');
        }

        $deptHead = Approver::where('role', 'dept_head')
        ->where('email', $document->departemen_email)
        ->first();

        $divHead = Approver::where('role', 'div_head')
        ->where('email', $document->divisi_email)
        ->first();

        $sopPic = Approver::where('role', 'sop_pic')
        ->where('email', $document->sop_pic_email)
        ->first();

        $sopHead = Approver::where('role', 'sop_head')
        ->where('email', $document->sop_head_email)
        ->first();

        $pdf = new Fpdi();
        $pageCount = $pdf->setSourceFile($submittedFilePath);

        $pdf->SetFont('Arial', '', 11);

        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            $pdf->AddPage();
            $templateId = $pdf->importPage($pageNo);
            $pdf->useTemplate($templateId, 0, 0, null, null, true);

            if ($pageNo === 1) {
                if ($deptHead && file_exists(storage_path('app/public/' . $deptHead->ttd_img))) {
                    $pdf->Image(storage_path('app/public/' . $deptHead->ttd_img), 36, 101, 30, 15);
                    $pdf->Text(36, 119, $deptHead->nama_full);
                }
            
                if ($divHead && file_exists(storage_path('app/public/' . $divHead->ttd_img))) {
                    $pdf->Image(storage_path('app/public/' . $divHead->ttd_img), 85, 101, 30, 15);
                    $pdf->Text(85, 119, $divHead->nama_full);
                }
            
                if ($sopHead && file_exists(storage_path('app/public/' . $sopHead->ttd_img))) {
                    $pdf->Image(storage_path('app/public/' . $sopHead->ttd_img), 140, 101, 30, 15);
                    $pdf->Text(140, 119, $sopHead->nama_full);
                }
            }
        }
        $fileName = 'Approved_' . $document->judul_dokumen . '.pdf';

        $pdf->Output('D', $fileName);
        exit;
    }


}
