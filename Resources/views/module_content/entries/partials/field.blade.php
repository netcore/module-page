@php
    $fieldType = object_get($field, 'type');
    $fieldName = object_get($field, 'key');
    $fieldLabel = object_get($field, 'title');

    $translation = null;
    if(isset($entry)) {
        $translation = $entry->translations->where('locale', $language->iso_code)->first();
    }
@endphp
@if($fieldType == 'file')
    <label for="" class="form-label">{{ ucfirst($fieldLabel) }}
        </label>
            <div class="form-group no-margin">
                <input
                        type="file"
                        data-name="html-block-images[]"
                        class="form-control form-input inline"
                        multiple
                >
            </div>
@else
    <div class="form-group">
        <label for="" class="form-label">{{ ucfirst($fieldLabel) }}</label>

        @if($fieldType == 'textarea')
            <textarea
                    maxlength="8000000"
                    rows="10"
                    name="translations[entry][{{ $language->iso_code }}][{{ $fieldName }}]"
                    class="form-control image-blocks-summernote width-800 js-input"
            >
                {{ isset($translation->fields) ? object_get($translation->fields->where('key', $fieldName)->first(), 'value') : null }}
            </textarea>
        @elseif($fieldType == 'checkbox')
            <input
                    type="checkbox"
                    value="1"
                    name="translations[entry][{{ $language->iso_code }}][{{ $fieldName }}]"
                    class="js-input"
            >
        @elseif($fieldType == 'select')
            <select
                    name="translations[entry][{{ $language->iso_code }}][{{ $fieldName }}]"
                    class="form-control"
            >

            </select>
        @else
            <input
                    type="text"
                    name="translations[entry][{{ $language->iso_code }}][{{ $fieldName }}]"
                    class="form-control"
            >
        @endif
    </div>

@endif