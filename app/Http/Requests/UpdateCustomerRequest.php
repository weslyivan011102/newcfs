<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
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
            'firstname' => ['required', 'string', 'max:255'],
            'middlename' => ['nullable', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'sex' => ['required', 'in:male,female'],
            'marital_status' => ['required', 'in:single,married,divorced,widowed,separated'],
            'birthdate' => ['required', 'max:255'],
            'purok_id' => ['required', 'integer'],
            'occupation' => ['nullable', 'string', 'max:255'],
            'contact_no' => ['required', 'string', 'max:255'],
            'disconnection' => ['nullable', 'string', 'max:255'],
            'banned_date' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:active,inactive,banned'],
        ];
    }
}
