<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TrainerOpportunity extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    protected $casts = [
        'application_deadline' => 'date',
        'start_date' => 'date',
        'end_date' => 'date',
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
