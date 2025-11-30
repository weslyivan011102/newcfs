<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBillRequest extends FormRequest
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
            'bill_no' => ['nullable', 'string', 'max:255'],
            'or_no' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'decimal:0,2'], // allows from 0 to 2 decimal places
            'remarks' => ['nullable', 'string', 'max:255'],
            'collector_id' => ['required', 'integer'],
        ];
    }
}
