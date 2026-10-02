<x-mail::message>
# Dengan Hormat,

Diinformasikan bahwa SOP: {{ $document->judul_dokumen }} yang diajukan oleh {{ $document->user->username }} telah berubah status: {{ $statusText }}
Terima Kasih atas perhatiannya, 

-SOP MANAGEMENT APP

<x-mail::panel>
    <p><strong>Dokumen: </strong> {{ $document->judul_dokumen }}</p>
    <p><strong>Divisi: </strong> {{ $document->divisi }}</p>
    <p><strong>Div Head: </strong> {{ $document->divisi_email }}</p>
    <p><strong>Dept Head: </strong> {{ $document->departemen_email }}</p>
    <p><strong>Status Saat Ini: </strong> {{ $statusText }}</p>
    <p><strong>Updated Pada: </strong> {{ $document->updated_at->format('d M Y, H:i') }}</p>
</x-mail::panel>


</x-mail::message>