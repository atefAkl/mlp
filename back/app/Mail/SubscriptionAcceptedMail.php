<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionAcceptedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Subscription $subscription,
        public ?string $scheduledAt = null
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Subscription Accepted - ' . $this->subscription->public_id,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.subscriptions.accepted',
            with: [
                'subscription' => $this->subscription,
                'scheduledAt' => $this->scheduledAt,
            ],
        );
    }
}
