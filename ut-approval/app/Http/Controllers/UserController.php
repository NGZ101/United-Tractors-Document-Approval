<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    //Register
    public function register(Request $request) {
        $credentials = $request->validate([
            'nama_full' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:users',
            'username' => 'required|string|max:100|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'nama_full' => $request->nama_full,
            'email' => $request->email,
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);

        Auth::login($user);
        return redirect()->route('dashboard');
    }

    //Login
    public function login(Request $request) {
        $credentials = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        if(Auth::attempt($credentials)) {
            return redirect()->route('dashboard');
        }
        return back()->withErrors([
            'username' => 'Username atau Password salah'
        ]);
    }

    public function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    public function delete(Request $request) {
        $user = $request->user();
        Auth::logout();
        $user->delete();
        return redirect('/')->with('message', 'Akun telah dihapus');
    }

    public function update(Request $request) {
        $user = $request->user();
        $request->validate([
            'nama_full' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:users,email,'.$user->id,
            'username' => 'required|string|max:100|unique:users,username,'.$user->id,
            'password' => 'nullable|string|min:8|confirmed',
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
        return redirect()->back();
    }
}
