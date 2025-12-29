<?php

namespace App\Modules\Auth\Application\Service;

use App\Modules\Auth\Domain\ValueObject\AuthPrincipal;
use Illuminate\Http\Request;

final class AuthContext
{
    public function __construct(
        private Request $request
    ) {
    }

    /**
     * 現在の認証主体を返す
     */
    public function principal(): AuthPrincipal
    {
        $principal = $this->request->attributes->get('auth_principal');

        if (! $principal instanceof AuthPrincipal) {
            throw new \DomainException('Unauthenticated');
        }

        return $principal;
    }
}
