<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\Rental;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RentalFactory extends Factory
{
    protected $model = Rental::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'book_id' => Book::factory(),
            'rented_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'due_at' => $this->faker->dateTimeBetween('now', '+1 month'),
            'returned_at' => null,
        ];
    }
}
