<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rental;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

    /**
     * Get the most overdue book.
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * The JSON response will contain:
     * - title: string, the title of the most overdue book
     * - overdue_days: integer, the number of days the book is overdue
     */
    public function getMostOverdueBook()
    {
        $mostOverdueBook = DB::table('rentals')
            ->select('books.title', DB::raw('DATEDIFF(NOW(), rentals.due_at) as overdue_days'))
            ->join('books', 'books.id', '=', 'rentals.book_id')
            ->whereNull('rentals.returned_at')
            ->where('rentals.due_at', '<', now())
            ->orderByDesc('overdue_days')
            ->first();

        return response()->json($mostOverdueBook);
    }

    /**
     * Get the most popular book.
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * The JSON response will contain:
     * - title: string, the title of the most popular book
     * - rental_count: integer, the number of times the book has been rented
     */
    public function getMostPopularBook()
    {
        $mostPopularBook =  DB::table('rentals')
            ->select('books.title', DB::raw('COUNT(rentals.id) as rental_count'))
            ->join('books', 'books.id', '=', 'rentals.book_id')
            ->groupBy('books.title')
            ->orderByDesc('rental_count')
            ->first();

        return response()->json($mostPopularBook);
    }
}
