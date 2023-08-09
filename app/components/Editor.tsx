import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

type Props = {
  /**
   * The initial value of the editor.
   */
  initialValue?: string;

  /**
   * The name of the textarea that will be used to store the editor's content.
   * This will be used when submitting the form.
   */
  name: string;
};

export default function Editor({ initialValue, name }: Props) {
  return (
    <>
      <TinyMCEEditor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        textareaName={name}
        initialValue={initialValue}
        init={{
          height: 500,
          width: '100%',
          menubar: false,
          images_upload_url: '/api/images/upload',
          automatic_uploads: true,
          file_picker_callback: function (callback, value, meta) {
            // Taken from the TinyMCE documentation: https://www.tiny.cloud/docs/tinymce/6/image/#interactive-example
            const input = document.createElement('input');
            input.type = 'file';
            input.setAttribute('accept', 'image/*');

            input.addEventListener('change', (e) => {
              if (!e.target) return;
              const input = e.target as HTMLInputElement;
              if (!input.files?.length) return;
              const file = input.files[0];

              const reader = new FileReader();
              reader.addEventListener('load', () => {
                /*
                  Note: Now we need to register the blob in TinyMCEs image blob
                  registry. In the next release this part hopefully won't be
                  necessary, as we are looking to handle it internally.
                */
                const id = 'blobid' + new Date().getTime();
                const blobCache = (window as any).tinymce.activeEditor
                  .editorUpload.blobCache;
                const base64 = (reader.result as string)?.split(',')[1];
                const blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);

                /* call the callback and populate the Title field with the file name */
                callback(blobInfo.blobUri(), { title: file.name });
              });
              reader.readAsDataURL(file);
            });

            input.click();
          },
          file_picker_types: 'image',
          a11y_advanced_options: true,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'preview',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | fontfamily styles | ' +
            'bold italic forecolor | image media | alignleft aligncenter ' +
            `alignright alignjustify | bullist numlist outdent indent | ` +
            'removeformat | help',
          block_formats:
            'Paragraph=p; Heading 1=h2; Heading 2=h3; Heading 3=h4;',
          font_family_formats:
            'Caveat=Caveat,cursive;DM Sans=DM Sans,sans-serif',
          content_style:
            '@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap");body { font-family:DM Sans,sans-serif; font-size:16px } h1,h2,h3,h4,h5,h6 { font-family:Caveat,cursive }',
        }}
      />
    </>
  );
}
