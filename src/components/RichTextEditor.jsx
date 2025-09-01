import { forwardRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichTextEditor = forwardRef(function TinyEditor(props, ref) {
  const { value, onChange, onImageUpload, ...rest } = props;

  const defaultInit = {
    height: 500,
    menubar: false,
    statusbar: false,

    plugins:
      "advlist autolink lists link charmap preview anchor " +
      "searchreplace visualblocks code codesample fullscreen " +
      "insertdatetime media table help wordcount",

    toolbar:
      "undo redo | blocks | bold italic underline forecolor | " +
      "alignleft aligncenter alignright alignjustify | " +
      "bullist numlist outdent indent | removeformat | " +
      "image link | code codesample | preview | fullscreen | help",

    formats: {
      inlinecode: { inline: "code" },
    },
    style_formats: [
      { title: "Inline code", format: "inlinecode" },
      { title: "Code block", format: "code" },
    ],

    content_style:
      "body{font-family:Helvetica,Arial,sans-serif;font-size:14px}" +
      "code{background:#f4f4f4;padding:2px 4px;border-radius:3px}",

    setup: function (editor) {
      editor.on("init", function () {
        const style = document.createElement("style");
        style.textContent = `
      .tox:not([dir=rtl]) .tox-toolbar__group:not(:last-of-type) {
        border-right: 1px solid #d9d9d9 !important;
      }
    `;
        document.head.appendChild(style);
      });

      // Override the default image handler
      editor.ui.registry.addButton("image", {
        icon: "image",
        tooltip: "Insert image",
        onAction: function () {
          if (onImageUpload) {
            onImageUpload();
          }
        },
      });
    },
  };

  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      onInit={(evt, editor) => {
        if (ref) {
          if (typeof ref === "function") ref(editor);
          else ref.current = editor;
        }
      }}
      value={value}
      onEditorChange={(newValue, editor) => onChange(newValue)}
      {...rest}
      init={{ ...defaultInit, ...props.init }}
    />
  );
});

export default RichTextEditor;
