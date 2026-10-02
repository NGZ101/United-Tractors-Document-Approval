<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApproverNotificationMail extends Mailable
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
            $this->statusText = 'Approved';
        } elseif ($document->status === 'rejected') {
            $this->statusColor = 'red';
            $this->statusText = "Rejected oleh {$this->rejecterRole}";
        } elseif ($document->status === 'pending_div') {
            $this->statusColor = 'yellow';
            $this->statusText = 'On Review By Division Head';
        } elseif ($document->status === 'pending_sop_pic') {
            $this->statusColor = 'yellow';
            $this->statusText = 'On Review By SOP PIC';
        } elseif ($document->status === 'pending_sop_head') {
            $this->statusColor = 'yellow';
            $this->statusText = 'On Review By SOP Head';
        }
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Update Approval Dokumen: ' . $this->document->judul_dokumen,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.approver_notification',
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