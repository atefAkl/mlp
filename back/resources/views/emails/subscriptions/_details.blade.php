<p><strong>Subscription ID:</strong> {{ $subscription->public_id }}</p>
<p><strong>Type:</strong> {{ ucfirst($subscription->type) }}</p>
<p><strong>Status:</strong> {{ ucfirst($subscription->status) }}</p>
<p><strong>Email:</strong> {{ $subscription->email }}</p>
<p><strong>Full Name:</strong> {{ $subscription->full_name }}</p>
<p><strong>Country:</strong> {{ $subscription->country?->name ?? '-' }}</p>

@if ($subscription->timeSlots->isNotEmpty())
<p><strong>Selected Interview/Demo Times:</strong></p>
<ul>
    @foreach ($subscription->timeSlots as $slot)
    <li>{{ $slot->slot_value }}</li>
    @endforeach
</ul>
@endif

@if ($subscription->type === 'trainee' && $subscription->traineeDetail)
<p><strong>Stack:</strong> {{ $subscription->traineeDetail->stack?->name ?? '-' }}</p>
<p><strong>Round:</strong> {{ $subscription->traineeDetail->round?->name ?? '-' }}</p>
@endif

@if ($subscription->type === 'trainer' && $subscription->trainerDetail)
<p><strong>Position:</strong> {{ $subscription->trainerDetail->position?->name ?? '-' }}</p>
@endif

@if ($subscription->type === 'company' && $subscription->companyDetail)
<p><strong>Brand:</strong> {{ $subscription->companyDetail->brand_name }}</p>
<p><strong>Field:</strong> {{ $subscription->companyDetail->companyField?->name ?? '-' }}</p>
<p><strong>Package:</strong> {{ $subscription->companyDetail->packageRange?->name ?? '-' }}</p>
<p><strong>CR Number:</strong> {{ $subscription->companyDetail->cr_number }}</p>
@if ($subscription->companyDetail->extra_information)
<p><strong>Extra Information:</strong> {{ $subscription->companyDetail->extra_information }}</p>
@endif
@endif

@if ($subscription->files->isNotEmpty())
<p><strong>Uploaded Files Count:</strong> {{ $subscription->files->count() }}</p>
@endif
