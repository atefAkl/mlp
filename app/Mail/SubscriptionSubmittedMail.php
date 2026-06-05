<?php

namespace App\Mail;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionSubmittedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Subscription $subscription
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Subscription Received - ' . $this->subscription->public_id,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.subscriptions.submitted',
            with: [
                'subscription' => $this->subscription,
            ],
        );
    }
}
