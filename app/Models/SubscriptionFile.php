<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'subscription_id',
        'file_type',
        'file_path',
        'mime_type',
    ];

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}
