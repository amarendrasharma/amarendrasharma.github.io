<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('index');
})->name('home');

Route::get('/resume', function () {
    return view('resume');
})->name('resume');
Route::prefix('prev')->group(function () {

    Route::view('/resume', 'prev.resume');
});
// Route::view('/resume', 'prev.resume');
Route::view('/projects', 'projects');
Route::view('/contact', 'contact');
Route::view('/me', 'me');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
