<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller 
{

    public function sendFcmNotification(Request $request)
    {
        try {

            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'body' => 'required|string|max:255',
                'fcm_token' => 'required|string',
                'data' => 'nullable|array',
            ]);

            // Inisialisasi Firebase
            $firebase = (new Factory)
                ->withServiceAccount(config('firebase.projects.app.credentials'));

            $messaging = $firebase->createMessaging();

            // Buat pesan notifikasi
            $message = CloudMessage::withTarget('token', $validatedData['fcm_token'])
                ->withNotification([
                    'title' => $validatedData['title'],
                    'body' => $validatedData['body'],
                ])
                ->withData($validatedData['data'] ?? []);
            
            // Kirim notifikasi
            $messaging->send($message);

            return response()->json(['success' => true, 'message' => 'Notification sent successfully.']);

        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi FCM: ' . $e->getMessage(), [
                'fcm_token' => $request->fcm_token,
                'title' => $request->title,
                'body' => $request->body,
            ]);

            return response()->json(['success' => false, 'message' => 'Gagal mengirim notifikasi FCM: ' . $e->getMessage()], 500);
        }
    }

}

