<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
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
            'customer_plan_id' => ['required', 'integer'],
            'collector_id' => ['required', 'integer'],
            'bill_no' => ['required', 'string', 'max:255'],
            'rebate' => ['nullable', 'numeric'],
            'partial' => ['nullable', 'numeric'],
            'bill_amount' => ['required', 'numeric'],
            'remarks' => ['required', 'in:advance,batch'],
            'description' => ['required', 'in:n/a,january,february,march,april,may,june,july,august,september,october,november,december'],
            'mode_payment' => ['required', 'in:N/A,Cash,Gcash,Cheque'],
            'status' => ['required', 'in:Paid,Unpaid'],
            'date_billing' => ['required', 'date']
        ];
    }
}
