<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purok extends Model
{
    protected $fillable = [
        'purok_name',
        'barangay_id',
    ];

    // 🔗 Purok belongs to a barangay
    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}
