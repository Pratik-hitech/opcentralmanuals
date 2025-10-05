import { forwardRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichTextEditor = forwardRef(function TinyEditor(props, ref) {
  const { value, onChange, onImageUpload, ...rest } = props;

  const defaultInit = {
    height: 500,
    menubar: false,
    statusbar: false,
    toolbar_items_size: "small",

    plugins:
      "advlist autolink lists link image charmap preview anchor " +
      "searchreplace visualblocks code codesample fullscreen " +
      "quickbars charmap wordcount emoticons " +
      "insertdatetime media table help wordcount hr",

    toolbar:
      "undo redo | blocks fontsize | bold italic underline strikethrough | " +
      "forecolor backcolor removeformat | align numlist bullist | " +
      "lineheight outdent indent | link imageupload | code codesample | " +
      "table | charmap emoticons blockquote hr | " +
      "fullscreen preview | searchreplace ",

    font_size_formats: "8px 10px 12px 14px 16px 18px 24px 36px 48px",

    formats: {
      inlinecode: { inline: "code" },
    },
    style_formats: [
      { title: "Inline code", format: "inlinecode" },
      { title: "Code block", format: "code" },
    ],

    quickbars_selection_toolbar: "bold italic underline strikethrough | link",
    quickbars_insert_toolbar: "",
    toolbar_mode: "sliding",

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
