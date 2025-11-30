<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_plan_id' => $this->customer_plan_id,
            'bill_no' => $this->bill_no,
            'rebate' => $this->rebate,
            'partial' => $this->partial,
            'bill_amount' => $this->bill_amount,
            'remarks' => $this->remarks,
            'date_billing' => $this->date_billing,
            'description' => $this->description,
            'mode_payment' => $this->mode_payment,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // ✅ Nest resources properly
            'customer_plan' => [
                'id' => $this->customerPlan->id,
                'ppoe' => $this->customerPlan->ppoe,
                'password' => $this->customerPlan->password,
                'date_registration' => $this->customerPlan->date_registration,
                'date_billing' => $this->customerPlan->date_billing,

                'customer' => new CustomerResource($this->customerPlan->customer),
                'collector' => new CollectorResource($this->customerPlan->collector),
                'plan' => new PlanResource($this->customerPlan->plan),
            ],
        ];
    }
}
