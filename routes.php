<?php

use Illuminate\Support\Facades\Route;
use MasterDmx\LaravelAdminMediaUI\UIController;

Route::get('vendor/media-manager/files',          [UIController::class, 'files'])->name('vendor.media_manager.files');
Route::post('vendor/media-manager/upload',        [UIController::class, 'upload'])->name('vendor.media_manager.upload');
Route::post('vendor/media-manager/update/{id}',   [UIController::class, 'update'])->name('vendor.media_manager.update');
Route::delete('vendor/media-manager/remove/{id}', [UIController::class, 'remove'])->name('vendor.media_manager.remove');
Route::post('vendor/media-manager/use/{id}',   [UIController::class, 'use'])->name('vendor.media_manager.use');

