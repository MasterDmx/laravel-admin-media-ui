<x-admin-form-block :title="$title" size="xl" :align-center="false">
    <div class="media-fields">
        <div class="row media-image-list">
             <x-admin-form-field-media-image :name="$name" :context="$context" :id="$mediaId" :title="$mediaTitle" classes="col-md-4 col-lg-3 media-image-list__item"/>
        </div>
    </div>
</x-admin-form-block>
