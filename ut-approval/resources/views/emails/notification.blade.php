<x-mail::message>
# Halo, {{ $document->user->username }} 
Berikut adalah notifikasi untuk memberi tahu bahwa ajuan dokumen SOP anda yang berjudul: {{ $document->judul_dokumen }} telah berubah status.


<x-mail::panel>
    <p><strong>Nama Dokumen: </strong> {{ $document->judul_dokumen }}</p>
    <p><strong>Status: </strong> {{ $statusText }}</p>
    <p><strong>Updated Pada: </strong> {{ $document->updated_at->format('d M Y, H:i') }}</p>
</x-mail::panel>

{{-- Hanya tampilkan alasan jika dokumen ditolak --}}
@if($document->status === 'rejected')
**Alasan Penolakan:**
> {{ $document->reject_reason }}
@endif

Terima kasih,<br>
Sistem Approval SOP UT
</x-mail::message>