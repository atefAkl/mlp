<p>Hello {{ $subscription->full_name }},</p>
<p>Your subscription status is currently set to <strong>Maybe</strong>.</p>
@include('emails.subscriptions._details')
<p><strong>Details:</strong> {{ $reason }}</p>
