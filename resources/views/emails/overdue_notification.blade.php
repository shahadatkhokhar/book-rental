<!DOCTYPE html>
<html>

<head>
    <title>Overdue Book Rental Notification</title>
</head>

<body>
    <h1>Overdue Book Rental Notification</h1>
    <p>Dear {{ $rental->user->name }},</p>
    <p>This is a reminder that the following book rental is overdue:</p>
    <ul>
        <li><strong>Title:</strong> {{ $rental->book->title }}</li>
        <li><strong>Author:</strong> {{ $rental->book->author }}</li>
        <li><strong>Rented At:</strong> {{ $rental->rented_at }}</li>
        <li><strong>Due Date:</strong> {{ $rental->due_at }}</li>
    </ul>
    <p>Please return the book as soon as possible to avoid any late fees.</p>
    <p>Thank you.</p>
</body>

</html>
