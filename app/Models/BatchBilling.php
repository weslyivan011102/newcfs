<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BatchBilling extends Model
{
    protected $fillable = [
        'customer_plan_id',
        'bill_no',
        'bill_amount',
    ];

    public function customerPlan()
    {
        return $this->belongsTo(CustomerPlan::class);
    }
}
