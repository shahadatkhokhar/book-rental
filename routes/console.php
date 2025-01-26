<?php

use App\Mail\OverdueNotification;
use App\Models\Rental;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::call(function () {
    $updated = Rental::where('due_at', '<', now())
        ->where('returned_at', null)
        ->update(['is_overdue' => true]);
    $overdueRentals = Rental::where('is_overdue', true)->get();
    Log::info('Overdue rentals: ' . $overdueRentals->count());
    foreach ($overdueRentals as $rental) {
        $user = $rental->user;
        Mail::to($user->email)->bcc(env("ADMIN_EMAIL"))->send(new OverdueNotification($rental));
    }
})->daily();
