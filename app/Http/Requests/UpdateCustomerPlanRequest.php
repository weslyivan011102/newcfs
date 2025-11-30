<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerPlanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'integer'],
            'collector_id' => ['required', 'integer'],
            'plan_id' => ['required', 'integer'],
            'ppoe' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
            'date_billing' => ['required', 'in:batch1,batch2,batch3,batch4,batch5,all_cheque'],
            'date_registration' => ['required', 'date'],
        ];
    }
}
