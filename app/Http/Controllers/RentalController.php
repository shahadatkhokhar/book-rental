<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rental;
use Illuminate\Support\Facades\Auth;

class RentalController extends Controller
{
    /**
     * Rent a book.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * The request should contain:
     * - book_id: integer, required, exists in books table
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * The JSON response will contain:
     * - id: integer, the rental ID
     * - user_id: integer, the ID of the user who rented the book
     * - book_id: integer, the ID of the rented book
     * - rented_at: string, the timestamp when the book was rented
     * - due_at: string, the due date for returning the book
     * - created_at: string, the timestamp when the rental record was created
     * - updated_at: string, the timestamp when the rental record was last updated
     */
    public function rentBook(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
        ]);

        //check if the book is already rented and returned_at is not null
        $isRented = Rental::where('book_id', $request->book_id)
            ->where('user_id', Auth::id())
            ->where('returned_at', null)
            ->first();

        if ($isRented) {
            return response()->json(['message' => 'Book is already rented'], 400);
        }


        $rental = Rental::create([
            'user_id'   => Auth::id(),
            'book_id'   => $request->book_id,
            'rented_at' => now(),
            'due_at'  => now()->addWeeks(2),
        ]);

        return response()->json($rental);
    }

    /**
     * Return a rented book.
     *
     * @param  int  $rentalId
     *
     * The request should contain:
     * - rentalId: integer, required, the ID of the rental record
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * The JSON response will contain:
     * - message: string, a success message
     */
    public function returnBook($rentalId)
    {
        $rental = Rental::where('id', $rentalId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $rental->update(['returned_at' => now()]);

        return response()->json(['message' => 'Book returned successfully']);
    }

    /**
     * Get the rental history of the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * The JSON response will contain an array of rental records, each containing:
     * - id: integer, the rental ID
     * - user_id: integer, the ID of the user who rented the book
     * - book_id: integer, the ID of the rented book
     * - rented_at: string, the timestamp when the book was rented
     * - due_at: string, the due date for returning the book
     * - returned_at: boolean, whether the book has been returned
     * - created_at: string, the timestamp when the rental record was created
     * - updated_at: string, the timestamp when the rental record was last updated
     * - book: object, the book details
     */
    public function rentalHistory()
    {
        $rentals = Rental::where('user_id', Auth::id())
            ->with('book')
            ->get();

        return response()->json($rentals);
    }
}
