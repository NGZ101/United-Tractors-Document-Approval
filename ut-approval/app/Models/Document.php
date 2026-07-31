<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $table = 'documents';

    protected $fillable = [
        'user_id',
        'judul_dokumen',
        'divisi',
        'departemen_email',
        'divisi_email',
        'file_dokumen',
        'sop_pic_email',
        'sop_head_email',
        'status',
        'approval_token',
        'dept_head_approved_at',
        'div_head_approved_at',
        'sop_pic_approved_at',   
        'sop_head_approved_at',  
        'rejected_at',
        'rejected_by_role'
    ];

    public function user() {
        return $this -> belongsTo(User::class);
    }
}
