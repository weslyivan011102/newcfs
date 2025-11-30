<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    /** @use HasFactory<\Database\Factories\BillFactory> */
    use HasFactory;
    protected $fillable = [
        'customer_id',
        'bill_no',
        'or_no',
        'amount',
        'remarks',
        'collector_id',
    ] ;

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function Collector()
    {
        return $this->belongsTo(Collector::class);
    }
}
