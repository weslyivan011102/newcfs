<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WalkinBillingResource extends JsonResource
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
            'customer' => new CustomerResource($this->whenLoaded('customerPlan.customer')),
            'plan' => $this->whenLoaded('customerPlan.plan'),
            'collector' => $this->whenLoaded('customerPlan.collector'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
