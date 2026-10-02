<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $document;
    public $statusColor;
    public $statusText;
    public $rejecterRole;

    /**
     * Create a new message instance.
     */
    public function __construct($document)
    {
        $this->document = $document;

        $this->rejecterRole = match($document->rejected_by_role) {
            'dept' => 'Dept Head',
            'div' => 'Div Head',
            'sop_pic' => 'SOP PIC',
            'sop_head' => 'SOP Head',
            default => '',
        };

        $this->statusColor = $this->document->status;

        $this->statusText = $this->document->status;
        if ($document->status === 'approved') {
            $this->statusColor = 'green';
            $this->statusText = 'Semua approver telah menyetujui dan submisi SOP anda telah berstatus approve';
        } elseif ($document->status === 'rejected') {
            $this->statusColor = 'red';
            $this->statusText = "Submisi anda ada kesalahan dan telah di reject oleh {$this->rejecterRole}, mohon melakukan submisi perbaikan";
        } elseif ($document->status === 'pending_div') {
            $this->statusColor = 'yellow';
            $this->statusText = 'Submisi anda telah disetujui oleh Department Head';
        } elseif ($document->status === 'pending_sop_pic') {
            $this->statusColor = 'yellow';
            $this->statusText = 'Submisi anda telah disetujui oleh Division Head';
        } elseif ($document->status === 'pending_sop_head') {
            $this->statusColor = 'yellow';
            $this->statusText = 'Submisi anda telah disetujui oleh SOP PIC';
        }
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Update Status Document Approval: ' . $this->document->judul_dokumen,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.notification',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
