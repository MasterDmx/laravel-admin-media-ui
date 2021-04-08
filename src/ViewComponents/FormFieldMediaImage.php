<?php

namespace MasterDmx\LaravelAdminMediaUI\ViewComponents;

use Illuminate\View\Component;

class FormFieldMediaImage extends Component
{
    /**
     * Уникальное название внутри хранилища
     *
     * @var string
     */
    public string $name;

    /**
     * Контекст
     *
     * @var string
     */
    public string $context;

    /**
     * ID
     *
     * @var string
     */
    public string $id;

    /**
     * Уникальный TITLE аттрибут
     *
     * @var string
     */
    public string $title;

    /**
     * FormFieldMediaImage constructor.
     *
     * @param string $name
     * @param string $context
     * @param string $id
     * @param string $title
     */
    public function __construct($name, $context = 'default', $id = '', $title = '')
    {
        $this->name = $name;
        $this->context = $context;
        $this->id = $id;
        $this->title = $title;
    }

    public function render()
    {
        return view('admin::components.form_field_media_image');
    }
}
