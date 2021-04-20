<?php

namespace MasterDmx\LaravelAdminMediaUI;

class UIMiddleware
{
    public function handle($request, \Closure $next)
    {
        dd('Сработал миддлевар');

        return $next($request);
    }
}
