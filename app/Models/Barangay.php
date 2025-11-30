<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    protected $fillable = [
        'barangay_name',
        'municipality_id',
    ];

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    // 🔗 Barangay has many puroks
    public function puroks()
    {
        return $this->hasMany(Purok::class);
    }
}
