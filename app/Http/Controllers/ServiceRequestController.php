<?php

namespace App\Http\Controllers;

use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = ServiceRequest::query();
        
        // Filter berdasarkan status jika ada
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter berdasarkan jenis layanan jika ada
        if ($request->filled('service_type')) {
            $query->where('service_type', $request->service_type);
        }
        
        // Pencarian berdasarkan nama atau kontak
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('contact', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        
        $serviceRequests = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        
        $statusOptions = [
            ['value' => '', 'label' => 'Semua Status'],
            ['value' => 'pending', 'label' => 'Pending'],
            ['value' => 'in_progress', 'label' => 'Dalam Proses'],
            ['value' => 'completed', 'label' => 'Selesai'],
            ['value' => 'cancelled', 'label' => 'Dibatalkan'],
        ];
        
        $serviceTypeOptions = [
            ['value' => '', 'label' => 'Semua Jenis'],
            ['value' => 'perbaikan', 'label' => 'Perbaikan Alat'],
            ['value' => 'konsultasi', 'label' => 'Konsultasi Teknis'],
            ['value' => 'instalasi', 'label' => 'Instalasi Baru'],
        ];

        return Inertia::render('ServiceRequest/Index', [
            'serviceRequests' => $serviceRequests,
            'statusOptions' => $statusOptions,
            'serviceTypeOptions' => $serviceTypeOptions,
            'filters' => $request->only(['status', 'service_type', 'search']),
        ]);
    }
    
    public function updateStatus(Request $request, ServiceRequest $serviceRequest)
    {
        $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled'
        ]);
        
        $serviceRequest->update([
            'status' => $request->status
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Status permintaan layanan berhasil diperbarui'
        ]);
    }
}