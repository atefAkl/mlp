<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TrainingProgram extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'published_at' => 'datetime',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'certificate_available' => 'boolean',
        'portfolio_available' => 'boolean',
        'admission_test_required' => 'boolean',
        'interview_required' => 'boolean',
    ];

    public function positions()
    {
        return $this->morphToMany(Position::class, 'positionable');
    }

    public function skills()
    {
        return $this->morphToMany(Skill::class, 'skillable');
    }
}
