<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CollectorResource extends JsonResource
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
            'firstname' => $this->firstname,
            'middlename' => $this->middlename,
            'lastname' => $this->lastname,
            'sex' => $this->sex,
            'marital_status' => $this->marital_status,
            'birthdate' => $this->birthdate,
            'address' => $this->address,
            'contact_no' => $this->contact_no,
        ];
    }
}
