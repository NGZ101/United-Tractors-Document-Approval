<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ApproverController;
use App\Models\Admin;
use App\Models\Document;
use App\Models\Approver;

Route::middleware('guest')->group(function () {
    //Tampilan Awal Sebelum Login Dan Untuk Login
    Route::get('/', function () {
        return Inertia::render('Login', [
            'title' => 'Login'
        ]);
    })->name('login');
    Route::post('/login', [UserController::class, 'login']);

    //Tampilan Halaman Membuat Akun
    Route::get('/register', function () {
        return Inertia::render('Register', [
            'title' => 'Register'
        ]);
    });
    Route::post('/register', [UserController::class,'register']);

});

Route::prefix('admin')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        //Tampilan Awal Sebelum Login Dan Untuk Login Admin
        Route::get('/loginAdmin', function () {
            return Inertia::render('Admin/LoginAdmin', [
                'title' => 'Login Admin'
            ]);
        })->name('loginAdmin');
        Route::post('/loginAdmin', [AdminController::class, 'login']);
    });

    Route::middleware('auth:admin')->group(function () {
        // Tampilan Halaman Dashboard Dan Halaman Awal Saat Sudah Login Admin
        Route::get('/dashboardAdmin', function () {
            $documents = Document::with('user')->get();
            $approvers = Approver::all();
            return Inertia::render('Admin/DashboardAdmin', [
                'title' => 'Dashboard Admin',
                'documents' => $documents,
                'approvers' => $approvers
            ]);
        })->name('dashboardAdmin');

        Route::get('/documents/{id}', [DocumentController::class, 'showAdmin'])->name('admin.documents.show');
        Route::get('/approvers/{id}', [ApproverController::class, 'showApprover'])->name('admin.approvers.show');
        
        Route::get('/approvers/{id}/edit', function ($id) {
            $approver = Approver::findOrFail($id);
            return Inertia::render('Admin/EditApprover', [
                'title' => 'Edit Approver',
                'approver' => $approver
            ]);
        })->name('admin.approvers.edit');
        Route::put('/approvers/{id}/edit', [ApproverController::class, 'updateApprover'])->name('admin.approvers.update');

        Route::delete('/approvers/{id}', [ApproverController::class, 'deleteApprover'])->name('admin.approvers.delete');
        
        Route::get('/profileAdmin', function (){
            return Inertia::render('Admin/ProfileAdmin', [
                'title' => 'Profile Admin',
                'auth' => [
                    'admin' => request()->user()
                ]
            ]);
        })->name('admin.profile');

        Route::get('/profileAdmin/editAdmin', function (){
            return Inertia::render('Admin/EditAdmin', [
                'title' => 'Edit Admin',
                'auth' => [
                    'admin' => request()->user()
                ]
            ]);
        })->name('admin.edit');
        Route::put('/profileAdmin/editAdmin', [AdminController::class, 'updateAdmin']);

        // Proses Keluar Akun Admin
        Route::post('/logoutAdmin', [AdminController::class, 'logoutAdmin']);

        // Proses Hapus Akun Admin
        Route::delete('/delete-accountAdmin', [AdminController::class, 'deleteAdmin']);

        Route::get('/addApprover', function () {
            return Inertia::render('Admin/AddApprover', [
                'title' => 'Add Approver',
                'auth' => [
                    'user' => request()->user()
                ]
            ]);
        });
        Route::post('/addApprover', [ApproverController::class, 'store']);
    });

});

Route::get('/alur', function () {
    return Inertia::render('Alur', [
        'title' => 'Alur'
    ]);
});


Route::middleware('auth')->group(function () {
    
    // Tampilan Halaman Dashboard Dan Halaman Awal Saat Sudah Login
    Route::get('/dashboard', function () {
        $documents = Document::where('user_id', auth()->id())->get();
        return Inertia::render('Dashboard', [
            'title' => 'Dashboard',
            'documents' => $documents
        ]);
    })->middleware(['auth', 'verified'])->name('dashboard');
    
    Route::get('/documents/{id}', [DocumentController::class, 'show'])->name('documents.show');
    
    Route::get('/documents/{id}/retry', [DocumentController::class, 'showRetry'])->name('documents.showRetry');
    Route::post('/documents/{id}/retry', [DocumentController::class, 'retry'])->name('documents.retry');

    Route::get('documents/{id}/signature', [DocumentController::class, 'signature'])->name('documents.signature');

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
    
    // Proses Hapus Akun
    Route::delete('/delete-account',[UserController::class, 'delete']);
});

Route::get('/approval/{id}/download', [DocumentController::class, 'download'])->name('documents.download');
Route::get('/approval/{id}/approve', [DocumentController::class, 'approve'])->name('documents.approve')->middleware('signed');
Route::get('/approval/{id}/reject', [DocumentController::class, 'showReject'])->name('documents.reject')->middleware('signed');
Route::post('/approval/{id}/reject', [DocumentController::class, 'processRejection'])->name('documents.processRejection');

Route::get('/result', function () {
        return Inertia::render('Result', [
            'message' => session('message', 'Tidak ada pesan')
        ]);
    })->name('result');
