<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DocumentApprovalMail extends Mailable
{
    use Queueable, SerializesModels;

    public $document;
    public $downloadUrl;
    public $approvalUrl;
    public $rejectionUrl;

    /**
     * Create a new message instance.
     */
    public function __construct($document, $downloadUrl, $approvalUrl, $rejectionUrl)
    {
        $this->document = $document;
        $this->downloadUrl = $downloadUrl;
        $this->approvalUrl = $approvalUrl;
        $this->rejectionUrl = $rejectionUrl;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Document Approval: ' . $this->document->judul_dokumen,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.document_approval',
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
