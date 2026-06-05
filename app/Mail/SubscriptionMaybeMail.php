<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionMaybeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Subscription $subscription,
        public string $reason
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Subscription Update - ' . $this->subscription->public_id,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.subscriptions.maybe',
            with: [
                'subscription' => $this->subscription,
                'reason' => $this->reason,
            ],
        );
    }
}
