<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalkinBilling extends Model
{
    protected $fillable = [
        'customer_plan_id',
        'bill_no',
        'rebate',
        'partial',
        'bill_amount',
        'remarks',
    ];

    public function customerPlan()
    {
        return $this->belongsTo(CustomerPlan::class);
    }
}
