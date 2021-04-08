<?php

namespace MasterDmx\LaravelAdminMediaUI\ViewComponents;

use Illuminate\View\Component;

class FormBlockMediaImage extends Component
{
    /**
     * Формирует заголовок блока с полем
     *
     * @var string
     */
    public string $title;

    /**
     * Контекст
     *
     * @var string
     */
    public string $context;

    /**
     * Уникальное название внутри хранилища
     *
     * @var string
     */
    public string $name;

    /**
     * ID медиа
     *
     * @var string
     */
    public string $mediaId;

    /**
     * Уникальный TITLE аттрибут
     *
     * @var string
     */
    public string $mediaTitle;

    public function __construct($title, $context = 'default', $name = 'image', $mediaId = '', $mediaTitle = '')
    {
        $this->title = $title;
        $this->context = $context;
        $this->name = $name;
        $this->mediaId = $mediaId;
        $this->mediaTitle = $mediaTitle ?? '';
    }

    public function render()
    {
        return view('admin::components.form_block_media_image');
    }
}
