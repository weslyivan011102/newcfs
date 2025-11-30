<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'customer_plan_id',
        'collector_id',
        'bill_no',
        'rebate',
        'partial',
        'bill_amount',
        'description',
        'mode_payment',
        'remarks',
        'status',
        'date_billing',
        'plan_price',
        'plan_mbps'
    ];

    public function customerPlan()
    {
        return $this->belongsTo(CustomerPlan::class);
    }
}
