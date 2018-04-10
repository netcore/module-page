@php
    $fieldType = object_get($field, 'type');
    $fieldName = object_get($field, 'key');
    $fieldLabel = object_get($field, 'title');

@endphp
@if($fieldType == 'file')
    <label for="" class="form-label">{{ ucfirst($fieldLabel) }}</label>
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
                    name="global_field[{{ $fieldName }}]"
                    class="form-control image-blocks-summernote width-800 js-input"
            >
                {{ isset($entry) ? object_get($entry->globalFields->where('key', $fieldName)->first(), 'value') : null }}
            </textarea>
        @elseif($fieldType == 'checkbox')
            <input
                    type="checkbox"
                    value="1"
                    name="global_field[{{ $fieldName }}]"
                    class="js-input"
            >
        @elseif($fieldType == 'select')
            <select
                    name="global_field[{{ $fieldName }}]"
                    class="form-control"
            >

            </select>
        @else
            <input
                    type="text"
                    name="global_field[{{ $fieldName }}]"
                    class="form-control"
                    value="{{ isset($entry->globalFields) ? object_get($entry->globalFields->where('key', $fieldName)->first(), 'value') : null }}"
            >
        @endif
    </div>

@endif