<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Jacob Tinston | Software & AI Engineer') }}</title>

        {{-- SEO --}}
        <meta name="description" content="I'm a self-taught software and AI engineer building thoughtful, end-to-end products.">
        <meta name="author" content="Jacob Tinston">
        <link rel="canonical" href="{{ url()->current() }}">

        {{-- Open Graph --}}
        <meta property="og:site_name" content="Jacob Tinston">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="{{ config('app.name', 'Jacob Tinston | Software & AI Engineer') }}">
        <meta property="og:description" content="I'm a self-taught software and AI engineer building thoughtful, end-to-end products.">
        <meta property="og:image" content="{{ url('/logo.png') }}">
        <meta property="og:image:alt" content="Jacob Tinston">
        <meta property="og:locale" content="en_GB">

        {{-- Twitter / X --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ config('app.name', 'Jacob Tinston | Software & AI Engineer') }}">
        <meta name="twitter:description" content="I'm a self-taught software and AI engineer building thoughtful, end-to-end products.">
        <meta name="twitter:image" content="{{ url('/logo.png') }}">

        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=outfit:300,400,500,600|cormorant-garamond:400,500,600,700" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="overflow-x-hidden font-sans antialiased">
        @inertia
    </body>
</html>
