@php
    $fieldName = array_get($field, 'name');
    $fieldLabel = array_get($field, 'label');
    $fieldType = array_get($field, 'type');
    $fieldValue = array_get($field, 'value');
    $fieldStyles = array_get($field, 'styles');
    $fieldOptions = (array) array_get($field, 'options');

    $imageWidth = array_get($fieldStyles, 'image_width');
    $notRequired = array_get($fieldStyles, 'not_required', 0);
@endphp

@if($fieldType == 'file')
    <tr>
        <td class="text-align-right">
            {{ ucfirst($fieldLabel) }}
        </td>
        <td class="padding-5">
            <div class="form-group no-margin">
                <input
                        type="file"
                        data-name="html-block-images[]"
                        data-field="{{ $fieldName }}"
                        class="form-control form-input inline"
                        data-image-width="{{ $imageWidth }}"
                        data-not-required="{{ $notRequired }}"
                >
                <span class="error-span"></span>
            </div>
        </td>
    </tr>
@else
    <tr>
        <td class="text-align-right">
            {{ ucfirst($fieldLabel) }}
        </td>
        <td class="padding-5">
            <div class="form-group no-margin">
                @if($fieldType == 'textarea')
                    <textarea
                            maxlength="8000000"
                            data-field="{{ $fieldName }}"
                            data-locale="{{ $language->iso_code }}"
                            data-not-required="{{ $notRequired }}"
                            data-name="translations[{{ $fieldName }}][{{ $language->iso_code }}]"
                            class="form-control image-blocks-summernote width-800"
                    ></textarea>
                @elseif($fieldType == 'checkbox')
                    <input
                            type="checkbox"
                            value="1"
                            data-field="{{ $fieldName }}"
                            data-locale="{{ $language->iso_code }}"
                            data-not-required="{{ $notRequired }}"
                            data-name="translations[{{ $fieldName }}][{{ $language->iso_code }}]"
                            class=""
                    >
                @elseif($fieldType == 'select')
                    <select
                            data-field="{{ $fieldName }}"
                            data-locale="{{ $language->iso_code }}"
                            data-not-required="{{ $notRequired }}"
                            data-name="translations[{{ $fieldName }}][{{ $language->iso_code }}]"
                            class="form-control"
                    >
                        @php
                            $selectData = array_get($field, 'select_data');
                        @endphp
                        @foreach($selectData as $id => $name)
                            <option {{ $fieldValue==$id ? 'checked' : '' }} value="{{ $id }}">{{ $name }}</option>
                        @endforeach
                    </select>
                @else
                    <input
                            type="text"
                            maxlength="191"
                            data-field="{{ $fieldName }}"
                            data-locale="{{ $language->iso_code }}"
                            data-not-required="{{ $notRequired }}"
                            data-name="translations[{{ $fieldName }}][{{ $language->iso_code }}]"
                            class="form-control"
                    >
                @endif
                <span class="error-span"></span>
            </div>
        </td>
    </tr>
@endif