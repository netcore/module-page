<?php

Route::group([
    'prefix'     => 'admin',
    'as'         => 'content::',
    'middleware' => ['web', 'auth.admin'],
    'namespace'  => 'Modules\Content\Http\Controllers\Admin'
], function () {

    /**
     * Index
     */

    Route::get('/content', [
        'as' => 'content.index',
        'uses' => 'ContentController@index'
    ]);


    /**
     * Sections
     */

    Route::get('/content/sections/pagination', [
        'as' => 'sections.pagination',
        'uses' => 'SectionController@pagination'
    ]);


    /**
     * Channels
     */

    Route::get('/content/channels/{channel}/edit', [
        'as' => 'channels.edit',
        'uses' => 'ChannelController@edit'
    ]);

    /**
     * Entries
     */

    Route::get('/content/entries/pagination', [
        'as' => 'entries.pagination',
        'uses' => 'EntryController@pagination'
    ]);

    Route::get('/content/entries/{entry}/edit', [
        'as' => 'entries.edit',
        'uses' => 'EntryController@edit'
    ]);
});
