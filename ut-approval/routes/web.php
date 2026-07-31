<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DocumentController;
use App\Models\Document;

Route::middleware('guest')->group(function () {

    Route::get('/', function () {
        return Inertia::render('Login', [
            'title' => 'Login'
        ]);
    })->name('login');
    Route::post('/login', [UserController::class, 'login']);

    Route::get('/register', function () {
        return Inertia::render('Register', [
            'title' => 'Register'
        ]);
    });
    Route::post('/register', [UserController::class,'register']);

});

Route::get('/alur', function () {
    return Inertia::render('Alur', [
        'title' => 'Alur'
    ]);
});


Route::middleware('auth')->group(function () {
    
    // Tampilan Halaman Dashboard
    Route::get('/dashboard', function () {
        $documents = Document::where('user_id', auth()->id())->get();
        return Inertia::render('Dashboard', [
            'title' => 'Dashboard',
            'documents' => $documents
        ]);
    })->middleware(['auth', 'verified'])->name('dashboard');
    
    Route::get('/documents/{id}', [DocumentController::class, 'show'])->name('documents.show');

    // Tampilan Halaman Submit
    Route::get('/submit', function () {
        return Inertia::render('Submit', [
            'title' => 'Submit',
            'auth' => [
                'user' => request()->user() 
            ]
        ]);
    });

    Route::post('/submit', [DocumentController::class, 'store']);

    Route::get('/profile', function () {
        return Inertia::render('Profile', [
            'title' => 'Profile',
            'auth' => [
                'user' => request()->user() 
            ]
        ]);
    })->name('profile');

    Route::get('/profile/edit', function () {
        return Inertia::render('Edit', [
            'title' => 'Edit',
            'auth' => [
                'user' => request()->user() 
            ]
        ]);
    })->name('profile.edit');

    Route::put('/profile/edit', [UserController::class, 'update']);

    // Proses Keluar Akun
    Route::post('/logout', [UserController::class, 'logout']);

    Route::delete('/delete-account',[UserController::class, 'delete']);
});