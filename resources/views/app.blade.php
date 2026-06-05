<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mawthiq</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/src/index.jsx'])
</head>
<body class="antialiased">
    <div id="root"></div>
</body>
</html>
