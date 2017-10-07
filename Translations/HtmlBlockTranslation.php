<?php

namespace Modules\Content\Translations;

use Illuminate\Database\Eloquent\Model;

class HtmlBlockTranslation extends Model
{

    /**
     * @var string
     */
    protected $table = 'netcore_content__html_block_translations';

    /**
     * @var array
     */
    protected $fillable = [
        'content',
        'locale' // This is very important
    ];

    /**
     * @var bool
     */
    public $timestamps = false;

}
