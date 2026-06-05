<p>Hello {{ $subscription->full_name }},</p>
<p>Your subscription has been rejected.</p>
@include('emails.subscriptions._details')
<p><strong>Reason:</strong> {{ $reason }}</p>
