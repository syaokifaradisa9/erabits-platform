<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServiceRequestController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'contact' => 'required|string|max:255',
            'service_type' => 'required|in:perbaikan,konsultasi,instalasi',
            'description' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $serviceRequest = ServiceRequest::create([
            'name' => $request->name,
            'contact' => $request->contact,
            'service_type' => $request->service_type,
            'description' => $request->description,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Permintaan layanan berhasil dikirim',
            'service_request' => $serviceRequest
        ], 201);
    }
}