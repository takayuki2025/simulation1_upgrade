<?php

namespace App\Http\Controllers\Auth;

use App\Application\UseCase\Auth\AuthUseCase;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginOrRegisterRequest;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Carbon\Carbon;


class FirebaseAuthController extends Controller
{
    public function __construct(private AuthUseCase $useCase)
    {
    }

    /**
     * login_or_register
     * Fireabse の ID Token を受け取り → UseCase に丸投げ
     */
    public function handleTokenExchange(Request $request)
    {
        Log::info('FirebaseAuthController@handleTokenExchange called');

        $request->validate([
            'id_token' => ['required', 'string'],
            'name'     => ['nullable', 'string', 'max:255'],
            'email'    => ['nullable', 'email'],
        ]);

        $res = $this->useCase->loginOrRegister(
            idToken: $request->input('id_token'),
            name:    $request->input('name'),
            email:   $request->input('email'),
        );

        if (isset($res['error'])) {
            return response()->json([
                'message' => 'Authentication failed',
                'error'   => $res['error']
            ], 400);
        }

        return response()->json([
            'message' => 'Login or register successful',
            'user'    => $res['user'],
            'token'   => $res['token'],
            'needs_email_verification' => $res['needs_email_verification'],
        ]);
    }

    /**
     * login 専用
     */
    public function login(Request $request)
    {
        Log::info('FirebaseAuthController@login called');

        $request->validate([
            'id_token' => ['required', 'string'],
        ]);

        $res = $this->useCase->login(
            idToken: $request->input('id_token')
        );

        if (isset($res['error'])) {
            return response()->json([
                'message' => 'Login failed',
                'error'   => $res['error']
            ], 400);
        }

        return response()->json([
            'message' => 'Login successful',
            'user'    => $res['user'],
            'token'   => $res['token'],
            'needs_email_verification' => $res['needs_email_verification'],
        ]);
    }

    /**
     * register 専用
     */
    public function register(Request $request)
    {
        Log::info('FirebaseAuthController@register called');

        $request->validate([
            'id_token' => ['required', 'string'],
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['nullable', 'email'],
        ]);

        $res = $this->useCase->register(
            idToken: $request->input('id_token'),
            name:    $request->input('name'),
            email:   $request->input('email'),
        );

        if (isset($res['error'])) {
            return response()->json([
                'message' => 'Register failed',
                'error'   => $res['error']
            ], 400);
        }

        return response()->json([
            'message' => 'Register successful',
            'user'    => $res['user'],
            'token'   => $res['token'],
            'needs_email_verification' => $res['needs_email_verification'],
        ]);
    }
}
