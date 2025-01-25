<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;

class BookController extends Controller
{
    /**
     * Search for books.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * The request can contain:
     * - title: string, optional, partial or full title of the book
     * - genre: string, optional, genre of the book
     *
     * @return \Illuminate\Http\JsonResponse
     *
     * The JSON response will contain an array of book records, each containing:
     * - id: integer, the book ID
     * - title: string, the title of the book
     * - author: string, the author of the book
     * - genre: string, the genre of the book
     * - published_at: string, the publication date of the book
     * - created_at: string, the timestamp when the book record was created
     * - updated_at: string, the timestamp when the book record was last updated
     */
    public function search(Request $request)
    {
        $query = Book::query();

        if ($request->has('title')) {
            $query->where('title', 'LIKE', '%' . $request->title . '%');
        }

        if ($request->has('genre')) {
            $query->where('genre', $request->genre);
        }

        return response()->json($query->get());
    }
}
