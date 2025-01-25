<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle user registration.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * The request should contain:
     * - name: string, required, max 255 characters
     * - email: string, required, email format, max 255 characters, unique in users table
     * - password: string, required, confirmed, min 8 characters, mixed case, includes numbers and symbols, uncompromised
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * The JSON response will contain:
     * - message: string, a success message
     * - token: string, the personal access token
     * - user: object, the registered user details
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)    // Must be at least 8 characters
                    ->mixedCase()   // Must include both upper and lower case letters
                    ->numbers()     // Must include at least one number
                    ->symbols()     // Must include at least one symbol
                    ->uncompromised(), // Optionally check if it has been exposed in data breaches
            ],
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Create a personal access token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully.',
            'token'   => $token,
            'user'    => $user
        ], 201);
    }

    /**
     * Handle user login.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * The request should contain:
     * - email: string, required, email format
     * - password: string, required
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * The JSON response will contain:
     * - message: string, a success message
     * - token: string, the personal access token
     * - user: object, the authenticated user details
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Revoke old tokens if you want only one active token per login
        // $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'token'   => $token,
            'user'    => $user
        ], 200);
    }

    /**
     * Handle user logout.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * The JSON response will contain:
     * - message: string, a success message
     */
    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.'
        ]);
    }
}
