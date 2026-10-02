<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminController extends Controller
{
    //Register
    public function register(Request $request) {
        $credentials = $request->validate([
            'nama_full' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:admins',
            'username' => 'required|string|max:100|unique:admins',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = Admin::create([
            'nama_full' => $request->nama_full,
            'email' => $request->email,
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);

        Auth::guard('admin')->login($user);
        return redirect()->route('dashboard');
    }

    //Login
    public function login(Request $request) {
        $credentials = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        if(Auth::guard('admin')->attempt($credentials)) {
            return redirect()->route('dashboardAdmin');
        }
        return back()->withErrors([
            'username' => 'Username atau Password salah'
        ]);
    }

    public function logoutAdmin(Request $request) {
        Auth::guard('admin')->logout();
        return redirect()->route('loginAdmin');
    }

    public function deleteAdmin(Request $request) {
        /** @var Admin $user */
        $user = Auth::guard('admin')->user();
        Auth::guard('admin')->logout();
        $user->delete();
        return redirect()->route('loginAdmin')->with('message', 'Akun telah dihapus');
    }

    public function updateAdmin(Request $request) {
        /** @var Admin $user */
        $user = Auth::user();
        $request->validate([
            'nama_full' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:admins,email,'.$user->id,
            'username' => 'required|string|max:100|unique:admins,username,'.$user->id,
            'password' => 'nullable|string|min:8|confirmed',
        ], [
            'email.unique' => 'Maaf, email ini sudah terdaftar',
            'username.unique' => 'Maaf, username ini sudah terdaftar',
        ]);
        $userUpdate = [
            'nama_full' => $request->nama_full,
            'email' => $request->email,
            'username' => $request->username,
        ];
        if ($request->filled('password')) {
            $userUpdate['password'] = Hash::make($request->password);
        }
        $user->update($userUpdate);
        return redirect()->route('admin.profile');
    }
}