<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerFactory> */
    use HasFactory;

    protected $fillable = [
        'firstname',
        'middlename',
        'lastname',
        'sex',
        'marital_status',
        'birthdate',
        'occupation',
        'contact_no',
        'purok_id',
        'disconnection',
        'banned_date',
        'status',
    ];

    // 🔗 Customer belongs to a Purok
    public function purok()
    {
        return $this->belongsTo(Purok::class);
    }

    public function customerPlans()
    {
        return $this->hasMany(CustomerPlan::class);
    }

    public function collector()
    {
        return $this->belongsTo(Collector::class);
    }

    public function hasTransaction(): bool
    {
        return Transaction::whereHas('customerPlan', function ($query) {
            $query->where('customer_id', $this->id);
        })->exists();
    }

    public function transactions()
    {
        return $this->hasManyThrough(
            Transaction::class,
            CustomerPlan::class,
            'customer_id',        // Foreign key on customer_plans
            'customer_plan_id',   // Foreign key on transactions
            'id',                 // Local key on customers
            'id'                  // Local key on customer_plans
        );
    }
}
