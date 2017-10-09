<?php

return [

    'sections' => [

    ],

    'channels' => [
        'news'    => [
            'template' => 'module-content.news.index'
        ],
        'reports' => [
            "template" => 'module-content.reports.index'
        ],
    ],

    'entries' => [

    ],

    'widgets' => [
        [
            'name'              => 'Simple text',
            'key'               => 'simple_text',
            'frontend_template' => 'content::module_content.widgets.simple_text.frontend',
            'backend_template'  => 'content::module_content.widgets.simple_text.backend',
            'javascript'        => 'simple_text.js'
        ],
        [
            'name'              => 'Testimonials',
            'key'               => 'testimonials',
            'frontend_template' => 'content::module_content.widgets.testimonials.frontend',
            'backend_template'  => null
        ],
        [
            'name'              => 'Employees',
            'key'               => 'employees',
            'frontend_template' => 'content::module_content.widgets.employees.frontend',
            'backend_template'  => null
        ],
        [
            'name'              => 'Gallery slider',
            'key'               => 'gallery_slider',
            'frontend_template' => 'content::module_content.widgets.gallery_slider.frontend',
            'backend_template'  => 'content::module_content.widgets.gallery_slider.backend',
            'javascript'        => 'gallery_slider.js'
        ]
    ],

    'admin_panel' => [
        'views'        => [
            'extends' => 'layouts.admin',
            'section' => 'layouts.content'
        ],
        'translations' => [
            'index' => [
                'actions' => 'Actions',
            ]
        ]
    ]
];
