<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionTimeSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'subscription_id',
        'slot_value',
        'is_selected_by_admin',
    ];

    protected function casts(): array
    {
        return [
            'is_selected_by_admin' => 'boolean',
        ];
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}
