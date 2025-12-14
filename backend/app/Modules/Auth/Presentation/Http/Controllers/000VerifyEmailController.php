<?php

namespace App\Modules\Auth\Presentation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Application\UseCase\VerifyEmailUseCase;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    public function __construct(
        private VerifyEmailUseCase $verifyEmail
    ) {
    }

    public function __invoke(Request $request)
    {
        $userId = (int) $request->route('id');
        $hash   = (string) $request->route('hash');

        $success = $this->verifyEmail->handle($userId, $hash);

        $frontend = config('app.frontend_url');

        if (! $success) {
            return redirect("{$frontend}/email/invalid");
        }

        return redirect("{$frontend}/mypage/profile?verified=true");
    }
}
