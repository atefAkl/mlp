# Subscriptions API (Backend)

## Public Endpoints

### GET /api/subscriptions/meta

Returns reference data for forms.

Response keys:

- countries
- stacks
- positions
- rounds
- company_fields
- package_ranges
- interview_times

### POST /api/subscriptions

Creates a new subscription for one of:

- trainee
- trainer
- company

Rate limit:

- 20 requests per minute per IP (`throttle:subscriptions-create`)

Common payload:

- type
- email
- full_name
- country_id
- accept_conditions

Type-specific fields:

- trainee: stack_id, round_id, interview_times[], cv(optional)
- trainer: position_id, interview_times[], cv(required)
- company: brand_name, company_field_id, package_range_id, cr_number, extra_information(optional), cr(optional)

Response:

- message
- subscription_id
- redirect_url

### GET /api/subscriptions/public/{publicId}

Returns public summary by subscription id.

## Admin Endpoints (auth:sanctum + manage.subscribers)

### GET /api/admin/subscribers

List with filters and pagination.

Filters:

- type
- status
- name
- date
- round_id
- per_page

### GET /api/admin/subscribers/grouped

Returns subscribers grouped by type for cards/sections UI.

Query params:

- type (optional)
- status (optional)
- name (optional)
- date (optional)
- round_id (optional)
- per_type_limit (default 20)

### GET /api/admin/subscribers/stats

Returns:

- total_subscribers
- totals_by_type
- totals_by_status
- daily_counts_last_7_days

### GET /api/admin/subscribers/trends

Query params:

- interval: daily|weekly (default daily)
- days: 1..90 (default 30)
- type: trainee|trainer|company
- status: pending|accepted|rejected|maybe

### GET /api/admin/subscribers/{type}/{subscription}

Returns full subscriber details.

### PATCH /api/admin/subscribers/{subscription}/status

Payload:

- status: accepted|rejected|maybe
- scheduled_at (required for accepted)
- reason (required for rejected/maybe)

### PATCH /api/admin/subscribers/bulk-status

Payload:

- ids[]
- status: rejected|maybe
- reason

### POST /api/admin/subscribers/selection

Selection helper for bulk UI actions.

Payload:

- action: select_all | select_none | invert
- selected_ids[] (optional)
- same filters as list endpoint

Response:

- matching_count
- selected_count
- selected_ids[]

### POST /api/admin/subscribers/{subscription}/resend-email

Payload (optional):

- event_type: submitted|accepted|rejected|maybe
- reason
- scheduled_at

Behavior:

- Queues an email job using provided event_type.
- If event_type omitted, defaults to current subscription status (or submitted when pending).

## Reference Data Management (Admin)

These endpoints require `auth:sanctum` and `manage.subscribers` middleware.

### GET /api/admin/reference-data

Returns all reference lists:

- countries
- stacks
- positions
- rounds
- company_fields
- package_ranges

### POST /api/admin/reference-data/{resource}

Creates a reference item.

Payload:

- name

Allowed resources:

- countries
- stacks
- positions
- rounds
- company_fields
- package_ranges

### PUT /api/admin/reference-data/{resource}/{id}

Updates reference item name.

Payload:

- name

### DELETE /api/admin/reference-data/{resource}/{id}

Deletes a reference item.

## Notes

- File uploads are validated to `pdf` or `md` and max size 5MB.
- Email notifications are queued via `SendSubscriptionEmailJob`.
- Email jobs use retries/backoff on queue `emails`.
