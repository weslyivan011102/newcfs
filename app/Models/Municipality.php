<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Municipality extends Model
{
    protected $fillable = [
        'municipality_name',
    ];

    // 🔗 One    municipality has many barangays
    public function barangays()
    {
        return $this->hasMany(Barangay::class);
    }
}
