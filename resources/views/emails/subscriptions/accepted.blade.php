<p>Hello {{ $subscription->full_name }},</p>
<p>Your subscription has been accepted.</p>
@include('emails.subscriptions._details')
@if ($scheduledAt)
<p><strong>Interview / Demo Time:</strong> {{ $scheduledAt }}</p>
@endif
<p>We look forward to meeting you.</p>
