<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewsletterSubscribeRequest;
use Illuminate\Http\JsonResponse;
use Resend;
use Resend\Exceptions\ErrorException;
use Resend\Exceptions\TransporterException;
use Resend\Exceptions\UnserializableResponse;

class NewsletterSubscribeController extends Controller
{
    /**
     * Add the contact to Resend.
     */
    public function __invoke(NewsletterSubscribeRequest $request): JsonResponse
    {
        $key = config('services.resend.key');

        if (empty($key)) {
            return response()->json(['message' => 'Newsletter signup is not configured.'], 503);
        }

        try {
            $resend = Resend::client($key);

            $resend->contacts->create([
                'email' => $request->validated('email'),
                'first_name' => '',
                'last_name' => '',
                'unsubscribed' => false,
            ]);
        } catch (ErrorException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (TransporterException|UnserializableResponse $e) {
            return response()->json(['message' => 'Something went wrong. Please try again later.'], 502);
        }

        return response()->json(['message' => 'Thanks for subscribing!']);
    }
}
