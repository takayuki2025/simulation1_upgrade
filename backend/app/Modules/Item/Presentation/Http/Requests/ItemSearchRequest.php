<?php

namespace App\Modules\Item\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class ItemSearchRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'q' => ['required', 'string', 'max:100'],
        ];
    }

    public function query(): string
    {
        return $this->get('q');
    }
}
