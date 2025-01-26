<?php

use App\Models\Book;
use App\Models\Rental;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\{post, get};

// Auth routes tests
it('can register a user', function () {
    $response = post('/api/register', [
        'name' => 'Test User',
        'email' =>  fake()->unique()->safeEmail(),
        'password' => '5uperStrongPassword@123',
        'password_confirmation' => '5uperStrongPassword@123',
    ], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(201);
});

it('cannot register a user with invalid data', function () {
    $response = post('/api/register', [
        'name' => '',
        'email' => 'invalid-email',
        'password' => 'pass',
        'password_confirmation' => 'different',
    ], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(422);
});

it('can login a user', function () {
    $email = fake()->unique()->safeEmail();
    $user = User::factory()->create([
        'email' => $email,
        'password' => Hash::make('Password@123'),
    ]);
    //random
    $response = post('/api/login', [
        'email' => $email,
        'password' => 'Password@123',
    ], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure(['token']);
});

it('cannot login with invalid credentials', function () {
    $response = post('/api/login', [
        'email' => 'nonexistent@example.com',
        'password' => 'wrongpassword',
    ], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(422);
});

// Protected routes tests
beforeEach(function () {
    $this->user = User::factory()->create();
    Sanctum::actingAs($this->user);
});

it('can logout a user', function () {
    $response = post('/api/logout', [], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(200);
});

it('can get authenticated user', function () {
    $response = get('/api/user', [], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(200);
    $response->assertJson(['id' => $this->user->id]);
});

// Book Rental routes tests
it('can search books by title', function () {
    $response = get('/api/books/search?title=Pride', [], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        '*' => [
            'id',
            'title',
            'author',
            'genre',
        ],
    ]);
});

it('can search books by genre', function () {
    $response = get('/api/books/search?genre=Romance', [], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        '*' => [
            'id',
            'title',
            'author',
            'genre',
        ],
    ]);
});

it('can rent a book', function () {
    $response = post('/api/rentals/rent', [
        'book_id' => 1,
    ], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(200);
});

it('cannot rent a book that is already rented', function () {
    $rental = Rental::factory()->create(['user_id' => $this->user->id]);

    $response = post('/api/rentals/rent',  [
        'book_id' => $rental->book_id,
    ], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(400);
});

it('can return a book', function () {
    $rental = Rental::factory()->create(['user_id' => $this->user->id]);
    $response = post('/api/rentals/return/' . $rental->id, [], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(200);
});

it('can get rental history', function () {
    Rental::factory()->count(3)->create(['user_id' => $this->user->id]);

    $response = get('/api/rentals/history', [], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(200);
    $response->assertJsonCount(3);
});

it('can get the most popular book', function () {
    $response = get('/api/books/popular', [], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(200);
});

it('can get the most overdue book', function () {
    $response = get('/api/books/overdue', [], [
        'Accept' => 'application/json',
    ]);

    $response->assertStatus(200);
});
