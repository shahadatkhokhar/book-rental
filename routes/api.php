<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\RentalController;
use Illuminate\Support\Facades\Log;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protect these routes with Sanctum authentication
// on token not found send 401 response

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// Book Rental routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('books/search', [BookController::class, 'search']);
    Route::post('rentals/rent', [RentalController::class, 'rentBook']);
    Route::post('rentals/return/{id}', [RentalController::class, 'returnBook']);
    Route::get('rentals/history', [RentalController::class, 'rentalHistory']);
    Route::get('books/popular', [RentalController::class, 'getMostPopularBook']);
    Route::get('books/overdue', [RentalController::class, 'getMostOverdueBook']);
});
