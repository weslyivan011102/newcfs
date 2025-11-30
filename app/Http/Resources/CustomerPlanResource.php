<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerPlanResource extends JsonResource
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
            'customer_id' => $this->customer_id,
            'plan_id' => $this->plan_id,
            'date_registration' => $this->date_registration,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'collector' => new CollectorResource($this->whenLoaded('collector')),
            'plan' => new PlanResource($this->whenLoaded('plan')),
            'date_billing' => $this->date_billing,
            'ppoe' => $this->ppoe,
            'password' => $this->password,
        ];
    }
}
