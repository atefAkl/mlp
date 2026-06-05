<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'type',
        'title',
        'description',
        'status',
        'due_date',
        'trainee_id',
        'mentor_id',
        'points',
        'revisions_count',
        'rating',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'datetime',
        ];
    }
}
