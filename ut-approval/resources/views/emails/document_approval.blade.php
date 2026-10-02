<x-mail::message>
# Dengan Hormat,

Bersama ini terlampir SOP: {{ $document->judul_dokumen }}, kami mohon bantuannya untuk memberikan approval
Terima Kasih atas perhatiannya, 

-SOP MANAGEMENT APP

<x-mail::panel>
    <p><strong>Dokumen: </strong> {{ $document->judul_dokumen }}</p>
    <p><strong>Divisi: </strong> {{ $document->divisi }}</p>
    <p><strong>Div Head: </strong> {{ $document->divisi_email }}</p>
    <p><strong>Dept Head: </strong> {{ $document->departemen_email }}</p>
</x-mail::panel>

<x-mail::button :url="$downloadUrl" color="main">
Download Document
</x-mail::button>

<x-mail::button :url="$approvalUrl" color="main">
Approve Document
</x-mail::button>

<x-mail::button :url="$rejectionUrl" color="main">
Reject Document
</x-mail::button>


</x-mail::message>
