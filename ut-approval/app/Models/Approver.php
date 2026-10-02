<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Approver extends Model
{
    use HasFactory;

    protected $table = 'approvers';

    protected $fillable = [
        'nama_full',
        'email',
        'no_telp',
        'role',
        'divisi',
        'ttd_img'
    ];

    public function user() {
        return $this -> belongsTo(User::class);
    }
}